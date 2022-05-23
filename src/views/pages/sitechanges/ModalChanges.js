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

const xmlns = 'https://www.w3.org/2000/svg'
export class ModalChanges extends Component {

  constructor(props) {
    super(props);
    this.state = {activeKey: 1, loading: true, data: {}, levels:["Critical","Warning","Info"], showDetail: ""};
    
  }

  setActiveKey(val){
    this.setState({activeKey: val})
  }

  close(){
    this.setActiveKey(1);
    this.setState({levels:["Critical","Warning","Info"], showDetail: ""});
    this.props.close();
  }

  isVisible(){
    return this.props.visible;
  }

  set_level(level,val){
    let levels = this.state.levels;
    if(val){
      if(!levels.includes(level)) 
        levels.push(level);
    } else {
      if(levels.includes(level)) 
        levels = levels.filter(e => e!==level);
    }
    this.setState({levels: levels})
  }

  toggleDetail(key){
    if(this.state.showDetail===key){
      this.setState({showDetail: ""});
    } else {
      this.setState({showDetail: key});
    }
  }

  render_change_list(){
    let changes = this.state.data.ChangesList.filter(v => this.state.levels.includes(v.Level));
    let list = []
    for(let i in changes){
      list.push(
          <div className='collapse-container'>
            <div className="d-flex gap-2 align-items-center justify-content-between" key={changes[i].ChangeId}>
              <div>
                <span className='me-3'> <strong>{changes[i].ChangeCategory}</strong></span>
                <span className='me-3'> {changes[i].ChangeType}</span>
              </div>
              <CButton color="link" className='btn-link--dark ' onClick={()=>this.toggleDetail(changes[i].ChangeId)}>
                {(this.state.showDetail===changes[i].ChangeId)?"Hide detail":"View detail"}
              </CButton>
            </div>
            <CCollapse visible={this.state.showDetail===changes[i].ChangeId}>
              <CCard>
                <span className='me-5'>
                  <b>Reference Value: </b>
                  {' ' + changes[i].OlValue + ' '}
                </span>
                <span>
                  <b> Reported Value: </b>
                  {' ' + changes[i].ReportedValue + ' '}
                </span>
              </CCard>
            </CCollapse>
          </div>);
          
    }
    
    return (
      <>{list}</>
    )
  }

  render_changes(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CRow className='p-3'>
          <CCol xs="auto">
            <CSidebarNav className="pe-5">
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_warning" onClick={(e)=>this.set_level("Critical",e.target.checked)} defaultChecked/>
                  <label htmlFor="modal_check_warning" className="input-label badge color--critical">Critical</label>
                </div>
              </li>
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_medium" onClick={(e)=>this.set_level("Warning",e.target.checked)} defaultChecked/>
                  <label htmlFor="modal_check_medium" className="input-label badge color--medium">Warning</label>
                </div>
              </li>
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_info" onClick={(e)=>this.set_level("Info",e.target.checked)} defaultChecked/>
                  <label htmlFor="modal_check_info" className="input-label badge color--info">Info</label>
                </div>
              </li>
            </CSidebarNav>
          </CCol>
          <CCol>
            {this.state.levels.includes("Critical")&&<span className='badge badge--critical me-2'>Critical</span>}
            {this.state.levels.includes("Warning")&&<span className='badge badge--warning me-2'>Warning</span>}
            {this.state.levels.includes("Info") && <span className='badge badge--info me-2'>Info</span>}
            {this.render_change_list()}
          </CCol>
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
            <CButton color="secondary" onClick={()=>this.reject_changes()}>Reject changes</CButton>
            <CButton color="primary" onClick={()=>this.accept_changes()}>Approve changes</CButton>
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
      fetch(ConfigData.SERVER_API_ENDPOINT+`/api/SiteChanges/GetSiteChangesDetail/siteCode=${this.props.item}&version=1`)
      .then(response => response.json())
      .then(data => this.setState({data: data.Data, loading: false}));
    }
  }

  post_request(url,body){
    const options = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    return fetch(url, options)
  }

  accept_changes(){
    if(!confirm("This will approve all the changes")) return;

    const rBody = [
      {
        "SiteCode": this.props.item,
        "VersionId": 1,
      }
    ]

    this.post_request(ConfigData.SERVER_API_ENDPOINT+'/api/SiteChanges/AcceptChanges', rBody)
    .then(data => {
        if(data.ok)
          this.close();
        else
          alert("something went wrong!");
    }).catch(e => {
          alert("something went wrong!");
    });

  }

  reject_changes(){
    if(!confirm("This will reject all the changes")) return;

    const rBody = [
      {
        "SiteCode": this.props.item,
        "VersionId": 1,
      }
    ]

    this.post_request(ConfigData.SERVER_API_ENDPOINT+'/api/SiteChanges/RejectChanges', rBody)
    .then(data => {
        if(data.ok)
          this.close();
        else
          alert("something went wrong!");
    }).catch(e => {
          alert("something went wrong!");
    });

  }

}
