import ConfigData from '../../../config.json';
import React, { Component } from 'react';
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
  CCard
} from '@coreui/react'

import moreicon from './../../../assets/images/three-dots.svg'
import justificationprovided from './../../../assets/images/file-text.svg'
import trash from './../../../assets/images/trash.svg'
import { AcceptReject } from './AcceptReject';

const xmlns = 'https://www.w3.org/2000/svg'

export class ModalChanges extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1, 
      loading: true, 
      data: {}, 
      level:"Warning", 
      bookmark: "",
      showDetail: ""
    };
    
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

  render_ValuesTable(changes){
    let heads = Object.keys(changes[0]).filter(v=> v!=="ChangeId" && v!=="Fields");
    let fields= Object.keys(changes[0]["Fields"]);
    let titles = heads.concat(fields).map(v => {return(<CTableHeaderCell scope="col" key={v}> {v} </CTableHeaderCell>)});
    let rows=[];
    for(let i in changes){
      let values = heads.map(v=>changes[i][v]).concat(fields.map(v=>changes[i]["Fields"][v]));
      rows.push(
        <CTableRow key={i}>
          {values.map(v=>{return(<CTableDataCell key={v}> {v} </CTableDataCell>)})}
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
    let changes = this.state.data[this.state.level][this.state.bookmark];
    let list = []
    for(let i in changes){
      if (!Array.isArray(changes[i])) break;
      for(let j in changes[i]){
        let title = "";
        title += changes[i][j].ChangeCategory?changes[i][j].ChangeCategory:"";
        title += (title?' - ':"") + (changes[i][j].ChangeType?changes[i][j].ChangeType :"");
        title += changes[i].FieldName?' - '+ changes[i][j].FieldName:""
        list.push(
            <div key={"change_"+i+"_"+j} className='collapse-container'>
              <div className="d-flex gap-2 align-items-center justify-content-between" key={i+"_"+j}>
                <div>
                  <span className='me-3'> {title}</span>
                </div>
                <CButton color="link" className='btn-link--dark ' onClick={()=>this.toggleDetail(title)}>
                  {(this.state.showDetail===changes[i][j].ChangeId)?"Hide detail":"View detail"}
                </CButton>
              </div>
              <CCollapse visible={this.state.showDetail===title}>
                <CCard>
                  {this.render_ValuesTable(changes[i][j].ChangedCodesDetail)}
                </CCard>
              </CCollapse>
            </div>);
      }
    }
    
    return (
      <CCol>
        {list}
      </CCol>
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

    for(let i in this.state.data[this.state.level]){
      if(!this.bookmarkIsEmpty(this.state.data[this.state.level][i]))
        bookmarks.push(i);
    }
    if(bookmarks.length===1){
      this.state.bookmark = bookmarks[0];
    }

    let list = [];
    for(let i in bookmarks){
      let bookmark= bookmarks[i];
      list.push(
        <li key={"bookmark_li_"+i} className="nav-item">
          <div className="checkbox" id={"bookmark_div_"+i}>
            <input type="checkbox" className="input-checkbox" id={"bookmark_check_"+i} onClick={(e)=>this.setBookmark(bookmark)} checked={this.state.bookmark===bookmark} readOnly/>
            <label id={"bookmark_label_"+i} htmlFor={"bookmark_check_"+i} className="input-label badge color--bookmark">{bookmark}</label>
          </div>
        </li>
      )
    }
    return(
      <CCol xs="auto">
        {this.state.level==="Critical"&&<span className='badge badge--critical me-2'>Critical</span>}
        {this.state.level==="Warning"&&<span className='badge badge--warning me-2'>Warning</span>}
        {this.state.level==="Info" && <span className='badge badge--info me-2'>Info</span>}
        <CSidebarNav className="pe-5">
          {list}
        </CSidebarNav>
      </CCol>
    )
  }
  
  set_level(level){
    this.setState({level: level, bookmark:""})
  }


  render_changes(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CRow className='p-3'>
          <CCol xs="auto">
            <CSidebarNav className="pe-5">
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_warning" onClick={(e)=>this.set_level("Critical")} checked={this.state.level === "Critical"} readOnly/>
                  <label htmlFor="modal_check_warning" className="input-label badge color--critical">Critical</label>
                </div>
              </li>
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_medium" onClick={(e)=>this.set_level("Warning")} checked={this.state.level === "Warning"} readOnly/>
                  <label htmlFor="modal_check_medium" className="input-label badge color--medium">Warning</label>
                </div>
              </li>
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_info" onClick={(e)=>this.set_level("Info")} checked={this.state.level === "Info"} readOnly/>
                  <label htmlFor="modal_check_info" className="input-label badge color--info">Info</label>
                </div>
              </li>
            </CSidebarNav>
          </CCol>
            {this.renderBookmarks()}
            {this.renderChangeList()}
        </CRow>
      </CTabPane>
    )
  }

  render_documents(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
      <CRow className='p-3'>
        <CCol>
          <CTable className='table--light table--noheader'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Document</CTableHeaderCell>
                <CTableHeaderCell scope="col">File</CTableHeaderCell>
                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                <CTableHeaderCell scope="col">More</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow className='align-middle'>
                <CTableDataCell colSpan={2}><h6>Attached documents</h6></CTableDataCell>
                <CTableDataCell className='text-end'><CButton color="link" className='btn-link--dark '>Add document</CButton></CTableDataCell>
              </CTableRow>
              <CTableRow className='align-middle'>
                <CTableDataCell><CImage src={justificationprovided} className="ico--md "></CImage></CTableDataCell>
                <CTableDataCell>File name</CTableDataCell>
                <CTableDataCell className='text-end'>
                  <CButton color="link" className='btn-link--dark '>View</CButton>
                  <CImage src={trash} className="ico--md "></CImage>
                    <CDropdown >
                      <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                        <CImage src={moreicon} className="ico--md "></CImage>
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Action</CDropdownItem>
                        <CDropdownItem href="#">Another action</CDropdownItem>
                        <CDropdownItem href="#">Something else here</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow className='align-middle'>
                  <CTableDataCell><CImage src={justificationprovided} className="ico--md "></CImage></CTableDataCell>
                  <CTableDataCell>File name</CTableDataCell>
                  <CTableDataCell className='text-end'>
                    <CButton color="link" className='btn-link--dark '>View</CButton>
                    <CImage src={trash} className="ico--md "></CImage>
                    <CDropdown>
                    <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                      <CImage src={moreicon} className="ico--md "></CImage>
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown></CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          {/*   pagination */}
          <CPagination aria-label="Page navigation example">
            <CPaginationItem aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            <CPaginationItem>1</CPaginationItem>
            <CPaginationItem>2</CPaginationItem>
            <CPaginationItem>3</CPaginationItem>
            <CPaginationItem aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </CCol>
        <CCol md={6} lg={6}>
        <CTable className='table--light table--noheader'>
          <CTableBody>
            <CTableRow className='align-middle'>
              <CTableDataCell colSpan={3}><h6>Comments</h6></CTableDataCell>
              <CTableDataCell className='text-end'><CButton color="link" className='btn-link--dark '>Add document</CButton></CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>        
                <ul className='comments__list'>
                  <li className='comments__item'>
                    <div className='comments__text'><del>New to upload supporting emails</del></div>
                    <CImage src={trash} className="ico--md "></CImage>
                    <CDropdown >
                      <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                        <CImage src={moreicon} className="ico--md "></CImage>
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Action</CDropdownItem>
                        <CDropdownItem href="#">Another action</CDropdownItem>
                        <CDropdownItem href="#">Something else here</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </li>

                  <li className='comments__item'>
                    <div className='comments__text'>Spatial file needed to approve change</div>
                    <CImage src={trash} className="ico--md "></CImage>
                    <CDropdown >
                      <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                        <CImage src={moreicon} className="ico--md "></CImage>
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Action</CDropdownItem>
                        <CDropdownItem href="#">Another action</CDropdownItem>
                        <CDropdownItem href="#">Something else here</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </li>
                </ul>
            {/*   pagination */}
            <CPagination aria-label="Page navigation example">
            <CPaginationItem aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            <CPaginationItem>1</CPaginationItem>
            <CPaginationItem>2</CPaginationItem>
            <CPaginationItem>3</CPaginationItem>
            <CPaginationItem aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
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
            <CButton color="secondary" onClick={()=>this.rejectChanges()}>Reject changes</CButton>
            <CButton color="primary" onClick={()=>this.acceptChanges()}>Accept changes</CButton>
          </div>
        </CModalFooter>
      </>
    )
  }

  render_data(){
    
    this.load_data()

    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.render_modal();

    return (
      <>        
        {contents}        
      </>
    )
  }

  render() {
    return(
      <CModal scrollable size="xl" visible={this.isVisible()} onClose={this.close.bind(this)}>
        {this.render_data()}        
      </CModal>
    )
  }

  load_data(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      fetch(ConfigData.SERVER_API_ENDPOINT+`/api/SiteChanges/GetSiteChangesDetail/siteCode=${this.props.item}&version=${this.props.version}`)
      .then(response => response.json())
      .then(data => this.setState({data: data.Data, loading: false}));
      //.then(data=>{console.log(data);this.setState({data: data.Data, loading: false})});
    }
  }
  
  acceptChanges(){
    AcceptReject.acceptChanges(this.props.item,this.props.version)
    .then(data => {
        if(data.ok)
          this.close(true);
        else
          alert("something went wrong!");
    }).catch(e => {
          alert("something went wrong!");
    });

  }

  rejectChanges(){
    AcceptReject.rejectChanges(this.props.item,this.props.version)
    .then(data => {
        if(data.ok)
          this.close(true);
        else
          alert("something went wrong!");
    }).catch(e => {
          alert("something went wrong!");
    });

  }
}
