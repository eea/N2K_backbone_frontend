import ConfigData from '../../../config.json';
import React, { Component, useState } from 'react';
import {
  CButton,
  CCol,
  CRow,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNav,
  CNavItem,
  CNavLink,
  CSidebarNav,
  CTable,
  CTableBody,  
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CImage,
  CPagination,
  CPaginationItem, 
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTabContent,
  CTabPane,
  CCollapse,
  CCard,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'

import { ConfirmationModal } from './components/ConfirmationModal';
import justificationprovided from './../../../assets/images/file-text.svg'

import MapViewer from './components/MapViewer'
import { getOptions } from 'highcharts';

export class ModalChanges extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1, 
      loading: true, 
      data: {}, 
      levels:["Critical"],
      bookmark: "",
      bookmarks: [],
      bookmarkUpdate: false,
      comments:[],
      documents:[],
      showDetail: "",
      showAlert: false,
      newComment: false,
      newDocument: false,
      justificationRequired: false,
      justificationProvided: false,
      selectedFile: "",
      isSelected: false,
      notValidComment: "",
      notValidDocument: "",
      modalValues : {
        visibility: false,
        close: () => {
          this.setState({
            modalValues: {
              visibility: false
            }
          });
        }
      }
    };
  }

  updateModalValues(title, text, primaryButtonText, primaryButtonFunction, secondaryButtonText, secondaryButtonFunction) {
    this.setState({
      modalValues : {
        visibility: true,
        title: title,
        text: text,
        primaryButton: (
          primaryButtonText && primaryButtonFunction ? {
            text: primaryButtonText,
            function: () => primaryButtonFunction(),
          }
          : ''
        ),
        secondaryButton: (
          secondaryButtonText && secondaryButtonFunction ? {
            text: secondaryButtonText,
            function: () => secondaryButtonFunction(),
          }
          : ''
        ),
      }
    });
  }

  setActiveKey(val){
    this.setState({activeKey: val})
  }

  close(refresh){
    this.setActiveKey(1);
    this.setState({level:"Warning", bookmark: "", showDetail: ""});
    this.props.close(refresh);
  }

  isVisible(){
    return this.props.visible;
  }

  toggleDetail(key){
    if(this.state.showDetail===key){
      this.setState({showDetail: ""});
    } else {
      this.setState({showDetail: key});
    }
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
  }

  addNewComment() {
    this.setState({newComment: true})
  }

  updateComment(target){
    let input = target.closest(".comment--item").querySelector("input");
    if (target.firstChild.classList.contains("fa-pencil")) {
      input.disabled = false;
      input.focus();
      target.firstChild.classList.replace("fa-pencil", "fa-floppy-disk");
    } else {
      if (!input.value) {
        this.showErrorMessage("comment", "Add comment");
      }
      else {
        this.saveComment(this.state.data.SiteCode,this.state.data.Version,input.value,target);
      }
    }
  }

  addComment(target){
    let input = target.closest(".comment--item").querySelector("input");
    let comment = input.value;
    if (!comment) {
      this.showErrorMessage("comment", "Add a comment");
    }
    else {
      let body = {
        "SiteCode": this.state.data.SiteCode,
        "Version": this.state.data.Version,
        "comments": comment
      }

      this.sendRequest(ConfigData.ADD_COMMENT,"POST",body)
      .then(response => response.json())
      .then((data) => {
        if(data?.Success){
          let commentId = Math.max(...data.Data.map(e=>e.Id));
          let cmts = this.state.comments;
          cmts.push({
            Comments: comment,
            SiteCode: this.state.data.SiteCode,
            Version: this.state.data.Version,
            Id: commentId
          })
          this.setState({comments: cmts, newComment: false})
        }
      });
    }
  }

  saveComment(code,version,comment,target){
    let input = target.closest(".comment--item").querySelector("input");
    let body = {
      "Id": input.getAttribute("msg_id"),
      "SiteCode": code,
      "Version": version,
      "comments": comment
    }

    this.sendRequest(ConfigData.UPDATE_COMMENT,"PUT",body)
    .then((data) => {
      if(data?.ok){
        input.disabled = true;
        target.firstChild.classList.replace("fa-floppy-disk", "fa-pencil");
      }
    });
  }

  deleteComment(target){
    if(target) {
      let input = target.closest(".comment--item").querySelector("input");
      let id = input.getAttribute("msg_id");
      let body = id;
      this.sendRequest(ConfigData.DELETE_COMMENT,"DELETE",body)
      .then((data) => {
        if(data?.ok){
          let cmts = this.state.comments.filter(e => e.Id !== parseInt(id));
          this.setState({comments: cmts});
        }
      });
    }
    else {
      this.setState({newComment: false});
    }
  }

  addDocument() {
    this.setState({newDocument: true})
  }

  deleteDocument(target){
    if(target) {
      let doc = target.closest(".document--item");
      let id = doc.getAttribute("doc_id");
      this.sendRequest(ConfigData.DELETE_ATTACHED_FILE+"?justificationId="+id,"DELETE","")
      .then((data) => {
        if(data?.ok){
          let docs = this.state.documents.filter(e => e.Id !== parseInt(id));
          this.setState({documents: docs});
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
      this.showErrorMessage("document", "File not valid, use a valid format: .pdf, .doc, .docx, .xls, .xlsx, .txt, .tif, .json, .kml, .gml, .xml, .zip, .7z");
    }
  }

  uploadFile(data){
    let siteCode = this.state.data.SiteCode;
    let version = this.state.data.Version;
    return new Promise((resolve,reject) =>{
        const request = new XMLHttpRequest();
        request.open("POST", ConfigData.UPLOAD_ATTACHED_FILE+'?sitecode='+siteCode+'&version='+version, true);
        request.onload = (oEvent) => {
          if (request.status >= 200 && request.status < 300) {
              resolve(JSON.parse(request.response));
          } else {
              reject(request.statusText);
          }
        };
        request.send(data)
    });
  }

  handleSubmission () {
    if (this.state.selectedFile) {
      this.setState({notValidDocument:""});
      let formData = new FormData();
      formData.append("Files",this.state.selectedFile, this.state.selectedFile.name);

      return this.uploadFile(formData)
      .then(data => {
        if(data?.Success){
          let documentId = Math.max(...data.Data.map(e=>e.Id));
          let path = data.Data.find(e => e.Id === documentId).Path;
          let docs = this.state.documents;
          docs.push({
            Id: documentId,
            SiteCode: this.state.data.SiteCode,
            Version: this.state.data.Version,
            Path: path
          })
          this.setState({documents: docs, newDocument: false})
        }
        else {
          this.showErrorMessage("document", "File upload failed - "+data.Message);
        }
      });
    }
    else {
      this.showErrorMessage("document", "Add a file");
    }
}

  renderValuesTable(changes){
    let heads = Object.keys(changes[0]).filter(v=> v!=="ChangeId" && v!=="Fields");
    let fields= Object.keys(changes[0]["Fields"]);
    let titles = heads.concat(fields).map(v => {return(<CTableHeaderCell scope="col" key={v}> {v} </CTableHeaderCell>)});
    let rows=[];
    for(let i in changes){
      let values = heads.map(v=>changes[i][v]).concat(fields.map(v=>changes[i]["Fields"][v]));
      rows.push(
        <CTableRow key={i}>
          {values.map((v,j)=>{return(<CTableDataCell key={v+"_"+j}> {v} </CTableDataCell>)})}
        </CTableRow>
      )
    }
    return(
      <CTable>
        <CTableHead>
          <CTableRow>
            {titles}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {rows}
        </CTableBody>
      </CTable>
    )
  }

  renderChangeList(){
    let levels = this.state.levels;
    let list = [];
    for(let l in levels){
      let changes = this.state.data[levels[l]][this.state.bookmark];
      for(let i in changes){
        if (!Array.isArray(changes[i])) break;
        for(let j in changes[i]){
          let title = "";
          title += (title?' - ':"") + (changes[i][j].ChangeType?changes[i][j].ChangeType :"");
          title += changes[i].FieldName?' - '+ changes[i][j].FieldName:""
          list.push(
            <div key={"change_"+levels[l]+"_"+j+"_"+title} className="collapse-container">
              <div className="d-flex gap-2 align-items-center justify-content-between" key={i+"_"+j}>
                <div>
                  <span className="me-3"> {title}</span>
                </div>
                <CButton color="link" className="btn-link--dark" onClick={()=>this.toggleDetail(changes[i][j].ChangeCategory + title)}>
                  {(this.state.showDetail===changes[i][j].ChangeCategory + title) ? "Hide detail" : "View detail"}
                </CButton>
              </div>
              <CCollapse visible={this.state.showDetail===changes[i][j].ChangeCategory+title}>
                <CCard>
                  {this.state.showDetail && this.renderValuesTable(changes[i][j].ChangedCodesDetail)}
                </CCard>
              </CCollapse>
            </div>
          );
        }
      }
    }
    return (
      <>
        {list}
      </>
    )
  }

  setBookmark(val){
    this.setState({bookmark: val, bookmarkUpdate: false});
  }

  bookmarkIsEmpty(bookmark){
    let isEmpty = true;
    for(let i in bookmark){
      isEmpty = Array.isArray(bookmark[i]) ? isEmpty && (bookmark[i].length===0) : isEmpty;
    }
    return isEmpty;
  }

  renderBookmarks(){
    let bookmarks = [];
    let levels = this.state.levels;
    let list = [];
    for(let l in levels){
      for(let i in this.state.data[levels[l]]){
        if(!this.bookmarkIsEmpty(this.state.data[levels[l]][i])) {
          if(!bookmarks.includes(i)) {
            if(i == "SiteInfo")
              bookmarks = [i].concat(bookmarks);
            else
              bookmarks.push(i);
          }
        }
      }
      if((!this.state.bookmark && bookmarks.length > 0) || this.state.bookmarkUpdate) {
        const priorityBookmarks = ["SiteInfo", "Habitats", "Sites"];
        const getBookmark = (bookmarkOptions) => {
          let result = bookmarkOptions.filter(op => bookmarks.includes(op));
          if(result.length >= 1)
            return result[0];
          return bookmarks[0];
        }
        this.setBookmark(getBookmark(priorityBookmarks));
      }
    }

    return(
      <CSidebarNav className="pe-4">
        {bookmarks.includes("SiteInfo") && 
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark === "SiteInfo" ? " active" : "")} onClick={() => this.setBookmark("SiteInfo")}>
              <i className="fa-solid fa-bookmark"></i>
              Site info
            </a>
          </li>
        }
        {bookmarks.includes("Habitats") && 
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark === "Habitats" ? " active" : "")} onClick={() => this.setBookmark("Habitats")}>
              <i className="fa-solid fa-bookmark"></i>
              Habitats
            </a>
          </li>
        }
        {bookmarks.includes("Species") && 
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark === "Species" ? " active" : "")} onClick={() => this.setBookmark("Species")}>
              <i className="fa-solid fa-bookmark"></i>
              Species
            </a>
          </li>
        }
      </CSidebarNav>
    )
  }
  
  setLevel(level){
    let levels = this.state.levels;
    if(levels.includes(level)) {
      levels = levels.filter(e => e!==level);
    } else {
      levels.push(level);
    }
    this.setState({levels: levels, bookmark: "", bookmarkUpdate: true});
  }
  
  renderChanges(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CRow className="p-3">
          <CCol xs="auto">
            <CSidebarNav className="pe-5">
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_critical" onClick={(e)=>this.setLevel("Critical")} checked={this.state.levels.includes("Critical")} readOnly/>
                  <label htmlFor="modal_check_critical" className="input-label badge color--critical">Critical</label>
                </div>
              </li>
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_warning" onClick={(e)=>this.setLevel("Warning")} checked={this.state.levels.includes("Warning")} readOnly/>
                  <label htmlFor="modal_check_warning" className="input-label badge color--warning">Warning</label>
                </div>
              </li>
                <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_info" onClick={(e)=>this.setLevel("Info")} checked={this.state.levels.includes("Info")} readOnly/>
                  <label htmlFor="modal_check_info" className="input-label badge color--info">Info</label>
                </div>
              </li>
            </CSidebarNav>
          </CCol>
          <CCol>
            <div className="mb-2">
              {this.state.levels.includes("Critical") && <span className="badge badge--critical me-2">Critical</span>}
              {this.state.levels.includes("Warning") &&<span className="badge badge--warning me-2">Warning</span>}
              {this.state.levels.includes("Info") && <span className="badge badge--info me-2">Info</span>}
            </div>
            <CRow>
              <CCol xs="auto">
                {this.renderBookmarks()}
              </CCol>
              <CCol>
                {this.renderChangeList()}
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CTabPane>
    )
  }

  renderComments(){
    let cmts = [];
    cmts.push(
      this.state.newComment &&
      <div className="comment--item new" id="cmtItem_newItem">
        <div className="comment--text">
          <input type="text" placeholder="Add comment"/>
        </div>
        <div>
          <div className="btn-icon" onClick={(e) => this.addComment(e.currentTarget)}> 
            <i className="fa-solid fa-floppy-disk"></i>
          </div>
          <div className="btn-icon" onClick={() => this.deleteComment()}>
            <i className="fa-regular fa-trash-can"></i>
          </div>
        </div>
      </div>
    )
    for(let i in this.state.comments){
      cmts.push(
        this.createCommentElement(this.state.comments[i].Id,this.state.comments[i].Comments)
      )
    }
    return(
      <div id="changes_comments">
        {cmts}
      </div>
    )
  }

  createCommentElement(id,comment){
    return (
      <div className="comment--item" key={"cmtItem_"+id} id={"cmtItem_"+id}>
        <div className="comment--text" key={"cmtText_"+id}>
          <input type="text" placeholder="Add comment" defaultValue={comment} msg_id={id} disabled/>
        </div>
        <div className="comment--icons">
          <div className="btn-icon" onClick={(e) => this.updateComment(e.currentTarget)} key={"cmtUpdate_"+id}>
            <i className="fa-solid fa-pencil"></i>
          </div>
          <div className="btn-icon" onClick={(e) => this.deleteComment(e.currentTarget)} key={"cmtDelete_"+id}>
            <i className="fa-regular fa-trash-can"></i>
          </div>
        </div>
      </div>
    )
  }

  renderDocuments(){
    let docs = [];
    docs.push(
      this.state.newDocument &&
      <div className="document--item new">
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
          <div className="btn-icon">
            <i className="fa-solid fa-floppy-disk" onClick={() => this.handleSubmission()}></i>
          </div>
          <div className="btn-icon" onClick={() => this.deleteDocument()}>
            <i className="fa-regular fa-trash-can"></i>
          </div>
        </div>
      </div>
    )
    for(let i in this.state.documents){
      docs.push(
        this.createDocumentElement(this.state.documents[i].Id,this.state.documents[i].Path)
      )
    }
    return(
      <div id="changes_documents">
        {docs}
      </div>
    )
  }

  createDocumentElement(id,path){
    return (
      <div className="document--item" key={"docItem_"+id} id={"docItem_"+id} doc_id={id}>
        <div className="my-auto document--text">
          <CImage src={justificationprovided} className="ico--md me-3"></CImage>
          <span>{path.replace(/^.*[\\\/]/, '')}</span>
        </div>
        <div className="document--icons">
          <CButton color="link" className="btn-link--dark"><a href={path} target="_blank">View</a></CButton>
          <div className="btn-icon" onClick={(e) => this.deleteDocument(e.currentTarget)}>
            <i className="fa-regular fa-trash-can"></i>
          </div>
        </div>
      </div>
    )
  }

  renderAttachments(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 3}>
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
              <CButton color="link" className="btn-link--dark" onClick={() => this.addDocument()}>Add document</CButton>
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
              <CButton color="link" className="btn-link--dark" onClick={() => this.addNewComment()}>Add comment</CButton>
            </div>
            {this.renderComments()}
          </CCard>
        </CCol>
        <CCol className="d-flex">
          <div className="checkbox">
            <input type="checkbox" className="input-checkbox" id="modal_justification_req" checked={this.props.justificationRequired} />
            <label htmlFor="modal_justification_req" className="input-label">Justification required</label>
          </div>
          <div className="checkbox">
            <input type="checkbox" className="input-checkbox" id="modal_justification_prov" checked={this.props.justificationProvided}/>
            <label htmlFor="modal_justification_prov" className="input-label">Justification provided</label>
          </div>
          </CCol>
        </CRow>
      </CTabPane>
    )
  }

  renderGeometry(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
        <CRow >
          <MapViewer siteCode={this.props.item} version={this.props.version}/>
        </CRow>
      </CTabPane>
    )
  }

  renderModal() {
    let data = this.state.data;
    return(
      <>
        <CModalHeader>
          <CModalTitle>{data.SiteCode} - {data.Name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="primary" className="d-flex align-items-center" visible={this.state.showAlert}>
            <CIcon icon={cilWarning} size="md" className="me-2"/>
            Justification required
          </CAlert>
          <CNav variant="tabs" role="tablist">
          <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={this.state.activeKey === 1}
                onClick={() => this.setActiveKey(1)}
              >
                Change Information
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={this.state.activeKey === 2}
                onClick={() => this.setActiveKey(2)}
              >
                Geometry
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={this.state.activeKey === 3}
                onClick={() => this.setActiveKey(3)}
              >
                Documents & Comments
              </CNavLink>
            </CNavItem>
          </CNav>
    <CTabContent>
      {this.renderChanges()}
      {this.renderAttachments()}
      {this.renderGeometry()}
    </CTabContent>
        </CModalBody>
        <CModalFooter>
          <div className="d-flex w-100 justify-content-between">
            {(this.props.status === 'pending') && <CButton color="secondary" onClick={()=>this.props.updateModalValues("Reject Changes", "This will reject all the site changes", "Continue", ()=>this.rejectChanges(), "Cancel", ()=>{})}>Reject changes</CButton>}
            {(this.props.status === 'pending') && <CButton color="primary" onClick={()=>this.props.updateModalValues("Accept Changes", "This will accept all the site changes", "Continue", ()=>this.acceptChanges(), "Cancel", ()=>{})}>Accept changes</CButton>}
            {(this.props.status !== 'pending') && <CButton color="primary" onClick={()=>this.props.updateModalValues("Back to Pending", "This will set the changes back to Pending", "Continue", ()=>this.setBackToPending(), "Cancel", ()=>{})}>Back to Pending</CButton>}
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

  render() {
    return(
      <>
        <CModal scrollable size="xl" visible={this.isVisible()} onClose={this.close.bind(this)}>
          {this.renderData()}
        </CModal>
        <ConfirmationModal modalValues={this.state.modalValues}/>
      </>
    )
  }

  loadData(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      fetch(ConfigData.SITECHANGES_DETAIL+`siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => this.setState({data: data.Data, loading: false}));
    }
  }

  loadComments(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      fetch(ConfigData.GET_SITE_COMMENTS+`siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => this.setState({comments: data.Data}));
    }
  }

  loadDocuments(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      fetch(ConfigData.GET_ATTACHED_FILES+`siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => this.setState({documents: data.Data}));
    }
  }

  acceptChanges(){
    this.props.accept()
    .then((data) => {
      if(data?.ok)
        this.close(true);
    });
  }

  rejectChanges(){
    this.props.reject()
    .then(data => {
        if(data?.ok)
          this.close(true);
    });
  }

  setBackToPending(){
    this.props.backToPending()
    .then((data) => {
      if(data?.ok)
        this.close(true);
    });
  }

  sendRequest(url,method,body,path){
    const options = {
      method: method,
      headers: {
      'Content-Type': path? 'multipart/form-data' :'application/json',
      },
      body: path ? body : JSON.stringify(body),
    };
    console.log(options);
    return fetch(url, options)
  }
}
