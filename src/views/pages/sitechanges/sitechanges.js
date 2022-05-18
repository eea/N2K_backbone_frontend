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
                  <li><CFormCheck / ><span className='badge color--info'>Info</span></li>
                  <li><CFormCheck / ><span className='badge color--medium'>Warning</span></li>
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
                    <TableRSPag />                      
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="accepted-tab" visible={activeTab === 2}>                    
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="rejected-tab" visible={activeTab === 3}></CTabPane>                    
                  </CTabContent>
                </CCol>
              </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}


export default Sitechanges
