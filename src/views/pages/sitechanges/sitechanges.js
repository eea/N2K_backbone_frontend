import React, {useCallback, useEffect, useState, useRef} from 'react'
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
  CTabContent,
  CTabPane,
  CSpinner,
  CPopover,
  CTooltip,
  CAlert
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';
import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';

const xmlns = 'https://www.w3.org/2000/svg'

let refreshSitechanges={"pending":false,"accepted":false,"rejected":false}, 
  getRefreshSitechanges=(state)=>refreshSitechanges[state], 
  setRefreshSitechanges=(state,v)=>refreshSitechanges[state] = v;

  const defaultCountry = () => {
    const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
    const parmCountry = searchParams.get('country');
    return parmCountry ? parmCountry : ConfigData.DEFAULT_COUNTRY ? ConfigData.DEFAULT_COUNTRY : "";
  }  

const Sitechanges = () => {

  let dl = new(DataLoader);

  const [activeTab, setActiveTab] = useState(1)
  const [isTabChanged, setIsTabChanged] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(defaultCountry);
  const [level, setLevel] = useState('Critical');
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);
  const [siteCodes, setSitecodes] = useState({});
  const [searchList, setSearchList] = useState({});
  const [selectOption, setSelectOption] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [updatingData, setUpdatingData] = useState(false);
  const [completingEnvelope, setCompletingEnvelope] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const turnstoneRef = useRef();

  let setCodes = (status,data) => {
    if(data) {
      let codes = siteCodes;
      codes[status] = data;
      setSitecodes(codes);
      setSearchList(getSitesList());
      setIsLoading(false);
    }
    else if (country){
      setIsLoading(false);
    }
  }

  let getSitesList = () =>{
    return Object.keys(siteCodes).map( v=>{
        return {
          name: v,
          data: siteCodes[v].map?siteCodes[v].map(x=>({"search":x.SiteCode+" - "+x.Name,"status":v,...x})):[],
          searchType: "contains",
        }
      }
    )
  }

  let showModalSitechanges = (data) => {
    if (data) {
      setShowModal(data);
    }
    else {
      setShowModal();
    }
  }

  const showErrorMessage = (message) => {
    setErrorMessage("Something went wrong: " + message);
    setTimeout(() => {setErrorMessage('')}, ConfigData.MessageTimeout);
  }

  let selectedCodes = [],
  setSelectedCodes = (v) => {
    if(!isLoading){
      let checkAll = document.querySelector('.tab-pane.active [id^=sitechanges_check_all]');
      if(document.querySelectorAll('input[sitecode]:checked').length !== 0 && v.length === 0) {
        if(!checkAll) {
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
    }
    else
      setDisabledBtn(true);
  };

  let closeModal = () => {
    setShowModal(false);
    clearSearch();
    forceRefreshData();
    setForceRefresh(forceRefresh+1);
  }

  let forceRefreshData = ()=>{
    setIsLoading(true);
    setSitecodes({});
    setSearchList({});
    for(let i in refreshSitechanges)
      setRefreshSitechanges(i,true)
    setIsLoading(false);
    };

  let postRequest = (url,body)=>{
    const options = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return dl.fetch(url, options)
  }

  const readResponse = (data, errorMessage) => {
    let reader = data.body.getReader();
    let txt = "";
    let readData = (data) => {
      if (data.done)
        return JSON.parse(txt);
      else {
        txt += new TextDecoder().decode(data.value);
        return reader.read().then(readData);
      }
    }
    return reader.read().then(readData).then((data) => {
      if(!data.Success)
        showErrorMessage(errorMessage)
      return data;
    });
  }

  let setBackToPending = (changes, refresh)=>{
    setUpdatingData(true);
    let rBody = !Array.isArray(changes)?[changes]:changes

    return postRequest(ConfigData.MOVE_TO_PENDING, rBody)
    .then(data => {
        if(data?.ok){
          setUpdatingData(false);
          let response = readResponse(data, "Back To Pending");
          if(refresh){
            forceRefreshData();
            setForceRefresh(forceRefresh+1);
          }
          return response;
        } else showErrorMessage("Back To Pending");
    }).catch(e => {
      showErrorMessage("Back To Pending");
      console.error(e)
    });
  }

  let acceptChanges = (changes, refresh)=>{
    setUpdatingData(true);
    let rBody = !Array.isArray(changes)?[changes]:changes

    return postRequest(ConfigData.ACCEPT_CHANGES, rBody)
    .then(data => {
        if(data.ok){
          setUpdatingData(false);
          let response = readResponse(data, "Accept Changes");
          if(refresh){
            forceRefreshData();
            setForceRefresh(forceRefresh+1);
          }
          return response;
        } else showErrorMessage("Accept Changes");
    }).catch(e => {
      showErrorMessage("Accept Changes");
      console.error(e);
    });
  }

  let rejectChanges = (changes, refresh)=>{
    setUpdatingData(true);
    let rBody = !Array.isArray(changes)?[changes]:changes

    return postRequest(ConfigData.REJECT_CHANGES, rBody)
    .then(data => {
        if(data.ok){
          setUpdatingData(false);
          let response = readResponse(data, "Reject Changes");
          if(refresh){
            forceRefreshData();
            setForceRefresh(forceRefresh+1);
          }
          return response;
        } else showErrorMessage("Reject Changes");
    }).catch(e => {
      showErrorMessage("Reject Changes");
      console.error(e);
    });
  }

  let completeEnvelope = () => {
    let version = countries.find(x => x.code === country).version;
    sendRequest(ConfigData.HARVESTING_CHANGE_STATUS+"?country="+country+"&version="+version+"&toStatus=Closed","POST","")
      .then(response => response.json())
      .then(data => {
        if(data.Success) {
          setUpdatingData(false);
          setCompletingEnvelope(false);
          setCountries([]);
          setCountry();
          setSitecodes({});
          loadCountries();
          setIsLoading(true);
        }
        else {
          showErrorMessage("Complete Envelope");
          console.log("Error: " + data.Message);
        }
      })
    setUpdatingData(true);
    setCompletingEnvelope(true);
  }

  let sendRequest = (url,method,body,path)=>  {
    const options = {
      method: method,
      headers: {
      'Content-Type': path? 'multipart/form-data' :'application/json',
      },
      body: path ? body : JSON.stringify(body),
    };
    return dl.fetch(url, options)
  }

  let switchMarkChanges = (changes)=>{
    let rBody =!Array.isArray(changes)?[changes]:changes 

    return postRequest(ConfigData.MARK_AS_JUSTIFICATION_REQUIRED, rBody)
    .then(data => {
      if(data.ok){
        forceRefreshData();
      }
      else 
        showErrorMessage("Switch Mark Changes");
      return data;
    }).catch(e => {
      showErrorMessage("Switch Mark Changes");
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

  function updateModalValues(title, text, primaryButtonText, primaryButtonFunction, secondaryButtonText, secondaryButtonFunction, keepOpen) {
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
      keepOpen: keepOpen ? true : false,
    });
  }

  let clearSearch = () => {
    turnstoneRef.current?.clear();
    setDisabledSearchBtn(true);
    setSelectOption({});
  }

  let selectSearchOption = (e) => {
    if (e) {
      setDisabledSearchBtn(false);
      setSelectOption(e);
    }
    else {
      setDisabledSearchBtn(true);
    }
  }

  const item = (props) => {
    return (
      <div className="search--option">
        {/* <div><span className={"badge status--" + props.item.status}>{props.item.status}</span></div> */}
        <div>{props.item.Name}</div>
        <div className="search--suboption">{props.item.SiteCode}</div>
      </div>
    )
  }

  const group = (props) => {
    return (
      <div>
        <span className={"badge status--" + props.children}>{props.children}</span>
      </div>
    )
  }

  let changeStatus = (tabNum) => {
    setActiveTab(tabNum);
    setIsTabChanged(true);
  }

  let changeLevel = (level)=>{
    setLevel(level);
    clearSearch();
    forceRefreshData();
  }

  let changeCountry = (country)=>{
    setCountry(country)
    setSitecodes({});
    setSearchList({});
    turnstoneRef.current?.clear();
    turnstoneRef.current?.blur();
    if(country !== "") {
      forceRefreshData();
    }
  }

  let loadCountries = () => {
    dl.fetch(ConfigData.COUNTRIES_WITH_DATA)
    .then(response => response.json())
    .then(data => {
      let countriesList = [];
      for(let i in data.Data){
        countriesList.push({name:data.Data[i].Country,code:data.Data[i].Code,version:data.Data[i].Version});
      }
      countriesList.sort((a, b) => a.name.localeCompare(b.name));
      countriesList = [{name:"",code:""}, ...countriesList];
      setCountries(countriesList);
      if(country === ""){
        setCountry((countriesList.length>1)?countriesList[1]?.code:countriesList[0]?.code);
        changeCountry((countriesList.length>1)?countriesList[1]?.code:countriesList[0]?.code)
      }
      if(countriesList[0]?.code === "") {
        setIsLoading(false);
      }
    });
  }

  //Initial set for countries
  if(countries.length === 0){
    loadCountries();
  }

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
                    {!isLoading && country && activeTab === 1 &&
                      <>
                        <li>
                          <CButton color="secondary" onClick={()=>updateModalValues("Reject Changes", "This will reject all the site changes", "Continue", ()=>rejectChanges(selectedCodes, true), "Cancel", ()=>{})} disabled={updatingData || disabledBtn || activeTab!==1}>
                            Reject Changes
                          </CButton>
                        </li>
                        <li>
                          <CButton color="primary" onClick={()=>updateModalValues("Accept Changes", "This will accept all the site changes", "Continue", ()=>acceptChanges(selectedCodes, true), "Cancel", ()=>{})} disabled={updatingData || disabledBtn || activeTab!==1}>
                            Accept Changes
                          </CButton>
                        </li>
                      </>
                    }
                    {!isLoading && country && activeTab !== 1 &&
                      <li>
                        <CButton color="primary" onClick={()=>updateModalValues("Back to Pending", "This will set the changes back to Pending", "Continue", ()=>setBackToPending(selectedCodes, true), "Cancel", ()=>{})} disabled={updatingData || disabledBtn || activeTab===1}>
                          Back to Pending
                        </CButton>
                      </li>
                    }
                    {!isLoading && country &&
                      <li>
                        <CButton color="primary" onClick={()=>updateModalValues("Complete Envelopes", "This will complete the envelope", "Continue", ()=>completeEnvelope(), "Cancel", ()=>{})} disabled={updatingData}>
                          {completingEnvelope && <CSpinner size="sm"/>}
                          {completingEnvelope ? " Completing Envelope" : "Complete Envelope"}
                        </CButton>
                      </li>
                    }
                  </ul>
                </div>
              </div>
              <div>
                <CAlert color='danger' visible={errorMessage.length > 0}>{errorMessage}</CAlert>
              </div>
              <div className="d-flex flex-start align-items-center p-3 card-site-level">
                <div className="me-5"><h2 className="card-site-level-title">Site Level ONLY</h2></div>
                <div>
                  <ul className="btn--list">
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 3}>
                        <input type="checkbox" className="input-checkbox" id="site_check_critical" checked={level==="Critical"} onClick={()=>changeLevel("Critical")} readOnly/>
                        <label htmlFor="site_check_critical" className="input-label badge color--critical">Critical</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 3}>
                        <input type="checkbox" className="input-checkbox" id="site_check_warning" checked={level==="Warning"} onClick={()=>changeLevel("Warning")} readOnly/>
                        <label htmlFor="site_check_warning" className="input-label badge color--warning">Warning</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 3}>
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
                    <Turnstone
                      id="sitechanges_search"
                      className="form-control"
                      listbox = {searchList}
                      listboxIsImmutable = {false}
                      placeholder="Search sites by site name or site code"
                      noItemsMessage="Site not found"
                      styles={{input:"form-control", listbox:"search--results", groupHeading:"search--group", noItemsMessage:"search--option"}}
                      onSelect={(e)=>selectSearchOption(e)}
                      ref={turnstoneRef}
                      Item={item}
                      GroupName={group}
                      typeahead={false}
                      disabled={isLoading}
                    />
                    {Object.keys(selectOption).length !== 0 &&
                      <span className="btn-icon" onClick={()=>clearSearch()}>
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    }
                  </div>
                  <CButton disabled={disabledSearchBtn} onClick={()=>showModalSitechanges(selectOption)}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </CButton>
                  <></>
                </CCol>
                <CCol sm={12} md={6} lg={6} className="mb-4">
                  <div className="select--right">
                    <CFormLabel htmlFor="exampleFormControlInput1" className='form-label form-label-reporting col-md-4 col-form-label'>Country </CFormLabel>
                      <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={Object.keys(siteCodes).length < 3} value={country} onChange={(e)=>changeCountry(e.target.value)}>
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
                          onClick={() => {changeStatus(1);}}
                        >
                          Pending <span className="badge status--pending">{Object.keys(siteCodes).length === 3 && siteCodes.pending?.length}</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeTab === 2}
                          onClick={() => {changeStatus(2);}}
                        >
                          Accepted <span className="badge status--accepted">{Object.keys(siteCodes).length === 3 && siteCodes.accepted?.length}</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeTab === 3}
                          onClick={() => {changeStatus(3);}}
                        >
                          Rejected <span className="badge status--rejected">{Object.keys(siteCodes).length === 3 && siteCodes.rejected?.length}</span>
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
                        setBackToPending={setBackToPending}
                        mark={switchMarkChanges}
                        updateModalValues={updateModalValues}
                        setSitecodes = {setCodes}
                        setShowModal={()=>showModalSitechanges()}
                        showModal={showModal}
                        isTabChanged={isTabChanged}
                        setIsTabChanged={setIsTabChanged}
                        closeModal={closeModal}
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
                        accept={acceptChanges}
                        reject={rejectChanges}
                        setBackToPending={setBackToPending}
                        updateModalValues={updateModalValues}
                        setSitecodes = {setCodes}
                        setShowModal={()=>showModalSitechanges()}
                        showModal={showModal}
                        isTabChanged={isTabChanged}
                        setIsTabChanged={setIsTabChanged}
                        closeModal={closeModal}
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
                        accept={acceptChanges}
                        reject={rejectChanges}
                        setBackToPending={setBackToPending}
                        updateModalValues={updateModalValues}
                        setSitecodes = {setCodes}
                        setShowModal={()=>showModalSitechanges()}
                        showModal={showModal}
                        isTabChanged={isTabChanged}
                        setIsTabChanged={setIsTabChanged}
                        closeModal={closeModal}
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
