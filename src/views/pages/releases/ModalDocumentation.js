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

import { DataLoader } from '../../../components/DataLoader';

const sortComments = (comments) => {
  comments.sort(
    (a, b) => b.Date && a.Date ?
      b.Date.localeCompare(a.Date)
      : {}
  );
}

const sortDocuments = (documents) => {
  documents.sort(
    (a, b) => b.ImportDate && a.ImportDate ?
      b.ImportDate.localeCompare(a.ImportDate)
      : {}
  );
}

const ModalDocumentation = (props) => {
  const [documents, setDocuments] = useState([])
  const [comments, setComments] = useState([])

  const newComment = false, newDocument = false

  const dl = new DataLoader()

  const loadComments = (country, version) => {
    dl.fetch(ConfigData.GET_SITE_COMMENTS + `siteCode=${country}&version=${version}`)
      .then(response => response.json())
      .then(data => {
        if (data?.Success)
          return data.Data.filter(d => d.Release)
        else throw "error loading comments"
      })
  }

  const loadDocuments = (country, version) => {
    dl.fetch(ConfigData.GET_ATTACHED_FILES + `siteCode=${country}&version=${version}`)
      .then(response => response.json())
      .then(data => {
        if (data?.Success)
          return data.Data.filter(d => d.Release)
        else throw "error loading documents"
      })
  }

  useEffect(() => {
    console.log(props)
    if(props.visible) {
      setDocuments(loadDocuments(country, version))
      setComments(loadComments(country, version))
      console.log(country)
    }
  }, [props.visible])

  return (
    <CModal scrollable size="xl" visible={visible} backdrop="static" onClose={() => setVisible(false)}>
      <span>test</span>
    </CModal>
  )
  
  const renderComments = (target) => {
    let cmts = [];
    let filteredComments = [];
    if (comments !== "noData") {
      this.sortComments();
      if (target == "country") {
        filteredComments = comments?.filter(c => c.Release)
      } else {
        filteredComments = comments?.filter(c => !c.Release)
      }
    }
    cmts.push(
      target == "site" && newComment &&
      <div className="comment--item new" key={"cmtItem_new"}>
        <div className="comment--text">
          <TextareaAutosize
            minRows={3}
            placeholder="Add a comment"
            className="comment--input"
          ></TextareaAutosize>
        </div>
        <div>
          <CButton color="link" className="btn-icon" onClick={(e) => this.addComment(e.currentTarget)}>
            <i className="fa-solid fa-floppy-disk"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={() => this.deleteCommentMessage()}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
    if (comments !== "noData") {
      filteredComments.forEach(c => {
        cmts.push(
          this.createCommentElement(c.Id, c.Comments, c.Date, c.Owner, c.Edited, c.EditedDate, c.EditedBy)
        )
      })
    }
    return (
      <div id="changes_comments">
        {cmts}
        {filteredComments.length == 0 && !newComment &&
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
          <CButton color="link" className="btn-icon" onClick={(e) => this.updateComment(e.currentTarget)} key={"cmtUpdate_" + id}>
            <i className="fa-solid fa-pencil"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={(e) => this.deleteCommentMessage(e.currentTarget)} key={"cmtDelete_" + id}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
  }

  const renderDocuments = (target) => {
    let docs = [];
    let filteredDocuments = [];
    if (documents !== "noData") {
      this.sortDocuments();
      if (target == "country")
        filteredDocuments = documents?.filter(d => d.Release)
      else
        filteredDocuments = documents?.filter(d => !d.Release)
    }
    docs.push(
      target == "site" && newDocument &&
      <div className="document--item new" key={"docItem_new"}>
        <div className="input-file">
          <label htmlFor="uploadBtn">
            Select file
          </label>
          <input id="uploadBtn" type="file" name="Files" onChange={(e) => this.changeHandler(e)} accept={ConfigData.ACCEPTED_DOCUMENT_FORMATS} />
          {isSelected ? (
            <input id="uploadFile" placeholder={selectedFile.name} disabled="disabled" />
          ) : (<input id="uploadFile" placeholder="No file selected" disabled="disabled" />)}
        </div>
        <div className="document--icons">
          <CButton color="link" className="btn-icon" onClick={() => this.handleSubmission()}>
            <i className="fa-solid fa-floppy-disk"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={() => this.deleteDocumentMessage()}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
    if (documents !== "noData") {
      filteredDocuments.forEach(d => {
        // original name may be null until the backend part it's finished
        const name = d.OriginalName ?? d.Path
        docs.push(
          this.createDocumentElement(d.Id, name, d.Path, d.ImportDate, d.Username)
        )
      })
    }
    return (
      <div id="changes_documents">
        {docs}
        {filteredDocuments.length == 0 && !newDocument &&
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
          <CButton color="link" className="btn-icon" onClick={(e) => this.deleteDocumentMessage(e.currentTarget)}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
  }

  const renderAttachments = () => {
    return (
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 4}>
        <CRow className="py-3">
          <CCol className="mb-3" xs={12} lg={6}>
            <b>Attached documents</b>
            {this.errorLoadingDocuments ?
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
                </div>
                {this.renderDocuments("country")}
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Site Level</b>
                  <CButton color="link" className="btn-link--dark" onClick={() => this.addNewDocument()}>Add Document</CButton>
                </div>
                {this.renderDocuments("site")}
              </CCard>
            }
          </CCol>
          <CCol className="mb-3" xs={12} lg={6}>
            <b>Comments</b>
            {this.errorLoadingComments ?
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
                </div>
                {this.renderComments("country")}
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Site Level</b>
                  <CButton color="link" className="btn-link--dark" onClick={() => this.addNewComment()}>Add Comment</CButton>
                </div>
                {this.renderComments("site")}
              </CCard>
            }
          </CCol>
          <CCol className="d-flex">
            <div className="checkbox">
              <input type="checkbox" className="input-checkbox" id="modal_justification_req"
                onClick={() => this.props.updateModalValues("Changes", `This will ${justificationRequired ? "unmark" : "mark"} change as justification required`, "Continue", () => this.handleJustRequired(), "Cancel", () => { })}
                checked={justificationRequired}
                readOnly
              />
              <label htmlFor="modal_justification_req" className="input-label">Justification required</label>
            </div>
            <div className="checkbox" disabled={(justificationRequired ? false : true)}>
              <input type="checkbox" className="input-checkbox" id="modal_justification_prov"
                onClick={() => this.props.updateModalValues("Changes", `This will ${justificationProvided ? "unmark" : "mark"} change as justification provided`, "Continue", () => this.handleJustProvided(), "Cancel", () => { })}
                checked={justificationProvided}
                readOnly
              />
              <label htmlFor="modal_justification_prov" className="input-label" disabled={(justificationRequired ? false : true)}>Justification provided</label>
            </div>
          </CCol>
        </CRow>
      </CTabPane>
    )
  }
}

export default ModalDocumentation;
