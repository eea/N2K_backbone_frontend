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

const xmlns = 'https://www.w3.org/2000/svg';

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
      comments:[],
      showDetail: "",
      showAlert: false,
      newComment: false,
      newDocument: false,
      justificationRequired: false,
      justificationProvided: false,
      selectedFile: [],
      isSelected: false,
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
      this.saveComment(this.state.data.SiteCode,this.state.data.Version,input.value,target);
    }
  }

  addComment(target){
    let comment = target.closest(".comment--item").querySelector("input").value;
    let body={
      "SiteCode": this.state.data.SiteCode,
      "Version": this.state.data.Version,
      "comments": comment
    }

    this.sendRequest(ConfigData.ADD_COMMENT,"POST",body)
    .then(response => response.json())
    .then((data) => {
      if(data?.Success){
        //If the comment was added to the DB, we create the new comment 
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

  saveComment(code,version,comment,target){
    let input = target.closest(".comment--item").querySelector("input");
    let body={
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
    let input = target.closest(".comment--item").querySelector("input");
    let body=
      input.getAttribute("msg_id");

    this.sendRequest(ConfigData.DELETE_COMMENT,"DELETE",body)
    .then((data) => {
      if(data?.ok){
        document.getElementById("cmtItem_"+input.getAttribute("msg_id")).remove();
      }
    });
  }

  addDocument() {
    this.setState({newDocument: true})
  }

  deleteAttachment(){    
    this.setState({newDocument: false})    
    this.setState({isSelected: false})
  }

  getDocuments() {
    fetch(ConfigData.GET_ATTACHED_FILES+'?sitecode=de1011404&version=1',{
      method: 'GET',
      body: "",
    }) 
    .then((response) => response.json())
    .then((result) => {
      console.log('Success', result);
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }
  
  changeHandler = (e) => {    
    this.setState({selectedFile: e.target.files[0]});
    this.setState({isSelected: true});    
  }

  handleSubmission = () =>{
    let postRequest = (url,body)=>{
      const options = {
        method: 'POST',
        headers: {        
        'Content-Type': 'multipart/form-data; boundary=AaB03x' + 
        '--AaB03x'+
        'Content-Disposition: file' +
        'Content-Type: png' +
        'Content-Transfer-Encoding: binary' +
        '...data...'+
        '--AaB03x--',
        'Accept': 'application/json',
        'type': 'formData'
        },
        body: body,
      };
      return fetch(url, options)
    }        
    
    return postRequest(ConfigData.UPLOAD_ATTACHED_FILE+'?sitecode=de1011404&version=1', this.state.selectedFile)
    .then(data => {
      if(data.ok){
        //forceRefreshData();
        console.log("Force Refresh data");
        console.log("data", data);
        console.log("data.json", data.json());
      }
      else 
        alert("something went wrong!");
      return data;
    }).catch(e => {
      alert("something went wrong!");
      console.log(e);
    });    
}

  render_ValuesTable(changes){
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
          //title += changes[i][j].ChangeCategory?changes[i][j].ChangeCategory:"";
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
                  {this.state.showDetail && this.render_ValuesTable(changes[i][j].ChangedCodesDetail)}
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
    this.setState({bookmark: val});
  }

  bookmarkIsEmpty(bookmark){
    let isEmpty = true;
    for(let i in bookmark){
      isEmpty = Array.isArray(bookmark[i])?isEmpty && (bookmark[i].length===0):isEmpty;
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
            bookmarks.push(i);
          }
        }
      }
      if(!this.state.bookmark && bookmarks.length > 0){
        for(let i in bookmarks){
          if (bookmarks[i] === "SiteInfo") {
            this.state.bookmark = bookmarks[i];
          } else {
            if(bookmarks[i] === "Habitats") {
              this.state.bookmark = bookmarks[i];
            } else {
              if(bookmarks[i] === "Sites") {
                this.state.bookmark = bookmarks[i];
              } else {
                this.state.bookmark = bookmarks[i];
              }
            }
          }
        }
      }
    }

    return(
      <CSidebarNav className="pe-4">
        {bookmarks.includes("SiteInfo") && 
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark == "SiteInfo" ? " active" : "")} onClick={() => this.setBookmark("SiteInfo")}>
              <i className="fa-solid fa-bookmark"></i>
              Site info
            </a>
          </li>
        }
        {bookmarks.includes("Habitats") && 
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark == "Habitats" ? " active" : "")} onClick={() => this.setBookmark("Habitats")}>
              <i className="fa-solid fa-bookmark"></i>
              Habitats
            </a>
          </li>
        }
        {bookmarks.includes("Species") && 
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark == "Species" ? " active" : "")} onClick={() => this.setBookmark("Species")}>
              <i className="fa-solid fa-bookmark"></i>
              Species
            </a>
          </li>
        }
      </CSidebarNav>
    )
  }
  
  set_level(level){
    let levels = this.state.levels;
    if(levels.includes(level)) {
      levels = levels.filter(e => e!==level);
    } else {
      levels.push(level);
    }
    this.setState({levels: levels, bookmark: ""});
  }
  
  render_changes(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CRow className="p-3">
          <CCol xs="auto">
            <CSidebarNav className="pe-5">
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_critical" onClick={(e)=>this.set_level("Critical")} checked={this.state.levels.includes("Critical")} readOnly/>
                  <label htmlFor="modal_check_critical" className="input-label badge color--critical">Critical</label>
                </div>
              </li>
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_warning" onClick={(e)=>this.set_level("Warning")} checked={this.state.levels.includes("Warning")} readOnly/>
                  <label htmlFor="modal_check_warning" className="input-label badge color--warning">Warning</label>
                </div>
              </li>
                <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_info" onClick={(e)=>this.set_level("Info")} checked={this.state.levels.includes("Info")} readOnly/>
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

  create_comment_element(id,comment){
    return (
      <div className="comment--item" key={"cmtItem_"+id} id={"cmtItem_"+id}>
        <div className="comment--text" key={"cmtText_"+id}>
          <input type="text" placeholder="Add comment" defaultValue={comment} msg_id={id} disabled/>
        </div>
        <div>
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

  render_comments(){
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
              <div className="btn-icon">
                <i className="fa-regular fa-trash-can"></i>
              </div>
            </div>
          </div>
    )
    for(let i in this.state.comments){
      cmts.push(
        this.create_comment_element(this.state.comments[i].Id,this.state.comments[i].Comments)
      )
    }
    
    return(
      <span id="changes_comments">
        {cmts}
      </span>
    )
  }  

 
  render_documents(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
        <CRow className="py-3">
        <CCol xs={12} lg={6}>
        <CCard className="document--list">
          <div className="d-flex justify-content-between align-items-center pb-2">
            <b>Attached documents</b>
            <CButton color="link" className="btn-link--dark" onClick={() => this.addDocument()}>Add document</CButton>                
          </div>
              {this.state.newDocument &&
                <div className="document--item new">
                  <div className="input-file">
                    <label htmlFor="uploadBtn">
                      Select file
                    </label>
                    <input id="uploadBtn" type="file" onChange={(e) => this.changeHandler(e)}/>
                    {this.state.isSelected ? (
                      <input id="uploadFile" placeholder={this.state.selectedFile.name} disabled="disabled"/>
                    ) : (<input id="uploadFile" placeholder="No file selected" disabled="disabled" />)}                    
                  </div>                  
                  <div> 
                    <div className="btn-icon">
                      <i className="fa-solid fa-floppy-disk" onClick={() => this.handleSubmission()}></i>
                    </div>
                    <div className="btn-icon" onClick={() => this.deleteAttachment()}>
                      <i className="fa-regular fa-trash-can"></i>
                    </div>
                  </div>
                </div>
              }
              <div className="document--item">
                <div className="my-auto">
                  <CImage src={justificationprovided} className="ico--md me-3"></CImage>
                  <span>File name</span>
                </div>
                <div>
                  <CButton color="link" className="btn-link--dark">View</CButton>
                  <div className="btn-icon" onClick={() => this.deleteDocument(e)}>
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                </div>
              </div>
              <div className="document--item">
                <div className="my-auto">
                  <CImage src={justificationprovided} className="ico--md me-3"></CImage>
                  <span>File name</span>
                </div>
                <div>
                  <CButton color="link" className="btn-link--dark">View</CButton>
                  <div className="btn-icon">
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                </div>
              </div>
            </CCard>            
          </CCol>   
          <CCol xs={12} lg={6}>
            <CCard className="comment--list">
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Comments</b>
                <CButton color="link" className="btn-link--dark" onClick={() => this.addNewComment()}>Add comment</CButton>
              </div>
              {this.render_comments()}              
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

  render_modal() {
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
                Documents & Comments
              </CNavLink>
            </CNavItem>
          </CNav>
    <CTabContent>
      {this.render_changes()}      
      {this.render_documents()}      
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

  render_data(){
    
    this.load_data();
    this.load_comments();

    let contents = this.state.loading
      ? <div className="loading-container"><em>Loading...</em></div>
      : this.render_modal();

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
          {this.render_data()}
        </CModal>
        <ConfirmationModal modalValues={this.state.modalValues}/>
      </>
    )
  }

  load_data(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      fetch(ConfigData.SITECHANGES_DETAIL+`siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => this.setState({data: data.Data, loading: false}));
    }
  }

  load_comments(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      fetch(ConfigData.GET_SITE_COMMENTS+`siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => this.setState({comments: data.Data}));
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

  sendRequest(url,method,body){
    const options = {
      method: method,
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return fetch(url, options)
  }
}
