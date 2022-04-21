import React, {useCallback, useEffect, useState} from 'react'
import { FetchData } from './FetchData';
import TableRSPag from './TableRSPag';
import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNav,
  CNavItem,
  CNavLink,
  CHeader,
  CAvatar,
  CSidebar,
  CSidebarNav,
  CFormLabel,
  CFormSelect,
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

//const siteChangesDataFile = require('./../../../data/sitechangesS.json');

import moreicon from './../../../assets/images/three-dots.svg'
import justificationrequired from './../../../assets/images/exclamation.svg'
import justificationprovided from './../../../assets/images/file-text.svg'
import trash from './../../../assets/images/trash.svg'
import user from './../../../assets/images/avatars/user.png'

const xmlns = 'https://www.w3.org/2000/svg'

const Sitechanges = () => {

  const [changes, setChanges] = useState([]);
  const [visibleXL, setVisibleXL] = useState(false);
  const [activeKey, setActiveKey] = useState(1)
  const [activeTab, setActiveTab] = useState(1)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className='container--main min-vh-100'>
      <CHeader className='header--custom'>
        <CRow className='p-2 header__title'>
          <CCol>
            <div className="header__title justify-content-end">Natura Change Manager</div>
          </CCol>
          <CCol className='header__title'>
            <ul className="btn--list justify-center">
              <li><CButton color="link" className='btn-link--bold' href='/#/dashboard'>Dashboard</CButton></li>
              <li><CButton color="link" className='btn-link--bold' href='/#/harvesting'>Harvesting</CButton></li>
              <li> <CButton color="link" className='btn-link--bold' href='/#/sitechanges'>Site Changes</CButton></li>
              <li><CButton color="link" className='btn-link--bold'>Site Lineage</CButton></li>
              <li><CButton color="link" className='btn-link--bold'>Reports</CButton></li>
              <li><CButton color="link" className='btn-link--bold'>Reference Dataset</CButton></li>
              <li><CAvatar src={user} size="md" /><CButton color="link" className='btn-link--bold'>Username</CButton></li>
            </ul>
          </CCol>
        </CRow>
      </CHeader>
      <CContainer fluid>
      </CContainer>
      <div className="content--wrapper">
        <CSidebar className='sidebar--light'>
          <CSidebarNav>
            <li className="nav-title">Site changes</li>
            <li className="nav-item">
              <a className="nav-link active"> <svg xmlns={""+xmlns} width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg> Changes management</a>
            </li>
            <li className="nav-item">
              <a className="nav-link"> <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg> No Changes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link"> <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg>Changes History</a>
            </li>
          </CSidebarNav>         
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>           
            <div className='d-flex  justify-content-between p-4'>
              <div> <h1 className="h1">Change Management</h1></div>
              <div>
                <ul className="btn--list">
                  <li><CButton color="primary">Reject</CButton></li>
                  <li><CButton color="primary">Approve</CButton></li>
                </ul>
              </div>
            </div>
            <div className='d-flex flex-start p-4 card-site-level'>
              <div className='ml-4'><h2 className='card-site-leve-title'>Site Level ONLY</h2></div>
              <div>
                <ul className="btn--list">
                  <li><CFormCheck / ><span className='badge color--success'>Warning</span></li>
                  <li><CFormCheck / ><span className='badge color--warning'>Medium</span></li>
                  <li><CFormCheck /> <span className='badge color--critical'>Critical</span></li>
                </ul>
              </div>
            </div>
            <div className="select--right">    
              <CFormLabel htmlFor="exampleFormControlInput1" className='form-label form-label-reporting col-md-4 col-form-label'>Reporting date</CFormLabel>
                <CFormSelect aria-label="Default select example" className='form-select-reporting'>
                  <option></option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </CFormSelect>          
            </div>            
            <CRow>
                <CCol md={12} lg={12}>
                  {/*   tabs */}
                  <CNav variant="tabs" role="tablist">
                    <CNavItem>
                      <CNavLink
                        href="javascript:void(0);"
                        active={activeTab === 1}
                        onClick={() => setActiveTab(1)}
                      > Pending
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        href="javascript:void(0);"
                        active={activeTab === 2}
                        onClick={() => setActiveTab(2)}
                      >
                        Accepted
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        href="javascript:void(0);"
                        active={activeTab === 3}
                        onClick={() => setActiveTab(3)}
                      >
                        Rejected
                      </CNavLink>
                    </CNavItem>                    
                  </CNav>
                  <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="pending-tab" visible={activeTab === 1}>
                    <FetchData />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="accepted-tab" visible={activeTab === 2}></CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="rejected-tab" visible={activeTab === 3}></CTabPane>                  
                  </CTabContent>
                </CCol>
              </CRow>
          </CContainer>
        </div>
      </div>
      <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
        <CModalHeader>
          <CModalTitle>Site 70001 - Torbiera La Goia</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={activeKey === 1}
                onClick={() => setActiveKey(1)}
              >
                Change Information
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={activeKey === 2}
                onClick={() => setActiveKey(2)}
              >
                Documents & Comments
              </CNavLink>
            </CNavItem>
          </CNav>
    <CTabContent>
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
      <CRow className='p-3'>
        <h6>Attached Documents</h6>       
        <CCol md={3} lg={3}>
        <CSidebarNav>          
          <li className="nav-item">
          <span className='badge color--critical'>
            <CFormCheck />            
              <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg>Critical
            </span>            
          </li>
          <li className="nav-item">
          <span className='badge color--warning'>
            <CFormCheck />            
            <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
              <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
            </svg>Medium
            </span>            
          </li>
          <li className="nav-item">
          <span className='badge color--success'>
          <CFormCheck />
            <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
              <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
            </svg>Warning
          </span>            
          </li>
        </CSidebarNav>
        </CCol>
        <CCol md={9} lg={9}>
          <span className='badge badge--critical'>Critical</span>
          <div className="d-flex gap-2 align-items-center">
            <p className='mb-0'> Change of area/Geo Info</p>
            <p className='mb-0'> <strong>Area decrease</strong></p>
            <CButton color="link" className='btn-link--dark '>View detail</CButton>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <p className='mb-0'> Change of area/Geo Info</p>
            <p className='mb-0'> <strong>Habitats Area decrease</strong></p>
            <CButton color="link" className='btn-link--dark '>View detail</CButton>
          </div>
        </CCol>
      </CRow>          
      </CTabPane>
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
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
    </CTabContent>
        </CModalBody>
        <CModalFooter>
          <div className="d-flex w-100 justify-content-between">
            <CButton color="primary">Reject Changes </CButton>
            <CButton color="secondary">Approve change</CButton>
          </div>
        </CModalFooter>
      </CModal>
    </div>
  )
}


export default Sitechanges
