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
  CTabPane

} from '@coreui/react'

import moreicon from './../../../assets/images/three-dots.svg'
import justificationprovided from './../../../assets/images/file-text.svg'
import trash from './../../../assets/images/trash.svg'

const xmlns = 'https://www.w3.org/2000/svg'
export class ModalChanges extends Component {
  constructor(props) {
    super(props);
    this.state = {activeKey: 1, loading: true, data: {}, levels:["Critical"]};
  }

  setActiveKey(val){
    this.setState({activeKey: val})
  }

  close(){
    this.setActiveKey(1);
    this.setState({levels:["Critical"]});
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

  render_change_list(){
    let changes = this.state.data.ChangesList.filter(v => this.state.levels.includes(v.Level));
    let list = []
    for(let i in changes){
      list.push(<div className="d-flex gap-2 align-items-center" key={changes[i].ChangeId}>
            <p className='mb-0'> {changes[i].ChangeCategory}</p>
            <p className='mb-0'> <strong>{changes[i].ChangeType}</strong></p>
            <CButton color="link" className='btn-link--dark '>View detail</CButton>
          </div>)
          
    }
    
    return (
      <>{list}</>
    )
  }

  render_changes(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
      <CRow className='p-3'>
        <CCol md={3} lg={3}>
        <CSidebarNav>          
          <li className="nav-item">
          <span className='badge color--critical' >
            <CFormCheck onClick={(e)=>this.set_level("Critical",e.target.checked)} defaultChecked/>            
              <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg>Critical
            </span>            
          </li>
          <li className="nav-item">
          <span className='badge color--medium'>
            <CFormCheck onClick={(e)=>this.set_level("Warning",e.target.checked)}/>            
            <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
              <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
            </svg>Warning
            </span>            
          </li>
          <li className="nav-item">
          <span className='badge color--info'>
          <CFormCheck onClick={(e)=>this.set_level("Info",e.target.checked)}/>
            <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
              <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
            </svg>Info
          </span>            
          </li>
        </CSidebarNav>
        </CCol>
        <CCol md={9} lg={9}>
          {this.state.levels.includes("Critical")&&<span className='badge badge--critical'>Critical</span>}
          {this.state.levels.includes("Warning")&&<span className='badge badge--warning'>Warning</span>}
          {this.state.levels.includes("Info") && <span className='badge badge--info'>Info</span>}
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
        <CCol md={6} lg={6}>             
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
                <CTableDataCell><h6>Attached documents</h6></CTableDataCell>
                <CTableDataCell></CTableDataCell>
                <CTableDataCell></CTableDataCell>
                <CTableDataCell><h6><CButton color="link" className='btn-link--dark '>Add document</CButton></h6></CTableDataCell>
              </CTableRow>
              <CTableRow className='align-middle'>
                <CTableDataCell><CImage src={justificationprovided} className="ico--md "></CImage></CTableDataCell>
                <CTableDataCell>File name</CTableDataCell>
                <CTableDataCell>
                <CButton color="link" className='btn-link--dark '>View</CButton>
                <CImage src={trash} className="ico--md "></CImage>
                </CTableDataCell>
                  <CTableDataCell>
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
                      <CTableDataCell>
                        <CButton color="link" className='btn-link--dark '>View</CButton>
                        <CImage src={trash} className="ico--md "></CImage>
                      </CTableDataCell>
                      <CTableDataCell>       
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
              <CTableDataCell><h6>Comments</h6></CTableDataCell>
              <CTableDataCell></CTableDataCell>
              <CTableDataCell></CTableDataCell>
              <CTableDataCell></CTableDataCell>
              <CTableDataCell></CTableDataCell>
              <CTableDataCell><h6><CButton color="link" className='btn-link--dark '>Add document</CButton></h6></CTableDataCell>
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
            <CButton color="secondary">Reject Changes </CButton>
            <CButton color="primary">Approve change</CButton>
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
      <CModal size="xl" visible={this.isVisible()} onClose={this.close.bind(this)}>
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

}