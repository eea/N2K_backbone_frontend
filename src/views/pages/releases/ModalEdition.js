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
      justificationRequired: false,
      selectedFile: "",
      isSelected: false,
      notValidComment: "",
      notValidDocument: "",
      fieldChanged: false,
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
    if(this.isVisible() && this.state.activeKey === 2) {
      this.attachmentsHeight();
      window.addEventListener("resize", () => {this.attachmentsHeight()});
    }
  }

  attachmentsHeight = () => {
    let height = document.querySelector(".modal-body").offsetHeight - document.querySelector(".modal-body .nav").offsetHeight - document.querySelector("#modal_justification_req").parentElement.offsetHeight - document.querySelector(".attachments--title").offsetHeight - 80;
    if(document.querySelector(".document--list").scrollHeight > height) {
      document.querySelector(".document--list").style.height = height + "px";
    }
    if(document.querySelector(".comment--list").scrollHeight > height) {
      document.querySelector(".comment--list").style.height = height + "px";
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
      isSelected: false,
      selectedFile: "",
      notValidField: [],
      fieldChanged: false,
      siteTypeValue: "",
      siteRegionValue: "",
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
    let data = JSON.parse(JSON.stringify(body, ["SiteCode", "SiteName", "SiteType", "BioRegion", "Area", "Length", "CentreY", "CentreX"]));
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
    this.state.notValidField.length > 0 && this.showErrorMessage("fields", "Empty fields are not allowed");
    return this.state.notValidField.length == 0;
  }

  onChangeField(e, field) {
    if (field === "SiteType") {
      this.setState({ siteTypeValue: e }, () => this.checkForChanges(e))
    }
    else if (field === "BioRegion") {
      this.setState({ siteRegionValue: e }, () => this.checkForChanges(e))
    }
    else {
      this.checkForChanges()
    }
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
        <div className="comment--text">
          <TextareaAutosize
            minRows={3}
            placeholder="Add a comment"
            className="comment--input"
            onChange={({ target }) => this.props.setHasChanges(target.value.length > 0)}
          ></TextareaAutosize>
        </div>
        <div>
          <CButton color="link" className="btn-link" onClick={(e) => this.addComment(e.currentTarget)}>
            Save
          </CButton>
          <CButton color="link" className="btn-icon" onClick={() => this.deleteCommentMessage()}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
    if (this.state.comments !== "noData") {
      filteredComments.forEach(c => {
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
        {level == "site" &&
          <div className="comment--icons">
            <CButton color="link" className="btn-link" onClick={(e) => this.updateComment(e.currentTarget)} key={"cmtUpdate_" + id}>
              Edit
            </CButton>
            <CButton color="link" className="btn-icon" onClick={(e) => this.deleteCommentMessage(e.currentTarget)} key={"cmtDelete_" + id}>
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
          </div>
        }
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
      <div className="document--item new" key={"docItem_new"}>
        <div className="input-file">
          <label htmlFor="uploadBtn">
            Select file
          </label>
          <input id="uploadBtn" type="file" name="Files" onChange={(e) => this.changeHandler(e)} accept={UtilsData.ACCEPTED_DOCUMENT_FORMATS} />
          {this.state.isSelected ? (
            <input id="uploadFile" placeholder={this.state.selectedFile.name} disabled="disabled" />
          ) : (<input id="uploadFile" placeholder="No file selected" disabled="disabled" />)}
        </div>
        <div className="document--icons">
          <CButton color="link" className="btn-link" onClick={() => this.handleSubmission()}>
            Save
          </CButton>
          <CButton color="link" className="btn-icon" onClick={() => this.deleteDocumentMessage()}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
    if (this.state.documents !== "noData") {
      filteredDocuments.forEach(d => {
        // original name may be null until the backend part it's finished
        const name = d.OriginalName ?? d.Path;
        docs.push(
          this.createDocumentElement(d.Id, name, d.ImportDate, d.Username, target)
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

  createDocumentElement(id, name, date, user, level) {
    return (
      <div className="document--item" key={"docItem_" + id} id={"docItem_" + id} doc_id={id}>
        <div className="my-auto document--text">
          <div className="document--file">
            <CImage src={documentImg} className="ico--md me-3"></CImage>
            <span>{name?.replace(/^.*[\\\/]/, '')}</span>
          </div>
          {(date || user) &&
            <label className="comment--date" htmlFor={"docItem_" + id}>
              {"Uploaded"
              + (date && " on " + date.slice(0, 10).split('-').reverse().join('/'))
              + (user && " by " + user)}
            </label>
          }
        </div>
        <div className="document--icons">
          <CButton color="link" className="btn-link" onClick={()=>{this.downloadAttachments(id, name, level)}}>
            View
          </CButton>
          {level == "site" &&
            <CButton color="link" className="btn-icon" onClick={(e) => this.deleteDocumentMessage(e.currentTarget)}>
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
          }
        </div>
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
                {this.state.notValidDocument &&
                  <CAlert color="danger">
                    {this.state.notValidDocument}
                  </CAlert>
                }
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Country Level</b>
                  <CButton color="link" className="btn-link--dark" href="#/releases/documentation">Release Documentation</CButton>
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
            <div className="attachments--title">
              <b>Comments</b>
            </div>
            {this.errorLoadingComments ?
              <CAlert color="danger">Error loading comments</CAlert>
              :
              <CCard className="comment--list">
                {this.state.notValidComment &&
                  <CAlert color="danger">
                    {this.state.notValidComment}
                  </CAlert>
                }
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Country Level</b>
                  <CButton color="link" className="btn-link--dark" href="#/releases/documentation">Release Documentation</CButton>
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
        })
      }
      else {
        this.showErrorMessage("document", "Error downloading file");
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
        this.showErrorMessage("comment", "Add comment");
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
        let reader = data.body.getReader();
        let txt = "";
        let readData = (data) => {
          if (data.done)
            return JSON.parse(txt);
          else {
            txt += new TextDecoder().decode(data.value);
            return reader.read().then(readData);
          }
        }

        reader.read().then(readData).then((data) => {
          this.setState({ comments: data.Data })
        });

        if (data?.ok) {
          input.disabled = true;
          input.readOnly = true;
          target.innerText = "Edit";
        } else { this.showErrorMessage("comment", "Error saving comment") }
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
      let id = input.getAttribute("id");
      let body = id;
      this.sendRequest(ConfigData.DELETE_COMMENT, "DELETE", body)
        .then((data) => {
          if (data?.ok) {
            let cmts = this.state.comments.filter(e => e.Id !== parseInt(id));
            this.setState({ comments: cmts.length > 0 ? cmts : "noData" });
          } else { this.showErrorMessage("comment", "Error deleting comment") }
        });
    }
    else {
      this.setState({ newComment: false });
    }
  }

  addNewDocument() {
    this.setState({ newDocument: true })
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
      let id = doc.getAttribute("doc_id");
      this.sendRequest(ConfigData.DELETE_ATTACHED_FILE + "?justificationId=" + id, "DELETE", "")
        .then((data) => {
          if (data?.ok) {
            let docs = this.state.documents.filter(e => e.Id !== parseInt(id));
            this.setState({ documents: docs.length > 0 ? docs : "noData" });
          } else { this.showErrorMessage("document", "Error deleting document") }
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

  uploadFile(data) {
    let siteCode = this.state.data.SiteCode;
    let version = this.state.data.Version;
    return this.dl.xmlHttpRequest(ConfigData.UPLOAD_ATTACHED_FILE + '?sitecode=' + siteCode + '&version=' + version, data);
  }

  handleSubmission() {
    if (this.state.selectedFile) {
      this.setState({ notValidDocument: "" });
      let formData = new FormData();
      formData.append("Files", this.state.selectedFile, this.state.selectedFile.name);

      return this.uploadFile(formData)
        .then(data => {
          if (data?.Success) {
            let docs = this.state.documents === "noData" ? [] : this.state.documents;
            let newDocs = data.Data.filter(({ Id: id1 }) => !docs.some(({ Id: id2 }) => id2 === id1));
            for (let i in newDocs) {
              let document = newDocs[i];
              let documentId = document.Id;
              let path = document.Path;
              docs.push({
                Id: documentId,
                SiteCode: this.state.data.SiteCode,
                Version: this.state.data.Version,
                Path: path,
                Username: document.Username,
                ImportDate: document.ImportDate,
                OriginalName: document.OriginalName
              })
            }
            this.setState({ documents: docs, newDocument: false, isSelected: false, selectedFile: "" })
          }
          else {
            this.showErrorMessage("document", "File upload failed - " + data.Message);
          }
        });
    }
    else {
      this.showErrorMessage("document", "Add a file");
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
    let data = this.state.data;
    data = JSON.parse(JSON.stringify(data, ["SiteCode", "SiteName", "SiteType", "BioRegion", "Area", "Length", "CentreY", "CentreX"]));
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
          options = this.props.types.map(x => x = { label: x.Classification, value: x.Code });
          value = options.find(y => y.value === value);
          this.siteTypeDefault = value;
          if (this.state.siteTypeValue === "") {
            this.setState({ siteTypeValue: value })
          }
          original = original && this.props.types.find(y => y.Code === original).Classification;
          break;
        case "BioRegion":
          label = "Biogeographical Region";
          placeholder = "Select a region";
          options = this.props.regions.map(x => x = { label: x.RefBioGeoName, value: x.Code });
          value = value.map(x => options.find(y => y.value === x));
          this.siteRegionDefault = value;
          if (this.state.siteRegionValue === "") {
            this.setState({ siteRegionValue: value })
          }
          original = original && original.map(x => this.props.regions.find(y => y.Code === x).RefBioGeoName).join(", ");
          break;
        case "Area":
          label = "Area";
          placeholder = "Site area";
          break;
        case "Length":
          label = "Length";
          placeholder = "Site length";
          break;
        case "CentreY":
          label = "Latitude";
          placeholder = "Site centre location latitude";
          break;
        case "CentreX":
          label = "Longitude";
          placeholder = "Site centre location longitude";
          break;
      }
      fields.push(
        <CCol xs={12} md={12} lg={6} key={"fd_" + field} className="mb-4">
          {field === "SiteCode" &&
            <>
              <label>{label}</label>
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
            </>
          }
          {field === "SiteName" &&
            <>
              <label>{label}</label>
              <CFormInput
                id={id}
                name={name}
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "SiteType" &&
            <>
              <label>{label}</label>
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
            </>
          }
          {field === "BioRegion" &&
            <>
              <label>{label}</label>
              <Select
                id={id}
                name={name}
                className="multi-select"
                classNamePrefix="multi-select"
                placeholder={placeholder}
                value={this.state.siteRegionValue}
                options={options}
                isMulti={true}
                closeMenuOnSelect={false}
                onChange={(e) => this.onChangeField(e, name)}
              />
            </>
          }
          {field === "Area" &&
            <>
              <label>{label} (ha)</label>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "Length" &&
            <>
              <label>{label} (km)</label>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "CentreX" &&
            <>
              <label>{label} (deg)</label>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "CentreY" &&
            <>
              <label>{label} (deg)</label>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {original?.toString() &&
            <div className="original-field">
              <i className="fa-solid fa-pen-to-square"></i><span>{original}</span>
            </div>
          }
        </CCol>
      )
    }
    return fields;
  }

  renderModal() {
    let data = this.state.data;
    return (
      <>
        <CModalHeader closeButton={false}>
          <CModalTitle>
            {data.SiteCode} - {data.SiteName}
            <span className="ms-2 fw-normal">({this.props.types.find(a => a.Code === data.SiteType).Classification})</span>
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
    if (this.checkUnsavedChanges()) {
      this.messageBeforeClose(() => this.close())
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
        || this.checkForChanges()
      );
  }

  warningUnsavedChanges(activeKey) {
    if (this.state.fieldChanged && this.state.activeKey === 1) {
      this.props.updateModalValues("Edit fields",
        "There are unsaved changes. Do you want to continue?",
        "Continue", () => { this.cleanEditFields(); this.setActiveKey(activeKey) },
        "Cancel", () => { });
    }
    else if (this.checkUnsavedChanges() && this.state.activeKey === 2) {
      this.props.updateModalValues("Documents & Comments",
        "There are unsaved changes. Do you want to continue?",
        "Continue", () => { this.cleanUnsavedChanges(); this.setActiveKey(activeKey) },
        "Cancel", () => { });
    }
    else {
      this.setActiveKey(activeKey)
    }
  }

  messageBeforeClose(action, keepOpen) {
    this.props.updateModalValues("Site Edition", "There are unsaved changes. Do you want to continue?", "Continue", action, "Cancel", () => { }, keepOpen);
  }

  cleanUnsavedChanges() {
    this.cleanDocumentsAndComments();
  }

  cleanDocumentsAndComments() {
    this.deleteDocument();
    this.deleteComment();
  }

  cleanEditFields() {
    let fields = this.getBody();
    delete fields.Version;
    for (let i in fields) {
      document.getElementsByName(i)[0].value = this.state.data[i];
    }
    this.setState({ siteTypeValue: this.siteTypeDefault, siteRegionValue: this.siteRegionDefault, fieldChanged: false })
    this.siteTypeDefault = this.state.siteTypeValue;
    this.siteRegionDefault = this.state.siteRegionValue;
  }

  checkForChanges(e) {
    let body = this.getBody();
    let errorMargin = 0.00000001;
    if (this.state.data.SiteName !== body.SiteName
      || this.state.data.Area !== body.Area
      || this.state.data.Length !== body.Length
      || (Math.abs(this.state.data.CentreX - body.CentreX) > errorMargin)
      || (Math.abs(this.state.data.CentreY - body.CentreY) > errorMargin)
      || JSON.stringify(this.state.siteTypeValue) !== JSON.stringify(this.siteTypeDefault)
      || JSON.stringify(this.state.siteRegionValue) !== JSON.stringify(this.siteRegionDefault)
    ) {
      this.setState({ fieldChanged: true });
    } else {
      this.setState({ fieldChanged: false });
    }
    if (typeof e !== 'undefined') {
      if (e && e.target)
        e.target.classList.contains('invalidField') ?
          e.target.classList.remove('invalidField')
          : {}
    }

    return this.state.fieldChanged;
  }

  getBody() {
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    body.BioRegion = Array.from(document.getElementsByName("BioRegion")).map(el => el.value).sort().toString();
    body.Area = body.Area ? +body.Area : body.Area;
    body.Length = body.Length ? +body.Length : null;
    body.CentreX = body.CentreX ? +body.CentreX : body.CentreX;
    body.CentreY = body.CentreY ? +body.CentreY : body.CentreY;
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
    if (Object.keys(body).some(val => val !== "Length" && (body[val] === null || body[val] === ""))) {
      this.showErrorMessage("fields", "Empty fields are not allowed");
    } else {
      body.JustificationRequired = this.state.justificationRequired;
      this.sendRequest(ConfigData.SITEDETAIL_SAVE, "POST", body)
        .then((data) => {
          if (data?.ok) {
            body = {
              ...body,
              BioRegion: body.BioRegion.split(",").map(Number),
            }
            let newFields = Object.keys(this.state.data).filter(a => !body.hasOwnProperty(a));
            for (let i in newFields) {
              let field = newFields[i];
              let value = this.state.data[field];
              let ref = field.replace('Original', '');
              if (field === "OriginalBioRegion") {
                if (!value && JSON.stringify(body[ref]) !== JSON.stringify(this.state.data[ref])) {
                  value = this.state.data[ref];
                }
                else if (value && JSON.stringify(body[ref]) === JSON.stringify(value)) {
                  value = null;
                }
              }
              else {
                if (!value?.toString() && body[ref] !== this.state.data[ref]) {
                  value = this.state.data[ref];
                }
                else if (value?.toString() && body[ref] === value) {
                  value = null;
                }
              }
              body[field] = value;
            }
            this.setState({ data: body, fieldChanged: false, updatingData: false });
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
}
