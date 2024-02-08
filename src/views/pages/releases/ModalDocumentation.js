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
  const [error, setError] = useState("")

  const newComment = false, newDocument = false

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

  useEffect(() => {
    try {
      if (props.visible)
        loadData(props.item.Code)
    } catch (e) { console.log("error loading"); showError(e) }
  }, [props.visible])

  const renderComments = (target) => {
    let cmts = [];
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
      </div>
    )
  }

  const renderDocuments = (target) => {
    let docs = [];
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
                <CButton color="link" className="btn-link--dark" onClick={() => addNewDocument()}>Add Document</CButton>
              </div>
              {renderDocuments("country")}
            </CCard>
          </CCol>

          <CCol className="mb-3" xs={12} lg={6}>
            <b>Comments</b>
            <CCard className="document--list">
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Country Level</b>
                <CButton color="link" className="btn-link--dark" onClick={() => addNewDocument()}>Add Comment</CButton>
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
