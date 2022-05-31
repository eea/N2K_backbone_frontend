import React, {useCallback, useEffect, useState} from 'react'
import { FetchData } from './FetchData';
import '@fortawesome/fontawesome-free/css/all.min.css';

import TableRSPag from './TableRSPag';
import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CHeader,
  CAvatar,
  CSidebar,
  CSidebarNav,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CTabContent,
  CTabPane
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';
import user from './../../../assets/images/avatars/user.png'

const xmlns = 'https://www.w3.org/2000/svg'

const Sitechanges = () => {

  const [activeTab, setActiveTab] = useState(1)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalValues, setModalValues] = useState({
    visibility: false,
    close: () => {
      setModalValues((prevState) => ({
        ...prevState,
        visibility: false
      }));
    }
  });

  function updateModalValues(title, text, primaryButtonText, primaryButtonFunction, secondaryButtonText, secondaryButtonFunction) {
    setModalValues({
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
    });
  }

  return (
    <>
      <div className='container--main min-vh-100'>
        <CHeader className='header--custom'>
          <CRow className='align-items-center'>
            <CCol className="header__title">
              <div>Natura Change Manager</div>
            </CCol>
            <CCol className='header__links'>
              <ul className="btn--list justify-content-between">
                <li><CButton color="link" className='btn-link--bold' href='/#/dashboard'>Dashboard</CButton></li>
                <li><CButton color="link" className='btn-link--bold' href='/#/harvesting'>Harvesting</CButton></li>
                <li className='header-active'><CButton color="link" className='btn-link--bold' href='/#/sitechanges'>Site Changes</CButton></li>
                <li><CButton color="link" className='btn-link--bold'>Site Lineage</CButton></li>
                <li><CButton color="link" className='btn-link--bold'>Reports</CButton></li>
                <li><CButton color="link" className='btn-link--bold'>Reference Dataset</CButton></li>
                <li><CAvatar src={user} /><CButton color="link" className='btn-link--bold'>Username</CButton></li>
              </ul>
            </CCol>
          </CRow>
        </CHeader>
        <CContainer fluid>
        </CContainer>
        <div className="content--wrapper">
          <CSidebar className='sidebar--light'>
            <CSidebarNav>
              <li className="nav-title">Site Changes</li>
              <li className="nav-item">
                <a className="nav-link active">
                  <i className="fa-solid fa-bookmark"></i>
                  Changes Management
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link">
                  <i className="fa-solid fa-bookmark"></i>
                  No Changes
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link">
                  <i className="fa-solid fa-bookmark"></i>
                  Changes History
                </a>
              </li>
            </CSidebarNav>
          </CSidebar>
          <div className="main-content">
            <CContainer fluid>           
              <div className='d-flex  justify-content-between px-0 p-3'>
                <div className='page-title'>
                  <h1 className="h1">Changes Management</h1>
                </div>
                <div>
                  <ul className="btn--list">
                    <li><CButton color="secondary">Reject</CButton></li>
                    <li><CButton color="primary">Approve</CButton></li>
                  </ul>
                </div>
              </div>
              <div className='d-flex flex-start align-items-center p-3 card-site-level'>
                <div className='me-5'><h2 className='card-site-level-title'>Site Level ONLY</h2></div>
                <div>
                  <ul className="btn--list">
                    <li>
                      <div className="checkbox">
                        <input type="checkbox" className="input-checkbox" id="check_info"/>
                        <label htmlFor="check_info" className="input-label badge color--info">Info</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox">
                        <input type="checkbox" className="input-checkbox" id="check_warning"/>
                        <label htmlFor="check_warning" className="input-label badge color--warning">Warning</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox">
                        <input type="checkbox" className="input-checkbox" id="check_critical"/>
                        <label htmlFor="check_critical" className="input-label badge color--critical">Critical</label>
                      </div>
                    </li>
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
      <ConfirmationModal modalValues={modalValues}/>
    </>
  )
}


export default Sitechanges
