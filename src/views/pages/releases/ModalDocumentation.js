import ConfigData from '../../../config.json';
import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CSidebarNav,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CCloseButton,
  CTabContent,
  CTabPane,
  CTooltip,
  CCollapse,
  CCard,
  CAlert,
} from '@coreui/react'

import TextareaAutosize from 'react-textarea-autosize';

import justificationRequiredImg from './../../../assets/images/exclamation.svg'
import justificationProvidedImg from './../../../assets/images/file-text.svg'

import { DataLoader } from '../../../components/DataLoader';

const sortComments = (comments) => {
  return comments.sort(
    (a, b) => b?.Date && a?.Date ?
      b?.Date.localeCompare(a?.Date)
      : {}
  );
}

const sortDocuments = (documents) => {
  return documents.sort(
    (a, b) => b?.ImportDate && a?.ImportDate ?
      b?.ImportDate.localeCompare(a?.ImportDate)
      : {}
  );
}

const dl = new DataLoader()

const ModalDocumentation = (props) => {
  const [documents, setDocuments] = useState([])
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newDocument, setNewDocument] = useState(false)
  const [newComment, setNewComment] = useState(false)
  const [selectedFile, setSelectedFile] = useState()
  const [error, setError] = useState("")

  const closeModal = () => {
    props.setVisible(false)
  }

  const showError = (e) => {
    setError("Something went wrong: " + e);
    setTimeout(() => { setError('') }, ConfigData.MessageTimeout);
  }

  const loadData = (country) => {
    let promises = []
    promises.push(dl.fetch(ConfigData.RELEASES_ATTACHMENTS_COMMENTS + `?country=${country}`)
      .then(response => response.json())
      .then(data => {
        if (data?.Success)
          if (data.Data.length == 0) {
            setComments("noData")
          } else {
            setComments(sortComments(data.Data))
          }
        else throw "Error loading comments"
      })
    )

    promises.push(dl.fetch(ConfigData.RELEASES_ATTACHMENTS_DOCUMENTS + `?country=${country}`)
      .then(response => response.json())
      .then(data => {
        if (data?.Success)
          if (data.Data.length == 0) {
            setDocuments("noData")
          } else {
            setDocuments(sortDocuments(data.Data))
          }
        else throw "Error loading documents"
      })
    )

    Promise.all(promises).then(() => setIsLoading(false))
  }

  const sendRequest = (url, method, body, path) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': path ? 'multipart/form-data' : 'application/json',
      },
      body: path ? body : JSON.stringify(body),
    };
    return dl.fetch(url, options)
  }

  useEffect(() => {
    try {
      if (props.visible)
        loadData(props.item.Code)
    } catch (e) { console.log("error loading"); showError(e) }
  }, [props.visible])

  const addComment = (target) => {
    let input = target.closest(".comment--item").querySelector("textarea");
    let comment = input.value;
    if (!comment.trim()) {
      showErrorMessage("comment", "Add a comment");
    }
    else {
      let body = {
        "CountryCode": props.item.Code,
        "Comments": comment,
      }

      sendRequest(ConfigData.RELEASES_ATTACHMENTS_COMMENT_ADD, "POST", body)
        .then(response => response.json())
        .then((data) => {
          if (data?.Success) {
            setNewComment(false)
            loadData(props.item.Code)
          }
        });
    }
  }

  const deleteCommentMessage = (target) => {
    if (!target && newComment && document.querySelector(".comment--item.new textarea")?.value.trim() === "") {
      deleteComment();
    }
    else {
      props.updateModalValues("Delete Comment", "Are you sure you want to delete this comment?", "Continue", () => deleteComment(target), "Cancel", () => { })
    }
  }

  const deleteComment = (target) => {
    if (target) {
      let input = target.closest(".comment--item").querySelector("textarea");
      let id = input.getAttribute("id");
      let body = parseInt(id);
      sendRequest(ConfigData.RELEASES_ATTACHMENTS_COMMENT_DELETE, "DELETE", body)
        .then((data) => {
          if (data?.ok) {
            loadData(props.item.Code)
          } else { showErrorMessage("comment", "Error deleting comment") }
        });
    }
    else {
      setNewComment(false)
    }
  }

  const updateComment = (target) => {
    let input = target.closest(".comment--item").querySelector("textarea");
    let id = parseInt(input.id);
    if (target.firstChild.classList.contains("fa-pencil")) {
      input.disabled = false;
      input.readOnly = false;
      input.focus();
      target.firstChild.classList.replace("fa-pencil", "fa-floppy-disk");
    } else {
      if (!input.value.trim()) {
        showErrorMessage("comment", "Add comment");
      }
      else {
        saveComment(id, input, input.value, target);
      }
    }
  }

  const saveComment = (id, input, comment, target) => {
    let body = comments.find(a => a.Id === id);
    body.Comments = comment;
    sendRequest(ConfigData.RELEASES_ATTACHMENTS_COMMENT_UPDATE, "PUT", body)
      .then((data) => {
        if (data?.ok) {
          input.disabled = true;
          input.readOnly = true;
          target.firstChild.classList.replace("fa-floppy-disk", "fa-pencil");
          loadData(props.item.Code);
        } else { showErrorMessage("comment", "Error saving comment") }
      })
  }

  const renderComments = (target) => {
    let cmts = [];
    cmts.push(
      newComment &&
      <div className="comment--item new" key={"cmtItem_new"}>
        <div className="comment--text">
          <TextareaAutosize
            minRows={3}
            placeholder="Add a comment"
            className="comment--input"
          ></TextareaAutosize>
        </div>
        <div>
          <CButton color="link" className="btn-icon" onClick={(e) => addComment(e.currentTarget)}>
            <i className="fa-solid fa-floppy-disk"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={() => deleteCommentMessage()}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
    if (comments && comments !== "noData") {
      comments.forEach(c => {
        cmts.push(
          createCommentElement(c.Id, c.Comments, c.Date, c.Owner, c.Edited, c.EditedDate, c.EditedBy)
        )
      })
    }
    return (
      <div id="changes_comments">
        {cmts}
        {comments == "noData" && !newComment &&
          <em>No comments</em>
        }
      </div>
    )
  }

  const createCommentElement = (id, comment, date, owner, edited, editeddate, editedby) => {
    return (
      <div className="comment--item" key={"cmtItem_" + id} id={"cmtItem_" + id}>
        <div className="comment--text">
          <TextareaAutosize
            id={id}
            disabled
            defaultValue={comment}
            className="comment--input" />
          <label className="comment--date" htmlFor={id}>
            {date && owner &&
              "Commented on " + date.slice(0, 10).split('-').reverse().join('/') + " by " + owner + "."
            }
            {((edited >= 1) && (editeddate && editeddate !== undefined) && (editedby && editedby !== undefined)) &&
              " Last edited on " + editeddate.slice(0, 10).split('-').reverse().join('/') + " by " + editedby + "."
            }
          </label>
        </div>
        <div className="comment--icons">
          <CButton color="link" className="btn-icon" onClick={(e) => updateComment(e.currentTarget)} key={"cmtUpdate_" + id}>
            <i className="fa-solid fa-pencil"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={(e) => deleteCommentMessage(e.currentTarget)} key={"cmtDelete_" + id}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
  }

  const deleteDocumentMessage = (target) => {
    if (!target && newDocument && !selectedFile) {
      deleteDocument();
    }
    else {
      props.updateModalValues("Delete Document", "Are you sure you want to delete this document?", "Continue", () => deleteDocument(target), "Cancel", () => { })
    }
  }

  const deleteDocument = (target) => {
    if (target) {
      let doc = target.closest(".document--item");
      let id = doc.getAttribute("doc_id");
      sendRequest(ConfigData.RELEASES_ATTACHMENTS_DOCUMENT_DELETE + "?justificationId=" + id, "DELETE", "")
        .then((data) => {
          if (data?.ok) {
            loadData(props.item.Code)
          } else { showErrorMessage("document", "Error deleting document") }
        });
    }
    else {
      setNewDocument(false)
    }
  }

  const uploadFile = (data) => {
    let siteCode = this.state.data.SiteCode;
    let version = this.state.data.Version;
    return this.dl.xmlHttpRequest(ConfigData.UPLOAD_ATTACHED_FILE + '?sitecode=' + siteCode + '&version=' + version, data);
  }

  const changeHandler = (e) => {
    let formats = ConfigData.ACCEPTED_DOCUMENT_FORMATS;
    let file = e.currentTarget.closest("input").value;
    let extension = file.substring(file.lastIndexOf('.'), file.length) || file;
    if (formats.includes(extension)) {
      setSelectedFile(e.target.files[0])
    }
    else {
      e.currentTarget.closest("#uploadBtn").value = "";
      showErrorMessage("document", "File not valid, use a valid format: " + ConfigData.ACCEPTED_DOCUMENT_FORMATS);
    }
  }

  const handleSubmission = () => {
  }

  const renderDocuments = (target) => {
    let docs = [];
    docs.push(
      newDocument &&
      <div className="document--item new" key={"docItem_new"}>
        <div className="input-file">
          <label htmlFor="uploadBtn">
            Select file
          </label>
          <input id="uploadBtn" type="file" name="Files" onChange={(e) => changeHandler(e)} accept={ConfigData.ACCEPTED_DOCUMENT_FORMATS} />
          {selectedFile ? (
            <input id="uploadFile" placeholder={selectedFile.name} disabled="disabled" />
          ) : (<input id="uploadFile" placeholder="No file selected" disabled="disabled" />)}
        </div>
        <div className="document--icons">
          <CButton color="link" className="btn-icon" onClick={() => handleSubmission()}>
            <i className="fa-solid fa-floppy-disk"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={() => deleteDocumentMessage()}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
    if (documents !== "noData") {
      documents.forEach(d => {
        const name = d.OriginalName ?? d.Path
        docs.push(
          createDocumentElement(d.Id, name, d.Path, d.ImportDate, d.Username)
        )
      })
    }
    return (
      <div id="changes_documents">
        {docs}
        {documents == "noData" && !newDocument &&
          <em>No documents</em>
        }
      </div>
    )
  }

  const createDocumentElement = (id, name, path, date, user) => {
    return (
      <div className="document--item" key={"docItem_" + id} id={"docItem_" + id} doc_id={id}>
        <div className="my-auto document--text">
          <CImage src={justificationProvidedImg} className="ico--md me-3"></CImage>
          <span>{name?.replace(/^.*[\\\/]/, '')}</span>
        </div>
        <div className="document--icons">
          {(date || user) &&
            <CTooltip
              content={"Uploaded"
                + (date && " on " + date.slice(0, 10).split('-').reverse().join('/'))
                + (user && " by " + user)}>
              <div className="btn-icon btn-hover">
                <i className="fa-solid fa-circle-info"></i>
              </div>
            </CTooltip>
          }
          <CButton color="link" className="btn-link--dark">
            <a href={path} target="_blank">View</a>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={(e) => deleteDocumentMessage(e.currentTarget)}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
  }

  const renderAttachments = () => {
    return (
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={true}>
        <CRow className="py-3">

          <CCol className="mb-3" xs={12} lg={6}>
            <b>Attached documents</b>
            <CCard className="document--list">
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Country Level</b>
                <CButton color="link" className="btn-link--dark" onClick={() => setNewDocument(true)}>Add Document</CButton>
              </div>
              {renderDocuments("country")}
            </CCard>
          </CCol>

          <CCol className="mb-3" xs={12} lg={6}>
            <b>Comments</b>
            <CCard className="document--list">
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Country Level</b>
                <CButton color="link" className="btn-link--dark" onClick={() => setNewComment(true)}>Add Comment</CButton>
              </div>
              {renderComments("country")}
            </CCard>
          </CCol>

        </CRow>
      </CTabPane >
    )
  }

  return (
    <CModal scrollable size="xl" visible={props.visible} backdrop="static" onClose={closeModal}>
      <CModalHeader>
        <CModalTitle>{props.item.Country}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CNav variant="tabs" role="tablist">
          <CNavItem>
            <CNavLink
              href="javascript:void(0);"
              active={true}
            >
              Documents & Comments
            </CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent>
          <CAlert color="danger" visible={error.length > 0}>{error}</CAlert>
          {isLoading ?
            <div className="loading-container"><em>Loading...</em></div>
            : renderAttachments()
          }
        </CTabContent>
      </CModalBody>
    </CModal>
  )

}

export default ModalDocumentation;
