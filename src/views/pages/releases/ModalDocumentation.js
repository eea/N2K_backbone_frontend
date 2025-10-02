import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CTabContent,
  CTabPane,
  CCard,
  CAlert,
  CCloseButton,
  CSpinner,
} from '@coreui/react'

import TextareaAutosize from 'react-textarea-autosize';
import documentImg from './../../../assets/images/file-text.svg'
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
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [downloadingDocuments, setDownloadingDocuments] = useState([])
  const [notValidComment, setNotValidComment] = useState(false)
  const [notValidDocument, setNotValidDocument] = useState(false)
  const [errorLoadingComments, setErrorLoadingComments] = useState(false)
  const [errorLoadingDocuments, setErrorLoadingDocuments] = useState(false)
  const [selectedFile, setSelectedFile] = useState()
  const [error, setError] = useState("")

  const closeModal = () => {
    if(checkUnsavedChanges()){
      props.updateModalValues("Unsaved Changes", "There are unsaved changes. Do you want to continue?",
        "Continue", () => close(),
        "Cancel", () => { })
    }
    else {
      close();
    }
  }

  const close = () => {
    cleanUnsavedChanges()
    props.setVisible(false)
    props.close()
  }

  const checkUnsavedChanges = () => {
    let hasComment = (document.querySelector(".comment--item.new textarea")?.value ?? "").length > 0;
    let hasEditionComments = document.querySelectorAll(".comment--item:not(.new) textarea[disabled]").length != comments.length;
    let hasEditionDocumentComments = document.querySelectorAll(".document--item:not(.new) textarea[disabled]").length != documents.length 
    return (newDocument && selectedFile)
    || ((newComment && hasComment) || (comments !== "noData" && hasEditionComments) || (documents !== "noData" && hasEditionDocumentComments))
  }

  const cleanUnsavedChanges = () => {
    setNewComment(false);
    setNewDocument(false);
  }

  const showError = (e) => {
    setError("Something went wrong: " + e);
    setTimeout(() => { setError('') }, UtilsData.MESSAGE_TIMEOUT);
  }

  const loadData = (country) => {
    let promises = []
    promises.push(dl.fetch(ConfigData.RELEASES_ATTACHMENTS_COMMENTS + `?country=${country}`)
      .then(response => response.json())
      .then(data => {
        if (data?.Success)
          if (data.Data.length == 0) {
            setComments("noData")
          }
          else {
            setComments(sortComments(data.Data))
          }
        else {
          setErrorLoadingComments(true)
        }
      })
    )

    promises.push(dl.fetch(ConfigData.RELEASES_ATTACHMENTS_DOCUMENTS + `?country=${country}`)
      .then(response => response.json())
      .then(data => {
        if (data?.Success)
          if (data.Data.length == 0) {
            setDocuments("noData")
          }
          else {
            setDocuments(sortDocuments(data.Data))
          }
        else {
          setErrorLoadingDocuments(true)
        }
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

  const readResponse = async (stream) => {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let txt = "";

    const readData = ({ done, value }) => {
      if (done) {
        return JSON.parse(txt);
      } else {
        txt += decoder.decode(value);
        return reader.read().then(readData);
      }
    };

    return reader.read().then(readData);
  }

  useEffect(() => {
    try {
      if (props.visible)
        loadData(props.item.Code)
    } catch (e) { console.log("error loading"); showError(e) }
  }, [props.visible])

  useEffect(() => {
    if (props.visible && !isLoading && !errorLoadingComments && !errorLoadingDocuments) {
      attachmentsHeight();
      window.addEventListener("resize", () => {attachmentsHeight()});
    }
  }, [isLoading])

  const attachmentsHeight = () => {
    let height = document.querySelector(".modal-body").offsetHeight - document.querySelector(".modal-body .nav").offsetHeight - document.querySelector(".attachments--title").offsetHeight - 80;
    if(document.querySelector(".document--list").scrollHeight > height) {
      document.querySelector(".document--list").style.height = height + "px";
    }
    else {
      document.querySelector(".document--list").style.height = "";
    }
    if(document.querySelector(".comment--list").scrollHeight > height) {
      document.querySelector(".comment--list").style.height = height + "px";
    }
    else {
      document.querySelector(".comment--list").style.height = "";
    }
  }

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
            setIsLoading(true)
            setNewComment(false)
            loadData(props.item.Code)
          }
          else {
            showErrorMessage("comment", "Error adding comment")
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
      let id = parseInt(input.getAttribute("id"));
      sendRequest(ConfigData.RELEASES_ATTACHMENTS_COMMENT_DELETE + "?commentId=" + id, "DELETE", "")
        .then((data) => {
          if (data?.ok) {
            let cmts = comments.filter(e => e.Id !== id);
            setComments(cmts.length > 0 ? cmts : "noData");
          }
          else {
            showErrorMessage("comment", "Error deleting comment")
          }
        });
    }
    else {
      setNewComment(false)
    }
  }

  const updateComment = (target) => {
    let input = target.closest(".comment--item").querySelector("textarea");
    let id = parseInt(input.id);
    if (target.innerText === "Edit") {
      input.disabled = false;
      input.readOnly = false;
      input.focus();
      target.innerText = "Save";
    }
    else {
      if (!input.value.trim()) {
        showErrorMessage("comment", "Add a comment");
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
          readResponse(data.body).then((json) => {
            setComments(sortComments(json.Data));
          });
          input.disabled = true;
          input.readOnly = true;
          target.innerText = "Edit";
        }
        else {
          showErrorMessage("comment", "Error saving comment")
        }
      })
  }

  const renderComments = (target) => {
    let cmts = [];
    cmts.push(
      newComment &&
      <div className="comment--item new" key={"cmtItem_new"}>
        <div className="comment--row">
          <div className="comment--text">
            <TextareaAutosize
              minRows={3}
              placeholder="Add a comment"
              className="comment--input"
            ></TextareaAutosize>
          </div>
          <div className="comment--icons">
            <CButton color="link" className="btn-link" onClick={(e) => addComment(e.currentTarget)}>
              Save
            </CButton>
            <CButton color="link" className="btn-icon" onClick={() => deleteCommentMessage()}>
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
          </div>
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
      <div className="attachments--group" id={"changes_comments_" + target}>
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
        <div className="comment--row">
          <div className="comment--text">
            <TextareaAutosize
              id={id}
              disabled
              defaultValue={comment}
              className="comment--input" />
          </div>
          <div className="comment--icons">
            <CButton color="link" className="btn-link btn-update" onClick={(e) => updateComment(e.currentTarget)} key={"cmtUpdate_" + id}>
              Edit
            </CButton>
            <CButton color="link" className="btn-icon" onClick={(e) => deleteCommentMessage(e.currentTarget)} key={"cmtDelete_" + id}>
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
          </div>
        </div>
        <label className="comment--date" htmlFor={id}>
          {date && owner &&
            "Commented on " + date.slice(0, 10).split('-').reverse().join('/') + " by " + owner + "."
          }
          {((edited >= 1) && (editeddate && editeddate !== undefined) && (editedby && editedby !== undefined)) &&
            " Last edited on " + editeddate.slice(0, 10).split('-').reverse().join('/') + " by " + editedby + "."
          }
        </label>
      </div>
    )
  }

  const updateDocument = (target) => {
    let input = target.closest(".document--item").querySelector("textarea");
    let id = parseInt(input.id);
    if (target.innerText === "Edit") {
      if (!input.value) {
        input.parentElement.removeAttribute("hidden");
      }
      input.disabled = false;
      input.readOnly = false;
      input.focus();
      target.innerText = "Save";
    } else {
      if (!input.value.trim()) {
        showErrorMessage("document", "Add a comment");
      }
      else {
        saveDocumentComment(id, input, input.value, target);
      }
    }
  }

  const saveDocumentComment = (id, input, comment, target) => {
    sendRequest(ConfigData.RELEASES_ATTACHMENTS_DOCUMENT_UPDATE + "?documentId=" + id + "&comment=" + comment, "DELETE", "")
      .then((data) => {
        if (data?.ok) {
          readResponse(data.body).then((json) => {
            setDocuments(sortDocuments(json.Data));
          });

          input.disabled = true;
          input.readOnly = true;
          target.innerText = "Edit";
        }
        else {
          showErrorMessage("document", "Error saving document comment")
        }
      })
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
      let id = parseInt(doc.getAttribute("doc_id"));
      sendRequest(ConfigData.RELEASES_ATTACHMENTS_DOCUMENT_DELETE + "?documentId=" + id, "DELETE", "")
        .then((data) => {
          if (data?.ok) {
            let docs = documents.filter(e => e.ID !== id);
            setDocuments(docs.length > 0 ? docs : "noData");
          }
          else {
            showErrorMessage("document", "Error deleting document")
          }
        });
    }
    else {
      setNewDocument(false)
    }
    setSelectedFile()
  }

  const uploadFile = (data) => {
    let country = props.item.Code
    let comment = document.querySelector(".document--new .document--comment textarea").value;
    return dl.xmlHttpRequest(ConfigData.RELEASES_ATTACHMENTS_DOCUMENT_ADD + '?Country=' + country + "&comment=" + comment, data)
  }

  const changeHandler = (e) => {
    let formats = UtilsData.ACCEPTED_DOCUMENT_FORMATS
    let file = e.currentTarget.closest("input").value
    let extension = file.substring(file.lastIndexOf('.'), file.length) || file
    if (formats.includes(extension)) {
      setSelectedFile(e.target.files[0])
    }
    else {
      e.currentTarget.closest("#uploadBtn").value = "";
      showErrorMessage("document", "File not valid, use a valid format: " + UtilsData.ACCEPTED_DOCUMENT_FORMATS);
    }
  }

  const handleSubmission = () => {
    if (selectedFile) {
      let formData = new FormData();
      formData.append("Files", selectedFile, selectedFile.name);
      setUploadingDocument(true);

      return uploadFile(formData)
        .then(data => {
          if (data?.Success) {
            setIsLoading(true)
            setNewDocument(false)
            setSelectedFile(false)
            setUploadingDocument(false)
            loadData(props.item.Code)
          }
          else {
            showErrorMessage("document", "Add a file")
          }
        })
    }
    else {
      showErrorMessage("document", "Add a file")
    }
  }

  const renderDocuments = (target) => {
    let docs = [];
    docs.push(
      newDocument &&
      <div className="document--new" key={"docItem_new"}>
        <div className="document--item">
          <div className="document--row">
            <div className="input-file">
              <label htmlFor="uploadBtn">
                Select file
              </label>
              <input id="uploadBtn" type="file" name="Files" disabled={uploadingDocument} onChange={(e) => changeHandler(e)} accept={UtilsData.ACCEPTED_DOCUMENT_FORMATS} />
              {selectedFile ? (
                <input id="uploadFile" placeholder={selectedFile.name} disabled="disabled" />
              ) : (<input id="uploadFile" placeholder="No file selected" disabled="disabled" />)}
            </div>
            <div className="document--icons">
              <CButton color="link" className="btn-link" disabled={uploadingDocument} onClick={() => handleSubmission()}>
                {uploadingDocument ? <CSpinner size="sm" className="mx-2" /> : <>Save</>}
              </CButton>
              <CButton color="link" className="btn-icon" disabled={uploadingDocument} onClick={() => deleteDocumentMessage()}>
                <i className="fa-regular fa-trash-can"></i>
              </CButton>
            </div>
          </div>
          <div className="document--comment">
            <TextareaAutosize
              minRows={3}
              placeholder="Add a comment (optional)"
              className="comment--input"
              disabled={uploadingDocument}
            ></TextareaAutosize>
          </div>
        </div>
      </div>
    )
    if (documents !== "noData") {
      documents.forEach(d => {
        const name = d.OriginalName ?? d.Path;
        docs.push(
          createDocumentElement(d.ID, name, d.ImportDate, d.Username, d.Comment, d.Edited, d.EditedDate, d.EditedBy)
        )
      })
    }
    return (
      <div className="attachments--group" id={"changes_documents_" + target}>
        {docs}
        {documents == "noData" && !newDocument &&
          <em>No documents</em>
        }
      </div>
    )
  }

  const createDocumentElement = (id, name, date, user, comment, edited, editeddate, editedby) => {
    return (
      <div className="document--item" key={"docItem_" + id} id={"docItem_" + id} doc_id={id}>
        <div className="document--row">
          <div className="my-auto document--text">
            <div className="document--file">
              <CImage src={documentImg} className="ico--md me-2"></CImage>
              <span>{name?.replace(/^.*[\\\/]/, '')}</span>
            </div>
          </div>
          <div className="document--icons">
            <CButton color="link" className="btn-link" disabled={downloadingDocuments.includes(id)} onClick={() => downloadAttachments(id, name)}>
              {downloadingDocuments.includes(id) ? <CSpinner size="sm" className="mx-2" /> : <>Download</>}
            </CButton>
            <CButton color="link" className="btn-link btn-update" disabled={downloadingDocuments.includes(id)} onClick={(e) => updateDocument(e.currentTarget)}>
              Edit
            </CButton>
            <CButton color="link" className="btn-icon" disabled={downloadingDocuments.includes(id)} onClick={(e) => deleteDocumentMessage(e.currentTarget)}>
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
          </div>
        </div>
        <div className="document--comment" hidden={!comment}>
          <TextareaAutosize
            id={id}
            disabled
            defaultValue={comment}
            className="comment--input"
          ></TextareaAutosize>
        </div>
        <label className="comment--date" htmlFor={id}>
          {date && user &&
            "Uploaded on " + date.slice(0, 10).split('-').reverse().join('/') + " by " + user + "."
          }
          {((edited >= 1) && (editeddate && editeddate !== undefined) && (editedby && editedby !== undefined)) &&
            " Last edited on " + editeddate.slice(0, 10).split('-').reverse().join('/') + " by " + editedby + "."
          }
        </label>
      </div>
    )
  }

  const renderAttachments = () => {
    return (
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={true}>
        <CRow className="py-3">
          <CCol className="mb-3" xs={12} lg={6}>
            <div className="attachments--title">
              <b>Attached documents</b>
            </div>
            {errorLoadingDocuments ?
              <CAlert color="danger">Error loading documents</CAlert>
              :
              <CCard className="document--list">
                {notValidDocument &&
                  <CAlert color="danger">
                    {notValidDocument}
                  </CAlert>
                }
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Country Level</b>
                  <CButton color="link" className="btn-link--dark" onClick={() => setNewDocument(true)}>Add document</CButton>
                </div>
                {renderDocuments("country")}
              </CCard>
            }
          </CCol>
          <CCol className="mb-3" xs={12} lg={6}>
            <div className="attachments--title">
              <b>Comments</b>
            </div>
            {errorLoadingComments ?
              <CAlert color="danger">Error loading comments</CAlert>
              :
              <CCard className="comment--list">
                {notValidComment &&
                  <CAlert color="danger">
                    {notValidComment}
                  </CAlert>
                }
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Country Level</b>
                  <CButton color="link" className="btn-link--dark" onClick={() => setNewComment(true)}>Add comment</CButton>
                </div>
                {renderComments("country")}
              </CCard>
            }
          </CCol>
        </CRow>
      </CTabPane >
    )
  }

  const downloadAttachments = (id, name) => {
    setDownloadingDocuments([...downloadingDocuments, id]);
    dl.fetch(ConfigData.ATTACHMENTS_DOWNLOAD + "id=" + id + "&docuType=1")
    .then(data => {
      if(data?.ok) {
        data.blob()
        .then(blobresp => {
          var blob = new Blob([blobresp], {type: "octet/stream"});
          var url = window.URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.download = name;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setDownloadingDocuments(downloadingDocuments.filter(a => a !== id));
        })
      }
      else {
        showErrorMessage("document", "Error downloading file");
        setDownloadingDocuments(downloadingDocuments.filter(a => a !== id));
      }
    })
  }

  const showErrorMessage = (target, message) => {
    if (target === "comment") {
      setNotValidComment(message);
      setTimeout(() => {
        setNotValidComment("");
      }, UtilsData.MESSAGE_TIMEOUT);
    }
    else if (target === "document") {
      setNotValidDocument(message);
      setTimeout(() => {
        setNotValidDocument("");
      }, UtilsData.MESSAGE_TIMEOUT);
    }
  }

  return (
    <CModal scrollable size="xl" visible={props.visible} backdrop="static">
      <CModalHeader closeButton={false}>
        <CModalTitle>{props.item.Country}</CModalTitle>
        <CCloseButton onClick={() => closeModal()} />
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
