import React, {useCallback, useEffect, useState} from 'react'
import { FetchData } from './FetchData';

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

import user from './../../../assets/images/avatars/user.png'
import { AcceptReject } from './AcceptReject';


const xmlns = 'https://www.w3.org/2000/svg'

let refreshSitechanges={"pending":false,"accepted":false,"rejected":false}, 
    getRefreshSitechanges=(state)=>refreshSitechanges[state], 
    setRefreshSitechanges=(state,v)=>refreshSitechanges[state]=v;
const Sitechanges = () => {

  const [activeTab, setActiveTab] = useState(1)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(0);

  let selectedCodes=[], setSelectedCodes=(v)=>selectedCodes=v;

  let forceRefreshData = ()=>setForceRefresh(forceRefresh+1);

  let acceptChanges = (changes)=>{
    return AcceptReject.acceptChanges(changes)
    .then(data => {
        if(data.ok){
          setRefreshSitechanges("pending",true);
          setRefreshSitechanges("accepted",true);
          forceRefreshData();
        }else
          alert("something went wrong!");
        return data;
    }).catch(e => {
          alert("something went wrong!");
          console.log(e);
    });
  }

  let rejectChanges = (changes)=>{
    return AcceptReject.rejectChanges(changes)
    .then(data => {
        if(data.ok){
          setRefreshSitechanges("pending",true);
          setRefreshSitechanges("rejected",true);
          forceRefreshData();
        }else
          alert("something went wrong!");
        return data;
    }).catch(e => {
          alert("something went wrong!");
          console.log(e);
    });
  }

  return (
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
              <a className="nav-link active"> <svg xmlns={""+xmlns} width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg> Changes Management</a>
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
            <div className='d-flex  justify-content-between px-0 p-3'>
              <div className='page-title'>
                <h1 className="h1">Changes Management</h1>
              </div>
              <div>
                <ul className="btn--list">
                  <li><CButton color="secondary"  onClick={()=>rejectChanges(selectedCodes)}>Reject Changes</CButton></li>
                  <li><CButton color="primary" onClick={()=>acceptChanges(selectedCodes)} disabled={activeTab!==1}>Accept Changes</CButton></li>
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
                      <input type="checkbox" className="input-checkbox" id="check_medium"/>
                      <label htmlFor="check_medium" className="input-label badge color--medium">Warning</label>
                    </div>
                  </li>
                  <li>
                    <div className="checkbox">
                      <input type="checkbox" className="input-checkbox" id="check_warning"/>
                      <label htmlFor="check_warning" className="input-label badge color--critical">Critical</label>
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
                        onClick={() => {setActiveTab(1);forceRefreshData();}}
                      > Pending
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        href="javascript:void(0);"
                        active={activeTab === 2}
                        onClick={() => {setActiveTab(2);forceRefreshData();}}
                      >
                        Accepted
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        href="javascript:void(0);"
                        active={activeTab === 3}
                        onClick={() => {setActiveTab(3);forceRefreshData();}}
                      >
                        Rejected
                      </CNavLink>
                    </CNavItem>                    
                  </CNav>
                  <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="pending-tab" visible={activeTab === 1}>
                    <TableRSPag 
                      status="pending" 
                      setSelected={setSelectedCodes} 
                      forceRefresh={forceRefresh} 
                      getRefresh={()=>getRefreshSitechanges("pending")} 
                      setRefresh={setRefreshSitechanges}
                      accept={acceptChanges}
                      reject={rejectChanges}
                    />                      
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="accepted-tab" visible={activeTab === 2}>                    
                    <TableRSPag status="accepted" setSelected={setSelectedCodes} forceRefresh={forceRefresh} getRefresh={()=>getRefreshSitechanges("accepted")} setRefresh={setRefreshSitechanges}/>
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="rejected-tab" visible={activeTab === 3}>
                    <TableRSPag status="rejected" setSelected={setSelectedCodes} forceRefresh={forceRefresh} getRefresh={()=>getRefreshSitechanges("rejected")} setRefresh={setRefreshSitechanges}/>
                  </CTabPane>                    
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
