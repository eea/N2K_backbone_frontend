import React, {useCallback, useEffect, useState} from 'react'
import { AppFooter, AppHeader } from './../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Turnstone from 'turnstone';

import TableRSPag from './TableRSPag';
import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CSidebar,
  CSidebarNav,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CTabContent,
  CTabPane,
  CFormInput
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';
import ConfigData from '../../../config.json';

const xmlns = 'https://www.w3.org/2000/svg'

let refreshSitechanges={"pending":false,"accepted":false,"rejected":false}, 
  getRefreshSitechanges=(state)=>refreshSitechanges[state], 
  setRefreshSitechanges=(state,v)=>refreshSitechanges[state] = v;

const Sitechanges = () => {
  const [activeTab, setActiveTab] = useState(1)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("DE");
  const [level, setLevel] = useState('Critical');
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);

  const searchList = ['pen','pineapple','apple-pen'];

  let selectedCodes = [],
  setSelectedCodes = (v) => {
    let checkAll = document.querySelector('.tab-pane.active [id^=sitechanges_check_all]');
    if(document.querySelectorAll('input[sitecode]:checked').length !== 0 && v.length === 0) {
      if(!checkAll.indeterminate && !checkAll.checked) {
        setDisabledBtn(true);
      }
      return;
    }
    selectedCodes = v;
    if (selectedCodes.length === 0) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  };

  let forceRefreshData = ()=>{for(let i in refreshSitechanges) setRefreshSitechanges(i,true)};

  let postRequest = (url,body)=>{
    const options = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return fetch(url, options)
  }

  let setBackToPending = (changes)=>{
    let rBody = !Array.isArray(changes)?[changes]:changes

    return postRequest(ConfigData.MOVE_TO_PENDING, rBody)
    .then(data => {
        if(data.ok){
          forceRefreshData();
          setForceRefresh(forceRefresh+1);
        }else
          alert("something went wrong!");
        return data;
    }).catch(e => {
      alert("something went wrong!");
      console.log(e);
    });
  }

  let acceptChanges = (changes)=>{
    let rBody = !Array.isArray(changes)?[changes]:changes

    return postRequest(ConfigData.ACCEPT_CHANGES, rBody)
    .then(data => {
        if(data.ok){
          setRefreshSitechanges("pending",true);
          setRefreshSitechanges("accepted",true);
          //forceRefreshData();
          setForceRefresh(forceRefresh+1);
        }else
          alert("something went wrong!");
        return data;
    }).catch(e => {
      alert("something went wrong!");
      console.log(e);
    });
  }

  let rejectChanges = (changes)=>{
    let rBody = !Array.isArray(changes)?[changes]:changes

    return postRequest(ConfigData.REJECT_CHANGES, rBody)
    .then(data => {
        if(data.ok){
          setRefreshSitechanges("pending",true);
          setRefreshSitechanges("rejected",true);
          //forceRefreshData();
          setForceRefresh(forceRefresh+1);
        }else
          alert("something went wrong!");
        return data;
    }).catch(e => {
      alert("something went wrong!");
      console.log(e);
    });
  }

  let switchMarkChanges = (changes)=>{
    let rBody =!Array.isArray(changes)?[changes]:changes 

    return postRequest(ConfigData.MARK_AS_JUSTIFICATION_REQUIRED, rBody)
    .then(data => {
      if(data.ok){
        forceRefreshData();        
      }
      else 
        alert("something went wrong!");
      return data;
    }).catch(e => {
      alert("something went wrong!");
      console.log(e);
    });

  }

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

  let showSearch = () => {
    document.querySelector(".search--results").classList.remove("d-none");
  }

  let hideSearch = () => {
    document.querySelector(".search--results").classList.add("d-none");
  }

  let clearSearch = () => {
    document.getElementById("sitechanges_search").value = "";
    setDisabledSearchBtn(true);
  }

  let selectSearchOption = (e) => {
    let value = e.currentTarget.children[1].innerText + " - " + e.currentTarget.children[0].innerText;
    document.getElementById("sitechanges_search").value = value;
    e.currentTarget.parentElement.classList.add("d-none");
    setDisabledSearchBtn(false);
  }

  let changeLevel = (level)=>{
    setLevel(level);
    forceRefreshData();
  }

  let changeCountry = (country)=>{
    setCountry(country)
    forceRefreshData();
  }

  //Initial set for countries
  if(countries.length === 0){
    fetch(ConfigData.COUNTRIES_WITH_DATA)
    .then(response => response.json())
    .then(data => {
      let countriesList = [];
      for(let i in data.Data){
        countriesList.push({name:data.Data[i].Country,code:data.Data[i].Code});
      }
      setCountries(countriesList);
    });      
  }
  console.log(searchList);

  const listbox = [
    {
      name: "Items",
      data: searchList,
      searchType: "startswith"
    }
  ];

  return (
    <>
      <div className="container--main min-vh-100">
        <AppHeader page="sitechanges"/>
        <div className="content--wrapper">
          <CSidebar className="sidebar--light">
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
              <div className="d-flex  justify-content-between px-0 p-3">
                <div className="page-title">
                  <h1 className="h1">Changes Management</h1>
                </div>
                <div>
                  <ul className="btn--list">
                    {activeTab===1 && <li><CButton color="secondary"  onClick={()=>updateModalValues("Reject Changes", "This will reject all the site changes", "Continue", ()=>rejectChanges(selectedCodes), "Cancel", ()=>{})} disabled={disabledBtn || activeTab!==1}>Reject changes</CButton></li>}
                    {activeTab===1 && <li><CButton color="primary" onClick={()=>updateModalValues("Accept Changes", "This will accept all the site changes", "Continue", ()=>acceptChanges(selectedCodes), "Cancel", ()=>{})} disabled={disabledBtn || activeTab!==1}>Accept changes</CButton></li>}
                    {activeTab!==1 && <li><CButton color="primary" onClick={()=>updateModalValues("Back to Pending", "This will set the changes back to Pending", "Continue", ()=>setBackToPending(selectedCodes), "Cancel", ()=>{})} disabled={disabledBtn || activeTab===1}>Back to Pending</CButton></li>}
                  </ul>
                </div>
              </div>
              <div className="d-flex flex-start align-items-center p-3 card-site-level">
                <div className="me-5"><h2 className="card-site-level-title">Site Level ONLY</h2></div>
                <div>
                  <ul className="btn--list">
                    <li>
                      <div className="checkbox">
                        <input type="checkbox" className="input-checkbox" id="site_check_critical" checked={level==="Critical"} onClick={()=>changeLevel("Critical")} readOnly/>
                        <label htmlFor="site_check_critical" className="input-label badge color--critical">Critical</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox">
                        <input type="checkbox" className="input-checkbox" id="site_check_warning" checked={level==="Warning"} onClick={()=>changeLevel("Warning")} readOnly/>
                        <label htmlFor="site_check_warning" className="input-label badge color--warning">Warning</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox">
                        <input type="checkbox" className="input-checkbox" id="site_check_info" checked={level==="Info"} onClick={()=>changeLevel("Info")} readOnly/>
                        <label htmlFor="site_check_info" className="input-label badge color--info">Info</label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <CRow>
                <CCol sm={12} md={6} lg={6} className="d-flex mb-4">
                  <div className="search--input">
                    {/*<CFormInput
                      id="sitechanges_search"
                      placeholder="Search sites by site name or site code"
                      autoComplete="off"
                      onClick={()=>showSearch()}
                      onBlur={()=>hideSearch()}
                    />*/}
                    <Turnstone
                      id="sitechanges_search"
                      listbox = {listbox}
                      placeholder="Search sites by site name or site code"
                      onClick={()=>showSearch()}
                      onBlur={()=>hideSearch()}
                    />
                    <span className="btn-icon" onClick={()=>clearSearch()}>
                      <i className="fa-solid fa-xmark"></i>
                    </span>
                    <div className="search--results d-none">
                      <div className="search--option" onMouseDown={(e)=>selectSearchOption(e)}>
                        <div>SPA Östliche Deutsche Bucht</div>
                        <div className="search--suboption">DE1011401</div>
                      </div>
                      <div className="search--option" onMouseDown={(e)=>selectSearchOption(e)}>
                        <div>NSG Rantumbecken</div>
                        <div className="search--suboption">DE1115301</div>
                      </div>
                      {/* <div className="search--option">Results not found</div> */}
                    </div>
                  </div>
                  <CButton disabled={disabledSearchBtn}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </CButton>
                  <></>
                </CCol>
                <CCol sm={12} md={6} lg={6} className="mb-4">
                  <div className="select--right">
                    <CFormLabel htmlFor="exampleFormControlInput1" className='form-label form-label-reporting col-md-4 col-form-label'>Country </CFormLabel>
                      <CFormSelect aria-label="Default select example" className='form-select-reporting' value={country} onChange={(e)=>changeCountry(e.target.value)}>
                      {
                        countries.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
                      }
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                  <CCol md={12} lg={12}>
                    {/*   tabs */}
                    <CNav variant="tabs" role="tablist">
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeTab === 1}
                          onClick={() => {setActiveTab(1);}}
                        > Pending
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeTab === 2}
                          onClick={(e) => {setActiveTab(2);}}
                        >
                          Accepted
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeTab === 3}
                          onClick={() => {setActiveTab(3);}}
                        >
                          Rejected
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent>
                    <CTabPane role="tabpanel" aria-labelledby="pending-tab" visible={activeTab === 1}>
                      <TableRSPag 
                        status="pending" 
                        country = {country}
                        level = {level}
                        setSelected={setSelectedCodes} 
                        getRefresh={()=>getRefreshSitechanges("pending")} 
                        setRefresh={setRefreshSitechanges}
                        accept={acceptChanges}
                        reject={rejectChanges}
                        mark={switchMarkChanges}
                        updateModalValues={updateModalValues}
                      />
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="accepted-tab" visible={activeTab === 2}>                    
                      <TableRSPag 
                        status="accepted" 
                        country = {country}
                        level = {level}
                        setSelected={setSelectedCodes} 
                        getRefresh={()=>getRefreshSitechanges("accepted")} 
                        setRefresh={setRefreshSitechanges}
                        setBackToPending={setBackToPending}
                        updateModalValues={updateModalValues}
                      />
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="rejected-tab" visible={activeTab === 3}>
                      <TableRSPag 
                        status="rejected" 
                        country = {country}
                        level = {level}
                        setSelected={setSelectedCodes} 
                        getRefresh={()=>getRefreshSitechanges("rejected")} 
                        setRefresh={setRefreshSitechanges}
                        setBackToPending={setBackToPending}
                        updateModalValues={updateModalValues}
                      />
                    </CTabPane>                    
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
