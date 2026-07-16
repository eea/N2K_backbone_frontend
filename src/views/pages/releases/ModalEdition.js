import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import React, { Component, useState } from 'react';
import Select from 'react-select';
import {
  CButton,
  CSpinner,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTabContent,
  CTabPane,
  CAlert,
  CForm,
  CFormInput,
  CCard,
  CImage,
  CTooltip,
  CCloseButton,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableFoot
} from '@coreui/react'

import TextareaAutosize from 'react-textarea-autosize';
import justificationRequiredImg from './../../../assets/images/exclamation.svg'
import documentImg from './../../../assets/images/file-text.svg'
import {DataLoader} from '../../../components/DataLoader';

export class ModalEdition extends Component {

  constructor(props) {
    super(props);
    this.dl = new (DataLoader);

    this.isDataLoaded = false;
    this.isDocumentsLoaded = false;
    this.isCommentsLoaded = false;

    this.errorLoadingData = false;
    this.errorLoadingDocuments = false;
    this.errorLoadingComments = false;

    this.state = {
      activeKey: 1,
      loading: true,
      data: {},
      notValidField: [],
      comments: [],
      documents: [],
      newComment: false,
      newDocument: false,
      uploadingDocument: false,
      downloadingDocuments: [],
      justificationRequired: false,
      selectedFile: "",
      isSelected: false,
      notValidComment: "",
      notValidDocument: "",
      fieldChanged: false,
      notValidBioRegion: "",
      invalidBioRegionRows: [],
      modalValues: {
        visibility: false,
        close: () => {
          this.setState({
            modalValues: {
              visibility: false
            }
          });
        }
      },
      updatingData: false,
      siteTypeValue: "",
      siteRegionValue: "",
    };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', (e) => this.handleLeavePage(e));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', (e) => this.handleLeavePage(e));
  }

  handleLeavePage(e) {
    if (this.isVisible() && this.checkUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '';
    }
  }

  componentDidUpdate() {
    if(this.isVisible() && !this.state.loading && this.state.activeKey === 2  && !this.errorLoadingComments && !this.errorLoadingDocuments) {
      this.attachmentsHeight();
      window.addEventListener("resize", () => {this.attachmentsHeight()});
    }
  }

  attachmentsHeight = () => {
    let height = document.querySelector(".modal-body").offsetHeight - document.querySelector(".modal-body .nav").offsetHeight - document.querySelector("#modal_justification_req").parentElement.offsetHeight - document.querySelector(".attachments--title").offsetHeight  - (document.querySelector(".alert-primary") ? document.querySelector(".alert-primary").offsetHeight + 16 : 0 ) - 80;
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

  setActiveKey(val) {
    this.setState({ activeKey: val })
  }

  close() {
    this.resetLoading();
    this.setActiveKey(1);
    this.setState({
      data: {},
      loading: true,
      comments: [],
      documents: [],
      newComment: false,
      newDocument: false,
      uploadingDocument: false,
      downloadingDocuments: [],
      isSelected: false,
      selectedFile: "",
      notValidField: [],
      fieldChanged: false,
      siteTypeValue: "",
      siteRegionValue: "",
      notValidBioRegion: "",
      invalidBioRegionRows: [],
    });
    this.props.close();
  }

  isVisible() {
    return this.props.visible;
  }

  renderFields() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CForm id="siteedition_form">
          <CRow className="p-3">
            {(this.state.notValidField.length > 0) &&
              <CAlert color="danger">
                {this.state.notValidField}
              </CAlert>
            }
            {!this.errorLoadingData ?
              this.createFieldElement()
              : <CAlert color="danger">Error loading data</CAlert>
            }
          </CRow>
        </CForm>
      </CTabPane>
    )
  }

  fieldValidator() {
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    let data = JSON.parse(JSON.stringify(body, ["SiteCode", "SiteName", "SiteType", "Area"]));
    this.state.notValidField = [];
    for (let i in Object.keys(data)) {
      let field = Object.keys(data)[i]
      let value = data[field];
      if (!value && field !== "Length")
        this.state.notValidField.push(field);
    }
    this.state.notValidField.forEach((e) => {
      let field = document.getElementById("field_" + e)
      field.querySelector(".multi-select__control") ?
        field.querySelector(".multi-select__control").classList.add('invalidField')
        : field.classList.add('invalidField')
    });
    let invalidBioRegionRows = this.getInvalidBioRegionRowIndexes();
    let bioRegionValid = invalidBioRegionRows.length === 0;
    this.setState({ invalidBioRegionRows });
    if (!bioRegionValid) {
      this.showErrorMessage("bioregion", "Select a region");
    }
    this.state.notValidField.length > 0 && this.showErrorMessage("fields", "Empty fields are not allowed");
    return this.state.notValidField.length == 0 && bioRegionValid;
  }

  getInvalidBioRegionRowIndexes() {
    let rows = this.state.siteRegionValue;
    let hasCompleteRow = rows.some(r => this.isBioRegionRowComplete(r));
    return rows
      .map((r, i) => i)
      .filter(i => {
        let r = rows[i];
        if (this.isBioRegionRowEmpty(r)) return !hasCompleteRow;
        return !this.isBioRegionRowComplete(r);
      });
  }

  isBioRegionRowEmpty(r) {
    return !r.BGRID && !r.Marine_Relationship_BioGeo;
  }

  onChangeField(e, field, index, subField) {
    if (field === "SiteType") {
      this.setState({ siteTypeValue: e }, () => this.checkForChanges(e));
      return;
    }
    if (field === "BioRegion") {
      let siteRegionValue = [...this.state.siteRegionValue];
      let newValue = (e && e.value !== undefined) ? e.value : e;
      siteRegionValue[index] = {
        ...siteRegionValue[index],
        [subField]: newValue
      };
      if (subField === "BGRID") {
        let regionData = this.props.regions.find(r => r.Code === newValue);
        if (regionData?.isMarine) {
          if (!siteRegionValue[index].Marine_Relationship_BioGeo) {
            let defaultTerrestrial = this.getDefaultTerrestrial(newValue);
            if (defaultTerrestrial) {
              siteRegionValue[index].Marine_Relationship_BioGeo = defaultTerrestrial;
            }
          }
        } else {
          siteRegionValue[index].Marine_Relationship_BioGeo = null;
        }
      }
      this.setState({
        siteRegionValue,
        invalidBioRegionRows: this.state.invalidBioRegionRows.filter(i => i !== index)
      }, () => this.checkForChanges());
      return;
    }
    if (e.target)
      e.target.classList.contains('invalidField') ?
        e.target.classList.remove('invalidField')
        : {}
    this.checkForChanges(e);
  }

  sortComments() {
    this.state.comments.sort(
      (a, b) => b.Date && a.Date ?
        b.Date.localeCompare(a.Date)
        : {}
    );
  }

  renderComments(target) {
    let cmts = [];
    let filteredComments = [];
    if (this.state.comments !== "noData") {
      this.sortComments();
      if (target == "country") {
        filteredComments = this.state.comments?.filter(c => c.Release)
      } else {
        filteredComments = this.state.comments?.filter(c => !c.Release)
      }
    }
    cmts.push(
      target == "site" && this.state.newComment &&
      <div className="comment--item new" key={"cmtItem_new"}>
        <div className="comment--row">
          <div className="comment--text">
            <TextareaAutosize
              minRows={3}
              placeholder="Add a comment"
              className="comment--input"
              onChange={({ target }) => this.checkForChanges()}
            ></TextareaAutosize>
          </div>
          <div className="comment--icons">
            <CButton color="link" className="btn-link" onClick={(e) => this.addComment(e.currentTarget)}>
              Save
            </CButton>
            <CButton color="link" className="btn-icon" onClick={() => this.deleteCommentMessage()}>
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
          </div>
        </div>
      </div>
    )
    if (this.state.comments !== "noData") {
      let lastYear = null;
      filteredComments.forEach(c => {
        const dateString = c.EditedDate || c.Date;
        const currentYear = dateString.substring(0, 4);
        if (currentYear !== lastYear) {
          cmts.push(
            <div key={currentYear} className="year-separator">
              <span>{currentYear}</span>
            </div>
          );
          lastYear = currentYear;
        }
        cmts.push(
          this.createCommentElement(c.Id, c.Comments, c.Date, c.Owner, c.Edited, c.EditedDate, c.EditedBy, target)
        )
      })
    }
    return (
      <div className="attachments--group" id={"changes_comments_" + target}>
        {cmts}
        {filteredComments.length == 0 && !this.state.newComment &&
          <em>No comments</em>
        }
      </div>
    )
  }

  createCommentElement(id, comment, date, owner, edited, editeddate, editedby, level) {
    return (
      <div className="comment--item" key={"cmtItem_" + id} id={"cmtItem_" + id}>
        <div className="comment--row">
          <div className="comment--text">
            <TextareaAutosize
              id={id}
              disabled
              defaultValue={comment}
              className="comment--input"
            ></TextareaAutosize>
          </div>
          {level == "site" &&
            <div className="comment--icons">
              <CButton color="link" className="btn-link btn-update" onClick={(e) => this.updateComment(e.currentTarget)} key={"cmtUpdate_" + id}>
                Edit
              </CButton>
              <CButton color="link" className="btn-icon" onClick={(e) => this.deleteCommentMessage(e.currentTarget)} key={"cmtDelete_" + id}>
                <i className="fa-regular fa-trash-can"></i>
              </CButton>
            </div>
          }
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

  sortDocuments() {
    this.state.documents.sort(
      (a, b) => b.ImportDate && a.ImportDate ?
        b.ImportDate.localeCompare(a.ImportDate)
        : {}
    );
  }

  renderDocuments(target) {
    let docs = [];
    let filteredDocuments = [];
    if (this.state.documents !== "noData") {
      this.sortDocuments();
      if (target == "country")
        filteredDocuments = this.state.documents?.filter(d => d.Release)
      else
        filteredDocuments = this.state.documents?.filter(d => !d.Release)
    }
    docs.push(
      target == "site" && this.state.newDocument &&
      <div className="document--new" key={"docItem_new"}>
        <div className="document--item">
          <div className="document--row">
            <div className="input-file">
              <label htmlFor="uploadBtn">
                Select file
              </label>
              <input id="uploadBtn" type="file" name="Files" disabled={this.state.uploadingDocument} onChange={(e) => this.changeHandler(e)} accept={UtilsData.ACCEPTED_DOCUMENT_FORMATS} />
              {this.state.isSelected ? (
                <input id="uploadFile" placeholder={this.state.selectedFile.name} disabled="disabled" />
              ) : (<input id="uploadFile" placeholder="No file selected" disabled="disabled" />)}
            </div>
            <div className="document--icons">
              <CButton color="link" className="btn-link" disabled={this.state.uploadingDocument} onClick={() => this.handleSubmission()}>
                {this.state.uploadingDocument ? <CSpinner size="sm" className="mx-2" /> : <>Save</>}
              </CButton>
              <CButton color="link" className="btn-icon" disabled={this.state.uploadingDocument} onClick={() => this.deleteDocumentMessage()}>
                <i className="fa-regular fa-trash-can"></i>
              </CButton>
            </div>
          </div>
          <div className="document--comment">
            <TextareaAutosize
              minRows={3}
              placeholder="Add a comment (optional)"
              className="comment--input"
              disabled={this.state.uploadingDocument}
            ></TextareaAutosize>
          </div>
        </div>
      </div>
    )
    if (this.state.documents !== "noData") {
      let lastYear = null;
      filteredDocuments.forEach(d => {
        const dateString = d.EditedDate || d.ImportDate;
        const currentYear = dateString.substring(0, 4);
        if (currentYear !== lastYear) {
          docs.push(
            <div key={currentYear} className="year-separator">
              <span>{currentYear}</span>
            </div>
          );
          lastYear = currentYear;
        }
        const name = d.OriginalName ?? d.Path;
        docs.push(
          this.createDocumentElement(d.Id, name, d.ImportDate, d.Username, d.Comment, d.Edited, d.EditedDate, d.EditedBy, target)
        )
      })
    }
    return (
      <div className="attachments--group" id={"changes_documents_" + target}>
        {docs}
        {filteredDocuments.length == 0 && !this.state.newDocument &&
          <em>No documents</em>
        }
      </div>
    )
  }

  createDocumentElement(id, name, date, user, comment, edited, editeddate, editedby, level) {
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
            <CButton color="link" className="btn-link" disabled={this.state.downloadingDocuments.includes(id)} onClick={() => this.downloadAttachments(id, name, level)}>
              {this.state.downloadingDocuments.includes(id) ? <CSpinner size="sm" className="mx-2" /> : <>Download</>}
            </CButton>
            {level == "site" &&
              <>
                <CButton color="link" className="btn-link btn-update" disabled={this.state.downloadingDocuments.includes(id)} onClick={(e) => this.updateDocument(e.currentTarget)}>
                  Edit
                </CButton>
                <CButton color="link" className="btn-icon" disabled={this.state.downloadingDocuments.includes(id)} onClick={(e) => this.deleteDocumentMessage(e.currentTarget)}>
                  <i className="fa-regular fa-trash-can"></i>
                </CButton>
              </>
            }
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

  renderAttachments() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
        <CRow className="py-3">
          <CCol className="mb-3" xs={12} lg={6}>
            <div className="attachments--title">
              <b>Attached documents</b>
            </div>
            {this.errorLoadingDocuments ?
              <CAlert color="danger">Error loading documents</CAlert>
              :
              <CCard className="document--list">
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Country Level</b>
                  <CButton color="link" className="btn-link--dark" href={"#/releases/documentation?country=" + this.props.country}>Manage documentation</CButton>
                </div>
                {this.renderDocuments("country")}
                {this.state.notValidDocument &&
                  <CAlert color="danger">
                    {this.state.notValidDocument}
                  </CAlert>
                }
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Site Level</b>
                  <CButton color="link" className="btn-link--dark" onClick={() => this.addNewDocument()}>Add document</CButton>
                </div>
                {this.renderDocuments("site")}
              </CCard>
            }
          </CCol>
          <CCol className="mb-3" xs={12} lg={6}>
            <div className="attachments--title">
              <b>Comments</b>
            </div>
            {this.errorLoadingComments ?
              <CAlert color="danger">Error loading comments</CAlert>
              :
              <CCard className="comment--list">
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Country Level</b>
                  <CButton color="link" className="btn-link--dark" href={"#/releases/documentation?country=" + this.props.country}>Manage documentation</CButton>
                </div>
                {this.renderComments("country")}
                {this.state.notValidComment &&
                  <CAlert color="danger">
                    {this.state.notValidComment}
                  </CAlert>
                }
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Site Level</b>
                  <CButton color="link" className="btn-link--dark" onClick={() => this.addNewComment()}>Add comment</CButton>
                </div>
                {this.renderComments("site")}
              </CCard>
            }
          </CCol>
          <CCol className="d-flex">
            <div className="checkbox">
              <input type="checkbox" className="input-checkbox" id="modal_justification_req"
                onClick={()=>this.props.updateModalValues("Changes", `This will ${this.state.justificationRequired ? "unmark" : "mark"} change as justification missing`, "Continue", ()=>this.handleJustRequired(), "Cancel", () => {})}
                checked={this.state.justificationRequired}
                readOnly
              />
              <label htmlFor="modal_justification_req" className="input-label">Justification missing</label>
            </div>
          </CCol>
        </CRow>
      </CTabPane>
    )
  }

  downloadAttachments = (id, name, level) => {
    this.setState({ downloadingDocuments: [...this.state.downloadingDocuments, id] });
    let type = level === "site" ? 0 : 1;
    this.dl.fetch(ConfigData.ATTACHMENTS_DOWNLOAD + "id=" + id + "&docuType=" + type)
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
          this.setState({ downloadingDocuments: this.state.downloadingDocuments.filter(a => a !== id) });
        })
      }
      else {
        this.showErrorMessage("document", "Error downloading file");
        this.setState({ downloadingDocuments: this.state.downloadingDocuments.filter(a => a !== id) });
      }
    })
  }

  showErrorMessage(target, message) {
    if (target === "comment") {
      this.setState({ notValidComment: message });
      setTimeout(() => {
        this.setState({ notValidComment: "" });
      }, UtilsData.MESSAGE_TIMEOUT);
    }
    else if (target === "document") {
      this.setState({ notValidDocument: message });
      setTimeout(() => {
        this.setState({ notValidDocument: "" });
      }, UtilsData.MESSAGE_TIMEOUT);
    }
    else if (target === "fields") {
      this.setState({ notValidField: message });
      setTimeout(() => {
        this.setState({ notValidField: "" });
      }, UtilsData.MESSAGE_TIMEOUT);
    }
    else if (target === "bioregion") {
      this.setState({ notValidBioRegion: message });
      setTimeout(() => {
        this.setState({ notValidBioRegion: "" });
      }, UtilsData.MESSAGE_TIMEOUT);
    }
  }

  addNewComment() {
    this.setState({ newComment: true })
  }

  updateComment(target) {
    let input = target.closest(".comment--item").querySelector("textarea");
    let id = parseInt(input.id);
    if (target.innerText === "Edit") {
      input.disabled = false;
      input.readOnly = false;
      input.focus();
      target.innerText = "Save";
    } else {
      if (!input.value.trim()) {
        this.showErrorMessage("comment", "Add a comment");
      }
      else {
        this.saveComment(id, input, input.value, target);
      }
    }
  }

  addComment(target) {
    let input = target.closest(".comment--item").querySelector("textarea");
    let comment = input.value;
    let currentDate = new Date().toISOString();
    if (!comment.trim()) {
      this.showErrorMessage("comment", "Add a comment");
    }
    else {
      let body = {
        "SiteCode": this.state.data.SiteCode,
        "Version": this.state.data.Version,
        "Comments": comment,
        "Date": currentDate,
      }

      this.sendRequest(ConfigData.ADD_COMMENT, "POST", body)
        .then(response => response.json())
        .then((data) => {
          if (data?.Success) {
            let commentId = data.Data[data.Data.length - 1].Id;
            let cmts = this.state.comments === "noData" ? [] : this.state.comments;
            cmts.push({
              Comments: comment,
              SiteCode: this.state.data.SiteCode,
              Version: this.state.data.Version,
              Id: commentId,
              Date: currentDate,
              Owner: data.Data.find(a => a.Id === commentId).Owner,
            })
            this.setState({ comments: cmts, newComment: false })
          } else { this.showErrorMessage("comment", "Error adding comment") }
        });
      this.loadComments();
    }
  }

  saveComment(id, input, comment, target) {
    let body = this.state.comments.find(a => a.Id === id);
    body.Comments = comment;
    this.sendRequest(ConfigData.UPDATE_COMMENT, "PUT", body)
      .then((data) => {
        if (data?.ok) {
          this.readResponse(data.body).then((json) => {
            this.setState({ comments: json.Data })
          });

          input.disabled = true;
          input.readOnly = true;
          target.innerText = "Edit";
        }
        else {
          this.showErrorMessage("comment", "Error saving comment")
        }
      })
    this.loadComments();
  }

  deleteCommentMessage(target) {
    if (!target && this.state.newComment && document.querySelector(".comment--item.new textarea")?.value.trim() === "") {
      this.deleteComment();
    }
    else {
      this.props.updateModalValues("Delete Comment", "Are you sure you want to delete this comment?", "Continue", () => this.deleteComment(target), "Cancel", () => { })
    }
  }

  deleteComment(target) {
    if (target) {
      let input = target.closest(".comment--item").querySelector("textarea");
      let id = parseInt(input.getAttribute("id"));
      let body = id;
      this.sendRequest(ConfigData.DELETE_COMMENT, "DELETE", body)
        .then((data) => {
          if (data?.ok) {
            let cmts = this.state.comments.filter(e => e.Id !== id);
            this.setState({ comments: cmts.length > 0 ? cmts : "noData" });
          }
          else {
            this.showErrorMessage("comment", "Error deleting comment")
          }
        });
    }
    else {
      this.setState({ newComment: false });
    }
  }

  addNewDocument() {
    this.setState({ newDocument: true })
  }

  updateDocument(target) {
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
        this.showErrorMessage("document", "Add a comment");
      }
      else {
        this.saveDocumentComment(id, input, input.value, target);
      }
    }
  }

  saveDocumentComment(id, input, comment, target) {
    let body = this.state.documents.find(a => a.Id === id);
    body.Comment = comment;
    this.sendRequest(ConfigData.UPDATE_ATTACHED_FILE + "?justificationId=" + id + "&comment=" + comment, "DELETE", "")
      .then((data) => {
        if (data?.ok) {
          this.readResponse(data.body).then((json) => {
            this.setState({ documents: json.Data })
          });

          input.disabled = true;
          input.readOnly = true;
          target.innerText = "Edit";
        }
        else {
          this.showErrorMessage("document", "Error saving document comment")
        }
      })
    this.loadDocuments();
  }

  deleteDocumentMessage(target) {
    if (!target && this.state.newDocument && !this.state.isSelected) {
      this.deleteDocument();
    }
    else {
      this.props.updateModalValues("Delete Document", "Are you sure you want to delete this document?", "Continue", () => this.deleteDocument(target), "Cancel", () => { })
    }
  }

  deleteDocument(target) {
    if (target) {
      let doc = target.closest(".document--item");
      let id = parseInt(doc.getAttribute("doc_id"));
      this.sendRequest(ConfigData.DELETE_ATTACHED_FILE + "?justificationId=" + id, "DELETE", "")
        .then((data) => {
          if (data?.ok) {
            let docs = this.state.documents.filter(e => e.Id !== id);
            this.setState({ documents: docs.length > 0 ? docs : "noData" });
          }
          else {
            this.showErrorMessage("document", "Error deleting document")
          }
        });
    }
    else {
      this.setState({ newDocument: false, isSelected: false, selectedFile: "", notValidDocument: "" });
    }
  }

  changeHandler(e) {
    let formats = UtilsData.ACCEPTED_DOCUMENT_FORMATS;
    let file = e.currentTarget.closest("input").value;
    let extension = file.substring(file.lastIndexOf('.'), file.length) || file;
    if(file) {
      if (formats.includes(extension)) {
        this.setState({ selectedFile: e.target.files[0], isSelected: true });
      }
      else {
        e.currentTarget.closest("#uploadBtn").value = "";
        this.showErrorMessage("document", "File not valid, use a valid format: " + UtilsData.ACCEPTED_DOCUMENT_FORMATS);
      }
    }
    else {
      this.setState({ selectedFile: e.target.files[0], isSelected: false });
    }
  }

  async handleSubmission() {
    if (!this.state.selectedFile) {
      this.showErrorMessage("document", "Add a file");
      return;
    }

    const chunkSize = UtilsData.CHUNK_SIZE;
    const totalChunks = Math.ceil(this.state.selectedFile.size / chunkSize);
    const uploadId = 'upload-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

    const siteCode = this.state.data.SiteCode;
    const version = this.state.data.Version;
    const comment = document.querySelector(".document--new .document--comment textarea")?.value ?? "";

    this.setState({ uploadingDocument: true, notValidDocument: "" });

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, this.state.selectedFile.size);
        const chunk = this.state.selectedFile.slice(start, end);

        const form = new FormData();
        form.append('chunk', chunk, this.state.selectedFile.name);

        const res = await this.dl.fetch(
          ConfigData.ATTACHED_FILE_UPLOAD_CHUNK + "?uploadId=" + uploadId + "&chunkIndex=" + i,
          { method: 'POST', body: form, headers: {} }
        );

        if (!res.ok) {
          const body = await res.text().catch(() => '');
          throw new Error(`Chunk ${i + 1} failed: HTTP ${res.status} — ${body}`);
        }
      }

      const finalRes = await this.dl.fetch(
        ConfigData.ATTACHED_FILE_FINALIZE_UPLOAD + "?uploadId=" + uploadId + "&fileName=" + encodeURIComponent(this.state.selectedFile.name) + "&sitecode=" + siteCode + "&version=" + version + "&comment=" + encodeURIComponent(comment),
        { method: 'POST', headers: {} }
      );

      if (!finalRes.ok) {
        const body = await finalRes.text().catch(() => '');
        throw new Error(`Finalize failed: HTTP ${finalRes.status} — ${body}`);
      }

      const data = await finalRes.json();

      if (data?.Success) {
        let docs = this.state.documents === "noData" ? [] : this.state.documents;
        let newDocs = data.Data.filter(({ Id: id1 }) => !docs.some(({ Id: id2 }) => id2 === id1));
        for (let doc of newDocs) {
          docs.push({
            Id: doc.Id,
            SiteCode: siteCode,
            Version: version,
            Path: doc.Path,
            Username: doc.Username,
            ImportDate: doc.ImportDate,
            OriginalName: doc.OriginalName,
            Comment: doc.Comment,
          });
        }
        this.setState({ documents: docs, newDocument: false, isSelected: false, selectedFile: "", uploadingDocument: false });
      } else {
        this.showErrorMessage("document", "File upload failed - " + (data?.Message ?? "Unknown error"));
      }

    } catch (e) {
      this.showErrorMessage("document", e.message);
    } finally {
      this.setState({ uploadingDocument: false });
    }
  }

  handleJustRequired() {
    let body = [{
      "SiteCode": this.state.data.SiteCode,
      "VersionId": this.state.data.Version,
      "Justification": !this.state.justificationRequired,
    }];  
    this.sendRequest(ConfigData.MARK_AS_JUSTIFICATION_REQUIRED, "POST", body)  
    .then((data)=> {
      if(data?.ok){
        this.setState({justificationRequired: !this.state.justificationRequired})
        return data;
      }
      else {
        this.showErrorMessage("Justification Missing", "Update failed");
        return data;
      }
    });
  }

  createFieldElement() {
    let fields = [];
    let orderedKeys = ["SiteCode", "SiteName", "SiteType", "Area", "BioRegion"];
    let source = this.state.data;
    let data = {};
    orderedKeys.forEach(key => {
      if (key in source) data[key] = source[key];
    });
    for (let i in Object.keys(data)) {
      let field = Object.keys(data)[i]
      let id = "field_" + field;
      let value = data[field];
      let options;
      let label;
      let placeholder;
      let name = field;
      let original = this.state.data["Original" + field];
      switch (field) {
        case "SiteCode":
          label = "Site Code";
          placeholder = "Site code";
          break;
        case "SiteName":
          label = "Site Name";
          placeholder = "Site name";
          break;
        case "SiteType":
          label = "Site Type";
          placeholder = "Select site type";
          options = Object.entries(UtilsData.SITE_TYPES).map(([value, label]) => ({value,label}));
          value = options.find(y => y.value === value);
          this.siteTypeDefault = value;
          if (this.state.siteTypeValue === "") {
            this.setState({ siteTypeValue: value })
          }
          original = original && UtilsData.SITE_TYPES[original];
          break;
        case "Area":
          label = "Area";
          placeholder = "Site area";
          break;
        case "BioRegion":
          label = "Biogeographical Region";
          placeholder = "Select a region";
          options = this.props.regions.map(x => ({ label: x.RefBioGeoName, value: x.Code }));
          value = (value && value.length) ? value : [{ BGRID: null, Percentage: null, Marine_Relationship_BioGeo: null }];
          this.siteRegionDefault = value;
          if (this.state.siteRegionValue === "") {
            this.setState({ siteRegionValue: value })
          }
          original = original && original
            .map(x => {
              const name = this.props.regions.find(y => y.Code === x.BGRID)?.RefBioGeoName;
              if (!name) return null;
              let line = name;
              if (x.Percentage !== null && x.Percentage !== undefined && x.Percentage !== "") {
                line += ` (${x.Percentage}%)`;
              }
              if (x.Marine_Relationship_BioGeo) {
                const terrestrialName = this.props.regions.find(y => y.Code === x.Marine_Relationship_BioGeo)?.RefBioGeoName;
                if (terrestrialName) {
                  line += ` - ${terrestrialName}`;
                }
              }
              return line;
            })
            .filter(Boolean)
            .join(", ");
          break;
      }

      let originalField = original?.toString() &&
        <div className="original-field">
          <i className="fa-solid fa-pen-to-square"></i><span>{original}</span>
        </div>;

      fields.push(
        <>
          {field === "SiteCode" &&
            <CCol xs={12} md={12} lg={6} key={"fd_" + field} className="mb-4">
              <label>{label}</label><span className="mandatory">*</span>
              <CFormInput
                id={id}
                name={name}
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                disabled={true}
                onChange={(e) => this.onChangeField(e)}
              />
              {originalField}
            </CCol>
          }
          {field === "SiteName" &&
            <CCol xs={12} md={12} lg={6} key={"fd_" + field} className="mb-4">
              <label>{label}</label><span className="mandatory">*</span>
              <CFormInput
                id={id}
                name={name}
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
              {originalField}
            </CCol>
          }
          {field === "SiteType" &&
            <CCol xs={12} md={12} lg={6} key={"fd_" + field} className="mb-4">
              <label>{label}</label><span className="mandatory">*</span>
              <Select
                id={id}
                name={name}
                className="multi-select"
                classNamePrefix="multi-select"
                placeholder={placeholder}
                value={this.state.siteTypeValue}
                options={options}
                onChange={(e) => this.onChangeField(e, name)}
              />
              {originalField}
            </CCol>
          }
          {field === "Area" &&
            <CCol xs={12} md={12} lg={6} key={"fd_" + field} className="mb-4">
              <label>{label} (ha)</label><span className="mandatory">*</span>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
              {originalField}
            </CCol>
          }
          {field === "BioRegion" &&
            <CCol xs={12} md={12} lg={12} key={"fd_" + field} className="mb-4">
              <label>{label}</label><span className="mandatory">*</span>
              {this.state.notValidBioRegion &&
                <CAlert color="danger">
                  {this.state.notValidBioRegion}
                </CAlert>
              }
              <CTable className="bioregions-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Region</CTableHeaderCell>
                    <CTableHeaderCell>Percentage</CTableHeaderCell>
                    <CTableHeaderCell>Terrestrial region</CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {this.state.siteRegionValue !== "" && this.state.siteRegionValue.map((a, index) => this.renderBioregionRow(a, index))}
                </CTableBody>
                <CTableFoot>
                  <CTableRow>
                    <CTableDataCell>
                      <CButton color="link" className="btn-link" onClick={() => this.addBioRegionRow()}>Add region</CButton>
                    </CTableDataCell>
                    <CTableDataCell>
                      <b>Total: </b>
                      {this.state.siteRegionValue !== "" && this.state.siteRegionValue.reduce((s, r) => s + (Number(r.Percentage) || 0), 0)}%
                    </CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableFoot>
              </CTable>
              {originalField}
            </CCol>
          }
        </>
      )
    }
    return fields;
  }

  renderBioregionRow(val, index) {
    let selectedRegionCodes = this.state.siteRegionValue
      .filter((r, i) => i !== index && r.BGRID)
      .map(r => r.BGRID);

    let bioregions = this.props.regions
      .filter(x => !selectedRegionCodes.includes(x.Code))
      .map(x => ({ label: x.RefBioGeoName, value: x.Code }));

    let terrestrialRegions = this.props.regions.filter(a => !a.isMarine).map(x => ({ label: x.RefBioGeoName, value: x.Code }));
    let selectedRegion = bioregions.find(o => o.value === val.BGRID) || null;
    let selectedTerrestrial = terrestrialRegions.find(o => o.value === val.Marine_Relationship_BioGeo) || null;

    let selectedRegionData = this.props.regions.find(a => a.Code === val.BGRID);
    let isMarine = selectedRegionData?.isMarine;
    let terrestrialDisabled = !!val.BGRID && !isMarine;

    let rowInvalid = this.state.invalidBioRegionRows.includes(index);
    let regionInvalid = rowInvalid && !val.BGRID;
    let terrestrialInvalid = rowInvalid && isMarine && !val.Marine_Relationship_BioGeo;

    return (
      <CTableRow key={"bioregion_row_" + index}>
        <CTableDataCell>
          <Select
            className={"multi-select" + (regionInvalid ? " invalidField" : "")}
            classNamePrefix="multi-select"
            placeholder="Select a region"
            value={selectedRegion}
            options={bioregions}
            isMulti={false}
            closeMenuOnSelect={true}
            onChange={(opt) => this.onChangeField(opt, "BioRegion", index, "BGRID")}
          />
        </CTableDataCell>
        <CTableDataCell>
          <CFormInput
            type="number"
            min="0"
            value={val.Percentage ?? ""}
            placeholder="Add region percentage"
            autoComplete="off"
            onChange={(e) => {
              let newVal = e.target.value === "" ? null : +e.target.value;
              if (newVal !== null && newVal < 0) return;
              this.onChangeField(newVal, "BioRegion", index, "Percentage");
            }}
          />
        </CTableDataCell>
        <CTableDataCell>
          <Select
            className={"multi-select" + (terrestrialDisabled ? " disabled" : "") + (terrestrialInvalid ? " invalidField" : "")}
            classNamePrefix="multi-select"
            placeholder="Select a terrestrial region"
            value={selectedTerrestrial}
            options={terrestrialRegions}
            isMulti={false}
            isDisabled={terrestrialDisabled}
            closeMenuOnSelect={true}
            onChange={(opt) => this.onChangeField(opt, "BioRegion", index, "Marine_Relationship_BioGeo")}
          />
        </CTableDataCell>
        <CTableDataCell>
          <CButton color="link" className="btn-icon" onClick={() => this.deleteBioRegionRow(index)}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </CTableDataCell>
      </CTableRow>
    )
  }

  getDefaultTerrestrial(marineRegionCode) {
    let marineRegion = this.props.regions.find(r => r.Code === marineRegionCode);
    if (!marineRegion?.isMarine) return null;

    let terrestrialRefCode = marineRegion.RefBioRegionCode.replace(/^marine/, '');
    terrestrialRefCode = terrestrialRefCode.charAt(0).toLowerCase() + terrestrialRefCode.slice(1);

    let match = this.props.regions.find(r => !r.isMarine && r.RefBioRegionCode === terrestrialRefCode);
    if (!match && marineRegion.RefBioRegionCode === "marineBaltic") {
      match = this.props.regions.find(r => !r.isMarine && r.RefBioRegionCode === "boreal");
    }
    return match ? match.Code : null;
  }

  addBioRegionRow() {
    if (this.state.siteRegionValue.some(r => !this.isBioRegionRowComplete(r))) {
      this.showErrorMessage("bioregion", "Select a region before adding a new one");
      return;
    }
    this.setState({
      siteRegionValue: [...this.state.siteRegionValue, { BGRID: null, Percentage: null, Marine_Relationship_BioGeo: null }]
    }, () => this.checkForChanges());
  }

  isBioRegionRowComplete(r) {
    if (!r.BGRID) return false;
    let regionData = this.props.regions.find(a => a.Code === r.BGRID);
    if (regionData?.isMarine && !r.Marine_Relationship_BioGeo) return false;
    return true;
  }

  deleteBioRegionRow(index) {
    if (this.state.siteRegionValue.length > 1) {
      let siteRegionValue = this.state.siteRegionValue.filter((_, i) => i !== index);
      this.setState({ siteRegionValue }, () => this.checkForChanges());
    } else {
      let siteRegionValue = [...this.state.siteRegionValue];
      siteRegionValue[index] = { BGRID: null, Percentage: null, Marine_Relationship_BioGeo: null };
      this.setState({ siteRegionValue }, () => this.checkForChanges());
    }
  }

  renderModal() {
    let data = this.state.data;
    return (
      <>
        <CModalHeader closeButton={false}>
          <CModalTitle>
            {data.SiteCode} - {data.SiteName}
            <span className="ms-2 fw-normal">({UtilsData.SITE_TYPES[data.SiteType]})</span>
          </CModalTitle>
          <CCloseButton onClick={() => this.closeModal()} />
        </CModalHeader>
        <CModalBody >
          <CAlert color="primary" className="d-flex align-items-center" visible={this.state.justificationRequired}>
            {this.state.justificationRequired &&
              <>
                <CImage src={justificationRequiredImg} className="ico--md me-3"></CImage>
                Justification missing
              </>
            }
          </CAlert>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                active={this.state.activeKey === 1}
                onClick={() => this.warningUnsavedChanges(1)}
              >
                Edit Fields
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={this.state.activeKey === 2}
                onClick={() => this.warningUnsavedChanges(2)}
              >
                Documents & Comments
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            {this.renderFields()}
            {this.renderAttachments()}
          </CTabContent>
        </CModalBody>
        {this.state.activeKey === 1 &&
          <CModalFooter>
            <div className="d-flex w-100 justify-content-between">
              <CButton className="red" color="secondary" disabled={this.state.updatingData} onClick={() => this.closeModal()}>Cancel</CButton>
              <CButton color="primary" disabled={this.state.updatingData || !this.state.fieldChanged} onClick={() => this.saveChangesModal()}>
                {this.state.updatingData && <CSpinner size="sm" />}
                {this.state.updatingData ? " Saving" : "Save"}
              </CButton>
            </div>
          </CModalFooter>
        }
      </>
    )
  }

  renderData() {
    if (!this.isDataLoaded)
      this.loadData();
    if (!this.isCommentsLoaded)
      this.loadComments();
    if (!this.isDocumentsLoaded)
      this.loadDocuments();

    let contents = this.state.loading
      ? <div className="loading-container"><em>Loading...</em></div>
      : this.renderModal();

    return (
      <>
        {contents}
      </>
    )
  }

  closeModal() {
    if (this.state.activeKey === 1 && this.state.fieldChanged) {
      this.messageBeforeClose(() => this.close());
    }
    else if (this.state.activeKey === 2 && this.checkUnsavedChanges()) {
      this.messageBeforeClose(() => this.close());
    }
    else {
      this.close();
    }
  }

  render() {
    return (
      <>
        <CModal scrollable size="xl" visible={this.isVisible()} backdrop="static" onClose={() => this.closeModal()}>
          {this.renderData()}
        </CModal>
      </>
    )
  }

  resetLoading() {
    this.isDataLoaded = false;
    this.isDocumentsLoaded = false;
    this.isCommentsLoaded = false;
  }

  loadData() {
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)) {
      this.isDataLoaded = true;
      this.dl.fetch(ConfigData.SITEDETAIL_GET+"?siteCode="+this.props.item)
      .then(response => response.json())
      .then(data =>{
        if(data?.Success) {
          if(data.Data.SiteCode === this.props.item && Object.keys(this.state.data).length === 0) {
            this.setState({data: data.Data, loading: false, justificationRequired: data.Data.JustificationRequired})
          }
        } else { this.errorLoadingData = true; this.setState({loading: false}) }
      });
    }
  }

  loadComments() {
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)) {
      this.isCommentsLoaded = true;
      this.dl.fetch(ConfigData.GET_SITE_COMMENTS + `siteCode=${this.props.item}&version=${this.props.version}`)
        .then(response => response.json())
        .then(data => {
          if (data?.Success) {
            if (data.Data.length > 0) {
              if (data.Data[0]?.SiteCode === this.props.item && (this.state.comments.length === 0 || this.state.comments === "noData"))
                this.setState({ comments: data.Data });
            }
            else {
              this.setState({ comments: "noData" });
            }
          } else { this.errorLoadingComments = true }
        });
    }
  }

  loadDocuments() {
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)) {
      this.isDocumentsLoaded = true;
      this.dl.fetch(ConfigData.GET_ATTACHED_FILES + `siteCode=${this.props.item}&version=${this.props.version}`)
        .then(response => response.json())
        .then(data => {
          if (data?.Success) {
            if (data.Data.length > 0) {
              if (data.Data[0]?.SiteCode === this.props.item && (this.state.documents.length === 0 || this.state.documents === "noData"))
                this.setState({ documents: data.Data });
            }
            else {
              this.setState({ documents: "noData" });
            }
          } else { this.errorLoadingDocuments = true }
        });
    }
  }

  checkUnsavedChanges() {
    return this.state.loading === false
      && ((this.state.newComment && document.querySelector(".comment--item.new textarea")?.value.trim() !== "")
        || (this.state.newDocument && this.state.isSelected)
        || (this.state.comments !== "noData" && document.querySelectorAll(".comment--item:not(.new) textarea[disabled]").length !== this.state.comments.length)
        || (this.state.documents !== "noData" && document.querySelectorAll(".document--item:not(.new) textarea[disabled]").length !== this.state.documents.length)
      );
  }

  warningUnsavedChanges(activeKey) {
    if (this.state.activeKey === 1 && this.state.fieldChanged) {
      this.messageBeforeClose(() => this.cleanEditFields(activeKey));
    }
    else if (this.state.activeKey === 2 && this.checkUnsavedChanges()) {
      this.messageBeforeClose(() => this.cleanUnsavedChanges(activeKey));
    }
    else {
      if (this.state.activeKey === 2) this.cleanDocumentsAndComments();
      this.setActiveKey(activeKey);
    }
  }

  messageBeforeClose(action, keepOpen) {
    this.props.updateModalValues("Unsaved Changes", "There are unsaved changes. Do you want to continue?", "Continue", action, "Cancel", () => { }, keepOpen);
  }

  cleanUnsavedChanges(activeKey) {
    this.cleanDocumentsAndComments();
    if (activeKey) {
      this.setActiveKey(activeKey);
      document.querySelectorAll(".comment--input:not([disabled])").forEach((i) => {
        const container = i.closest(".document--item, .comment--item");
        const updateBtn = container?.querySelector(".btn-update");
        if (!updateBtn) return;
        if (!i.defaultValue) {
          i.parentElement.setAttribute("hidden", "");
        }
        i.value = i.defaultValue;
        i.disabled = true;
        updateBtn.innerText = "Edit";
      });
    }
  }

  cleanDocumentsAndComments() {
    this.deleteDocument();
    this.deleteComment();
  }

  cleanEditFields(activeKey) {
    let fields = this.getBody();
    delete fields.Version;
    delete fields.BioRegion;
    for (let i in fields) {
      document.getElementsByName(i)[0].value = this.state.data[i];
    }
    if (activeKey) {
      this.setActiveKey(activeKey);
    }
    this.setState({ siteTypeValue: this.siteTypeDefault, siteRegionValue: this.siteRegionDefault, fieldChanged: false });
  }

  normalizeBioRegions(arr) {
    return arr
      .map(r => JSON.stringify([r.BGRID, r.Percentage, r.Marine_Relationship_BioGeo]))
      .sort();
  }

  checkForChanges(e) {
    let body = this.getBody();
    let currentBioRegions = this.normalizeBioRegions(this.state.siteRegionValue.filter(r => !this.isBioRegionRowEmpty(r)));
    let defaultBioRegions = this.normalizeBioRegions(this.siteRegionDefault.filter(r => !this.isBioRegionRowEmpty(r)));
    let bioRegionChanged = JSON.stringify(currentBioRegions) !== JSON.stringify(defaultBioRegions);

    let changed = this.state.data.SiteName !== body.SiteName
      || this.state.data.Area !== body.Area
      || bioRegionChanged
      || (e && e.value !== undefined ? this.state.data.SiteType !== e.value : false);

    this.setState({ fieldChanged: changed });
    return changed;
  }

  getBody() {
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    body.BioRegion = this.state.siteRegionValue
      .filter(r => !this.isBioRegionRowEmpty(r))
      .map(r => ({
        BGRID: r.BGRID,
        Percentage: r.Percentage,
        Marine_Relationship_BioGeo: r.Marine_Relationship_BioGeo,
      }));
    body.Area = body.Area ? +body.Area : body.Area;
    body.Version = this.props.version;
    body.SiteCode = this.props.item;

    return body;
  }

  saveChangesModal() {
    let body = this.getBody();
    if (this.fieldValidator()) {
      this.props.updateModalValues("Save changes", "This will save the site changes", "Continue", () => this.saveChanges(body), "Cancel", () => { });
    }
  }

  saveChanges(body) {
    if (Object.keys(body).some(val => body[val] === null || body[val] === "")) {
      this.showErrorMessage("fields", "Empty fields are not allowed");
    } else {
      body.JustificationRequired = this.state.justificationRequired;
      this.sendRequest(ConfigData.SITEDETAIL_SAVE, "POST", body)
        .then((data) => {
          if (data?.ok) {
            this.resetLoading();
            this.setState({ data: {}, loading: true, fieldChanged: false, updatingData: false, siteRegionValue: "", siteTypeValue: "" });
          }
          else {
            this.showErrorMessage("fields", "Something went wrong");
          }
        });
      this.setState({ updatingData: true });
    }
  }

  sendRequest(url, method, body, path) {
    const options = {
      method: method,
      headers: {
        'Content-Type': path ? 'multipart/form-data' : 'application/json',
      },
      body: JSON.stringify(body),
    };
    return this.dl.fetch(url, options)
  }

  async readResponse (stream) {
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
}
