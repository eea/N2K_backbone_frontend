import ConfigData from '../../../config.json';
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
import justificationProvidedImg from './../../../assets/images/file-text.svg'
import {DataLoader} from '../../../components/DataLoader';

export class ModalEdition extends Component {
  constructor(props) {
    super(props);
    this.dl = new(DataLoader);
    this.state = {
      activeKey: 1,
      loading: true, 
      data: {}, 
      notValidField: [],
      comments:[],
      documents:[],
      newComment: false,
      newDocument: false,
      justificationRequired: false,
      justificationProvided: false,
      selectedFile: "",
      isSelected: false,
      notValidComment: "",
      notValidDocument: "",
      fieldChanged: false,
      modalValues : {
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

  componentDidMount(){
    window.addEventListener('beforeunload', (e) => this.handleLeavePage(e));
  }

  componentWillUnmount(){
    window.removeEventListener('beforeunload', (e) => this.handleLeavePage(e));
  }

  handleLeavePage(e){
    if(this.isVisible() && this.checkUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '';
    }
  }

  setActiveKey(val){
    this.setState({activeKey: val})
  }

  close(refresh){
    this.setActiveKey(1);
    this.setState({
      data: {},
      loading: true,
      comments:[],
      documents:[],
      newComment: false,
      newDocument: false,
      isSelected: false,
      selectedFile: "",
      notValidField: [],
      fieldChanged: false,
      siteTypeValue: "",
      siteRegionValue: "",
    });
    this.props.close(refresh);
  }

  isVisible(){
    return this.props.visible;
  }

  renderFields(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CForm id="siteedition_form">
          <CRow className="p-3">
            {(this.state.notValidField.length > 0) &&
              <CAlert color="danger">
                {this.state.notValidField}
              </CAlert>
            }
            {this.createFieldElement()}
          </CRow>
        </CForm>
      </CTabPane>
    )
  }
  
  fieldValidator() {
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    let data = JSON.parse(JSON.stringify( body, ["SiteCode","SiteName","SiteType","BioRegion","Area","Length","CentreY","CentreX"]));
    this.state.notValidField = [];
    for(let i in Object.keys(data)){
      let field = Object.keys(data)[i]
      let value = data[field];
      if(!value)
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
    if(field === "SiteType") {
      this.setState({siteTypeValue: e})
    }
    else if(field === "BioRegion") {
      this.setState({siteRegionValue: e})
    }
    if(e.target)
      e.target.classList.contains('invalidField') ?
        e.target.classList.remove('invalidField') 
      : {}
    this.checkForChanges();
  }

  sortComments() {
    this.state.comments.sort(
      (a,b) => b.Date && a.Date ?
        b.Date.localeCompare(a.Date)
        : {}
    );
  }

  renderComments(){
    let cmts = [];
    this.state.comments !== "noData" && this.sortComments();
    cmts.push(
      this.state.newComment &&
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
    if(this.state.comments !== "noData") {
      for(let i in this.state.comments){
        cmts.push(
          this.createCommentElement(
            this.state.comments[i].Id
            ,this.state.comments[i].Comments
            ,this.state.comments[i].Date
            ,this.state.comments[i].Owner
            ,this.state.comments[i].Edited
            ,this.state.comments[i].EditedDate
            ,this.state.comments[i].Editedby)
        )
      }
    }
    return(
      <div id="changes_comments">
        {cmts}
        {this.state.comments === "noData" && !this.state.newComment &&
          <em>No comments</em>
        }
      </div>
    )
  }

  createCommentElement(id,comment,date,owner,edited,editeddate,editedby){
    return (
      <div className="comment--item" key={"cmtItem_"+id} id={"cmtItem_"+id}>
        <div className="comment--text">
          <TextareaAutosize
            id={id}
            disabled
            defaultValue={comment}
            className="comment--input" />
          <label className="comment--date" htmlFor={id}>
            {date && owner &&
              "Commented on " + date.slice(0,10).split('-').reverse().join('/') + " by " + owner + "."
            }
            {((edited >= 1) && (editeddate && editeddate !== undefined) && (editedby && editedby !== undefined)) &&
              " Last edited on " + editeddate.slice(0,10).split('-').reverse().join('/') + " by " + editedby + "."
            }
          </label>
        </div>
        <div className="comment--icons">
          <CButton color="link" className="btn-icon" onClick={(e) => this.updateComment(e.currentTarget)} key={"cmtUpdate_"+id}>
            <i className="fa-solid fa-pencil"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={(e) => this.deleteCommentMessage(e.currentTarget)} key={"cmtDelete_"+id}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
  }

  sortDocuments() {
    this.state.documents.sort(
      (a,b) => b.ImportDate && a.ImportDate ?
        b.ImportDate.localeCompare(a.ImportDate)
        : {}
    );
  }

  renderDocuments(){
    let docs = [];
    this.state.documents !== "noData" && this.sortDocuments();
    docs.push(
      this.state.newDocument &&
      <div className="document--item new" key={"docItem_new"}>
        <div className="input-file">
          <label htmlFor="uploadBtn">
            Select file
          </label>
          <input id="uploadBtn" type="file" name="Files" onChange={(e) => this.changeHandler(e)} accept={ConfigData.ACCEPTED_DOCUMENT_FORMATS}/>
          {this.state.isSelected ? (
            <input id="uploadFile" placeholder={this.state.selectedFile.name} disabled="disabled"/>
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
    if(this.state.documents !== "noData") {
      for(let i in this.state.documents){
        docs.push(
          this.createDocumentElement(
            this.state.documents[i].Id
            ,this.state.documents[i].Path
            ,this.state.documents[i].ImportDate
            ,this.state.documents[i].Username)
        )
      }
    }
    return(
      <div id="changes_documents">
        {docs}
        {this.state.documents === "noData" && !this.state.newDocument &&
          <em>No documents</em>
        }
      </div>
    )
  }

  createDocumentElement(id,path,date,user){
    return (
      <div className="document--item" key={"docItem_"+id} id={"docItem_"+id} doc_id={id}>
        <div className="my-auto document--text">
          <CImage src={justificationProvidedImg} className="ico--md me-3"></CImage>
          <span>{path.replace(/^.*[\\\/]/, '')}</span>
        </div>
        <div className="document--icons">
          { (date||user) &&
            <CTooltip 
              content={"Uploaded"
                + (date && " on " + date.slice(0,10).split('-').reverse().join('/'))
                + (user && " by " + user)}>
              <div className="btn-icon">
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

  renderAttachments(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
        <CRow className="py-3">
          <CCol className="mb-3" xs={12} lg={6}>
            <CCard className="document--list">
              {this.state.notValidDocument &&
                <CAlert color="danger">
                  {this.state.notValidDocument}
                </CAlert>
              }
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Attached documents</b>
                <CButton color="link" className="btn-link--dark" onClick={() => this.addNewDocument()}>Add Document</CButton>
              </div>
              {this.renderDocuments()}
            </CCard>
          </CCol>
          <CCol className="mb-3" xs={12} lg={6}>
            <CCard className="comment--list">
              {this.state.notValidComment &&
                <CAlert color="danger">
                  {this.state.notValidComment}
                </CAlert>
              }
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Comments</b>
                <CButton color="link" className="btn-link--dark" onClick={() => this.addNewComment()}>Add Comment</CButton>
              </div>
              {this.renderComments()}
            </CCard>
          </CCol>
          <CCol className="d-flex">
            <div className="checkbox">
              <input type="checkbox" className="input-checkbox" id="modal_justification_req"
                onClick={()=>this.props.updateModalValues("Changes", `This will ${this.state.justificationRequired ? "unmark" : "mark"} change as justification required`, "Continue", ()=>this.handleJustRequired(), "Cancel", () => {})}
                checked={this.state.justificationRequired}
                readOnly
              />
              <label htmlFor="modal_justification_req" className="input-label">Justification required</label>
            </div>
            <div className="checkbox" disabled={(this.state.justificationRequired ? false : true)}>
              <input type="checkbox" className="input-checkbox" id="modal_justification_prov"
                onClick={()=>this.props.updateModalValues("Changes", `This will ${this.state.justificationProvided ? "unmark": "mark"} change as justification provided`, "Continue", ()=>this.handleJustProvided(), "Cancel", () => {})}
                checked={this.state.justificationProvided} 
                readOnly
              />
              <label htmlFor="modal_justification_prov" className="input-label" disabled={(this.state.justificationRequired ? false : true)}>Justification provided</label>
            </div>
          </CCol>
        </CRow>
      </CTabPane>
    )
  }

  showErrorMessage(target, message) {
    if (target === "comment") {
      this.setState({notValidComment: message});
      setTimeout(() => {
        this.setState({notValidComment: ""});
      }, 5000);
    }
    else if (target === "document") {
      this.setState({notValidDocument: message});
      setTimeout(() => {
        this.setState({notValidDocument: ""});
      }, 5000);
    }
    else if (target === "fields") {
      this.setState({notValidField: message});
      setTimeout(() => {
        this.setState({notValidField: ""});
      }, 5000);
    }
  }

  addNewComment() {
    this.setState({newComment: true})
  }

  updateComment(target){
    let input = target.closest(".comment--item").querySelector("textarea");
    let id = parseInt(input.id);
    if (target.firstChild.classList.contains("fa-pencil")) {
      input.disabled = false;
      input.readOnly = false;
      input.focus();
      target.firstChild.classList.replace("fa-pencil", "fa-floppy-disk");
    } else {
      if (!input.value.trim()) {
        this.showErrorMessage("comment", "Add comment");
      }
      else {
        this.saveComment(id,input,input.value,target);
      }
    }
  }

  addComment(target){
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
      
      this.sendRequest(ConfigData.ADD_COMMENT,"POST",body)
      .then(response => response.json())
      .then((data) => {
        if(data?.Success){
          let commentId = data.Data[data.Data.length-1].Id;
          let cmts = this.state.comments === "noData" ? [] : this.state.comments;
          cmts.push({
            Comments: comment,
            SiteCode: this.state.data.SiteCode,
            Version: this.state.data.Version,
            Id: commentId,
            Date: currentDate,
            Owner: data.Data.find(a=>a.Id===commentId).Owner,
          })
          this.setState({comments: cmts, newComment: false})
        }
      });
      this.loadComments();
    }
  }

  saveComment(id,input,comment,target){
    let body = this.state.comments.find(a=>a.Id===id);
    body.Comments = comment;
    
    this.sendRequest(ConfigData.UPDATE_COMMENT,"PUT",body)
    .then((data) => {
      let reader = data.body.getReader();
      let txt = "";
      let readData = (data) => {
        if(data.done)
          return JSON.parse(txt);
        else{
          txt += new TextDecoder().decode(data.value);
          return reader.read().then(readData);
        }
      }

      reader.read().then(readData).then((data) => {
        this.setState({comments: data.Data})
      });

      if(data?.ok){
        input.disabled = true;
        input.readOnly = true;
        target.firstChild.classList.replace("fa-floppy-disk", "fa-pencil");
      }
    })
    this.loadComments();
  }

  deleteCommentMessage(target){
    if(!target && this.state.newComment && document.querySelector(".comment--item.new textarea")?.value.trim() === "") {
      this.deleteComment();
    }
    else {
      this.props.updateModalValues("Delete Comment", "Are you sure you want to delete this comment?", "Continue", () => this.deleteComment(target), "Cancel", () => {})
    }
  }

  deleteComment(target){
    if(target) {
      let input = target.closest(".comment--item").querySelector("textarea");
      let id = input.getAttribute("id");
      let body = id;
      this.sendRequest(ConfigData.DELETE_COMMENT,"DELETE",body)
      .then((data) => {
        if(data?.ok){
          let cmts = this.state.comments.filter(e => e.Id !== parseInt(id));
          this.setState({comments: cmts.length > 0 ? cmts : "noData"});
        }
      });
    }
    else {
      this.setState({newComment: false});
    }
  }

  addNewDocument(){
    this.setState({newDocument: true})
  }

  deleteDocumentMessage(target){
    if(!target && this.state.newDocument && !this.state.isSelected) {
      this.deleteDocument();
    }
    else {
      this.props.updateModalValues("Delete Document", "Are you sure you want to delete this document?", "Continue", () => this.deleteDocument(target), "Cancel", () => {})
    }
  }

  deleteDocument(target){
    if(target) {
      let doc = target.closest(".document--item");
      let id = doc.getAttribute("doc_id");
      this.sendRequest(ConfigData.DELETE_ATTACHED_FILE+"?justificationId="+id,"DELETE","")
      .then((data) => {
        if(data?.ok){
          let docs = this.state.documents.filter(e => e.Id !== parseInt(id));
          this.setState({documents: docs.length > 0 ? docs : "noData"});
        }
      });
    }
    else {
      this.setState({newDocument: false, isSelected: false, selectedFile: "", notValidDocument: ""});
    }
  }

  changeHandler (e) {
    let formats = ConfigData.ACCEPTED_DOCUMENT_FORMATS;
    let file = e.currentTarget.closest("input").value;
    let extension = file.substring(file.lastIndexOf('.'), file.length) || file;
    if (formats.includes(extension)) {
      this.setState({selectedFile: e.target.files[0],isSelected: true});
    }
    else {
      e.currentTarget.closest("#uploadBtn").value = "";
      this.showErrorMessage("document", "File not valid, use a valid format: " + ConfigData.ACCEPTED_DOCUMENT_FORMATS);
    }
  }

  uploadFile(data){
    let siteCode = this.state.data.SiteCode;
    let version = this.state.data.Version;
    return this.dl.xmlHttpRequest(ConfigData.UPLOAD_ATTACHED_FILE+'?sitecode='+siteCode+'&version='+version,data);
  }

  handleSubmission () {
    if (this.state.selectedFile) {
      this.setState({notValidDocument:""});
      let formData = new FormData();
      formData.append("Files",this.state.selectedFile, this.state.selectedFile.name);

      return this.uploadFile(formData)
      .then(data => {
        if(data?.Success){
          let docs = this.state.documents === "noData" ? [] : this.state.documents;
          let newDocs = data.Data.filter(({ Id: id1 }) => !docs.some(({ Id: id2 }) => id2 === id1));
          for(let i in newDocs){
            let document = newDocs[i];
            let documentId = document.Id;
            let path = document.Path;
            docs.push({
              Id: documentId,
              SiteCode: this.state.data.SiteCode,
              Version: this.state.data.Version,
              Path: path,
              Username: document.Username,
              ImportDate: document.ImportDate
            })
          }
          this.setState({documents: docs, newDocument: false, isSelected: false, selectedFile: ""})
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

  handleJustRequired(){
    let body = [{
      "SiteCode": this.state.data.SiteCode,
      "VersionId": this.state.data.Version,
      "Justification": !this.state.justificationRequired,
    }];  
    this.sendRequest(ConfigData.MARK_AS_JUSTIFICATION_REQUIRED, "POST", body)  
    .then((data)=> {
      if(data?.ok){
        if(this.state.justificationRequired)
          this.setState({justificationRequired: !this.state.justificationRequired, justificationProvided: false})
        else
          this.setState({justificationRequired: !this.state.justificationRequired})
        return data;
      }
      else {
        this.showErrorMessage("Justification Required", "Update failed");
        return data;
      }
    });
  }
  
  handleJustProvided(){
    let body = [{
      "SiteCode": this.state.data.SiteCode,
      "VersionId": this.state.data.Version,
      "Justification": !this.state.justificationProvided,
    }];  
    this.sendRequest(ConfigData.PROVIDE_JUSTIFICATION, "POST", body)
    .then((data)=> {
      if(data?.ok){
        this.setState({justificationProvided: !this.state.justificationProvided})
      }
      else {
        this.showErrorMessage("Justification Provided", "Update failed");
        return data;
      }
    });
  }

  createFieldElement(){
    let fields = [];
    let data = this.state.data;
    data = JSON.parse(JSON.stringify( data, ["SiteCode","SiteName","SiteType","BioRegion","Area","Length","CentreY","CentreX"]));
    for(let i in Object.keys(data)){
      let field = Object.keys(data)[i]
      let id = "field_" + field;
      let value = data[field];
      let options;
      let label;
      let placeholder;
      let name = field;
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
          options = this.props.types.map(x => x = {label:x.Classification, value:x.Code});
          value = options.find(y => y.value === value);
          this.siteTypeDefault = value;
          if(this.state.siteTypeValue === "") {
            this.setState({siteTypeValue: value})
          }
          break;
        case "BioRegion":
          label = "Biogeographycal Region";
          placeholder = "Select a region";
          options = this.props.regions.map(x => x = {label:x.RefBioGeoName, value:x.Code});
          value = value.map(x => options.find(y => y.value === x));
          this.siteRegionDefault = value;
          if(this.state.siteRegionValue === "") {
            this.setState({siteRegionValue: value})
          }
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
        <CCol xs={12} md={12} lg={6} key={"fd_"+field} className="mb-4">
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
              <label>{label}</label>
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
              <label>{label}</label>
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
              <label>{label}</label>
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
              <label>{label}</label>
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
        </CCol>
      )
    }
    return fields;
  }

  renderModal() {
    let data = this.state.data;
    return(
      <>
        <CModalHeader closeButton={false}>
          <CModalTitle>{data.SiteCode} - {data.SiteName}</CModalTitle>
          <CCloseButton onClick={()=>this.closeModal()}/>
        </CModalHeader>
        <CModalBody >
          <CAlert color="primary" className="d-flex align-items-center" visible={this.state.justificationProvided || this.state.justificationRequired}>
            {this.state.justificationRequired && !this.state.justificationProvided &&
              <>
                <CImage src={justificationRequiredImg} className="ico--md me-3"></CImage>
                Justification required
              </>
            }
            {this.state.justificationProvided &&
              <>
                <CImage src={justificationProvidedImg} className="ico--md me-3"></CImage>
                Justification provided
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
        <CModalFooter>
          <div className="d-flex w-100 justify-content-between">
            <CButton color="secondary" disabled= {this.state.updatingData} onClick={()=>this.closeModal()}>Cancel</CButton>
            <CButton color="primary" disabled= {this.state.updatingData || !this.state.fieldChanged} onClick={() => this.checkUnsavedChanges() ? this.messageBeforeClose(()=>this.saveChangesModal(true), true) : this.saveChangesModal()}>
              {this.state.updatingData && <CSpinner size="sm"/>}
              {this.state.updatingData? " Saving":"Save"}
            </CButton>
          </div>
        </CModalFooter>
      </>
    )
  }

  renderData(){
    this.loadData();
    this.loadComments();
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

  closeModal(){
    if (this.checkUnsavedChanges()){
      this.messageBeforeClose(() => this.close())
    }
    else {
      this.close();
    }
  }

  render() {
    return(
      <>
        <CModal scrollable size="xl" visible={this.isVisible()} backdrop="static" onClose={()=>this.closeModal()}>
          {this.renderData()}
        </CModal>
      </>
    )
  }

  loadData(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      this.dl.fetch(ConfigData.SITEDETAIL_GET+"?siteCode="+this.props.item)
      .then(response => response.json())
      .then(data =>{
        if(data.Data.SiteCode === this.props.item && Object.keys(this.state.data).length === 0) {
          this.setState({data: data.Data, loading: false, justificationRequired: data.Data.JustificationRequired, justificationProvided: data.Data.JustificationProvided})
        }
      });
    }
  }

  loadComments(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      this.dl.fetch(ConfigData.GET_SITE_COMMENTS+`siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => {
        if (data.Data.length > 0) {
          if(data.Data[0]?.SiteCode === this.props.item && (this.state.comments.length === 0 || this.state.comments === "noData"))
          this.setState({comments: data.Data});
        }
        else {
          this.setState({comments: "noData"});
        }
      });
    }
  }

  loadDocuments(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      this.dl.fetch(ConfigData.GET_ATTACHED_FILES+`siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => {
        if (data.Data.length > 0) {
          if(data.Data[0]?.SiteCode === this.props.item && (this.state.documents.length === 0 || this.state.documents === "noData"))
          this.setState({documents: data.Data});
        }
        else {
          this.setState({documents: "noData"});
        }
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
    if(this.checkUnsavedChanges()) {
      if(this.state.activeKey === 1) {
        this.props.updateModalValues("Edit fields",
          "There are unsaved changes. Do you want to continue?",
          "Continue", () => {this.cleanUnsavedChanges(); this.setActiveKey(activeKey)},
          "Cancel", () => {});
      }
      if(this.state.activeKey === 2) {
        this.props.updateModalValues("Documents & Comments",
          "There are unsaved changes. Do you want to continue?",
          "Continue", () => {this.cleanUnsavedChanges(); this.setActiveKey(activeKey)},
          "Cancel", () => {});
      }
    } else {
      this.setActiveKey(activeKey)
    }
  }

  messageBeforeClose(action, keepOpen) {
    this.props.updateModalValues("Site Edition", "There are unsaved changes. Do you want to continue?", "Continue", action, "Cancel", () => {}, keepOpen);
  }

  cleanUnsavedChanges(activeKey) {
    this.cleanDocumentsAndComments();
    this.cleanEditFields();
  }

  cleanDocumentsAndComments() {
    this.deleteDocument();
    this.deleteComment();
  }

  cleanEditFields() {
    let fields = this.getBody();
    delete fields.Version;
    for(let i in fields) {
      document.getElementsByName(i)[0].value = this.state.data[i];
    }
    this.setState({siteTypeValue: this.siteTypeDefault, siteRegionValue: this.siteRegionDefault})
    this.siteTypeDefault = this.state.siteTypeValue;
    this.siteRegionDefault = this.state.siteRegionValue;
  }

  checkForChanges() {
    let body = this.getBody();
    let errorMargin = 0.00000001;
    if(this.state.data.SiteName !== body.SiteName
      || this.state.data.Area !== body.Area
      || this.state.data.Length !== body.Length
      || (Math.abs(this.state.data.CentreX - body.CentreX) > errorMargin)
      || (Math.abs(this.state.data.CentreY - body.CentreY) > errorMargin)
      || JSON.stringify(this.state.siteTypeValue) !== JSON.stringify(this.siteTypeDefault)
      || JSON.stringify(this.state.siteRegionValue) !== JSON.stringify(this.siteRegionDefault)
    ) {
      this.setState({fieldChanged: true});
      return true;
    } else {
      this.setState({fieldChanged: false});
      return false;
    }
  }

  getBody() {
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    body.BioRegion = Array.from(document.getElementsByName("BioRegion")).map(el => el.value).sort().toString();
    body.Area = body.Area ? +body.Area : body.Area;
    body.Length = body.Length ? +body.Length : body.Length;
    body.CentreX = body.CentreX ? +body.CentreX : body.CentreX;
    body.CentreY = body.CentreY ? +body.CentreY : body.CentreY;
    body.Version = this.props.version;
    body.SiteCode = this.props.item;

    return body;
  }

  saveChangesModal() {
    let body = this.getBody();
    if(this.fieldValidator()) {
      this.cleanUnsavedChanges(1);
      this.props.updateModalValues("Save changes", "This will save the site changes", "Continue", ()=>this.saveChanges(body), "Cancel", ()=>{});
    }
  }

  saveChanges(body){
    if(Object.values(body).some(val => val === null || val === "")){
      this.showErrorMessage("fields", "Empty fields are not allowed");
    } else {
      this.sendRequest(ConfigData.SITEDETAIL_SAVE, "POST", body)
      .then((data)=> {
        if(data?.ok){
          this.setState({updatingData:false});
          this.close(true);
        }
        else {
          this.showErrorMessage("fields", "Something went wrong");
        }
      });
      this.setState({updatingData:true});
    }
  }

  sendRequest(url,method,body,path){
    const options = {
      method: method,
      headers: {
      'Content-Type': path? 'multipart/form-data' :'application/json',
      },
      body: JSON.stringify(body),
    };
    return this.dl.fetch(url, options)
  }
}
