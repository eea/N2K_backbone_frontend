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
import moreicon from './../../../assets/images/three-dots.svg'
import justificationprovided from './../../../assets/images/file-text.svg'
import justificationrequired from './../../../assets/images/exclamation.svg'
import trash from './../../../assets/images/trash.svg'

const xmlns = 'https://www.w3.org/2000/svg'

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
      showDetail: "",
      showAlert: false,
      newComment: false,
      newDocument: false,
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

  addComment() {
    this.setState({newComment: true})
  }

  updateComment(e){
    let input = e.currentTarget.closest(".comment--item").querySelector("input");
    if (e.currentTarget.firstChild.classList.contains("fa-pencil")) {
      input.disabled = false;
      input.focus();
      e.currentTarget.firstChild.classList.replace("fa-pencil", "fa-floppy-disk");
    } else {
      input.disabled = true;
      e.currentTarget.firstChild.classList.replace("fa-floppy-disk", "fa-pencil");
      // Update comment
    }
  }

  deleteComment(e){
    // Delete comment
  }

  addDocument() {
    this.setState({newDocument: true})
  }

  deleteDocument(e){
    // Delete document
  }

  uploadFile(e) {
    document.getElementById("uploadFile").value = e.currentTarget.value;
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
                    <input id="uploadBtn" type="file" onChange={(e) => this.uploadFile(e)}/>
                    <input id="uploadFile" placeholder="No file selected" disabled="disabled" />
                  </div>
                  <div>
                    <div className="btn-icon">
                      <i className="fa-solid fa-floppy-disk"></i>
                    </div>
                    <div className="btn-icon">
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
                  <div className="btn-icon" onClick={() => this.deleteDocument()}>
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
            <CPagination aria-label="Pagination" className="pt-3">
              <CPaginationItem aria-label="Previous">
                  <i className="fa-solid fa-angle-left"></i>
              </CPaginationItem>
              <CPaginationItem>1</CPaginationItem>
              <CPaginationItem>2</CPaginationItem>
              <CPaginationItem>3</CPaginationItem>
              <CPaginationItem aria-label="Next">
                <i className="fa-solid fa-angle-right"></i>
              </CPaginationItem>
            </CPagination>
          </CCol>
          <CCol xs={12} lg={6}>
            <CCard className="comment--list">
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Comments</b>
                <CButton color="link" className="btn-link--dark" onClick={() => this.addComment()}>Add comment</CButton>
              </div>
              {this.state.newComment &&
                <div className="comment--item new">
                  <div className="comment--text">
                    <input type="text" placeholder="Add comment"/>
                  </div>
                  <div>
                    <div className="btn-icon">
                      <i className="fa-solid fa-floppy-disk"></i>
                    </div>
                    <div className="btn-icon">
                      <i className="fa-regular fa-trash-can"></i>
                    </div>
                  </div>
                </div>
              }
              <div className="comment--item">
                <div className="comment--text">
                  <input type="text" placeholder="Add comment" defaultValue="New to upload supporting emails" disabled/>
                </div>
                <div>
                  <div className="btn-icon" onClick={(e) => this.updateComment(e)}>
                    <i className="fa-solid fa-pencil"></i>
                  </div>
                  <div className="btn-icon" onClick={(e) => this.deleteComment(e)}>
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                </div>
              </div>
              <div className="comment--item">
                <div className="comment--text">
                  <input type="text" placeholder="Add comment" defaultValue="Spatial file needed to approve change" disabled/>
                </div>
                <div>
                  <div className="btn-icon" onClick={(e) => this.updateComment(e)}>
                    <i className="fa-solid fa-pencil"></i>
                  </div>
                  <div className="btn-icon" onClick={(e) => this.deleteComment(e)}>
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                </div>
              </div>
            </CCard>
            <CPagination aria-label="Pagination" className="pt-3">
              <CPaginationItem aria-label="Previous">
                <i className="fa-solid fa-angle-left"></i>
              </CPaginationItem>
              <CPaginationItem>1</CPaginationItem>
              <CPaginationItem>2</CPaginationItem>
              <CPaginationItem>3</CPaginationItem>
              <CPaginationItem aria-label="Next">
                <i className="fa-solid fa-angle-right"></i>
              </CPaginationItem>
            </CPagination>
          </CCol>
          <CCol>
            <div className="checkbox">
              <input type="checkbox" className="input-checkbox" id="modal_justification_req"/>
              <label htmlFor="modal_justification_req" className="input-label">Justification required</label>
            </div>
            <div className="checkbox">
              <input type="checkbox" className="input-checkbox" id="modal_justification_prov"/>
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
    
    this.load_data()

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
      fetch(ConfigData.SERVER_API_ENDPOINT+`/api/SiteChanges/GetSiteChangesDetail/siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => this.setState({data: data.Data, loading: false}));
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
}
