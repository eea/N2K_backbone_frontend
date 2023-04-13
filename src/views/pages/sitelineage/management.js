import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';
import { ConfirmationModal } from './components/ConfirmationModal';
import TableManagement from './TableManagement';
import Turnstone from 'turnstone';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CButton,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'

let refreshSitechanges={"pending":false,"accepted":false,"rejected":false}, 
  getRefreshSitechanges=(state)=>refreshSitechanges[state], 
  setRefreshSitechanges=(state,v)=>refreshSitechanges[state] = v;

const defaultCountry = () => {
  const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
  const parmCountry = searchParams.get('country');
  return parmCountry ? parmCountry : ConfigData.DEFAULT_COUNTRY ? ConfigData.DEFAULT_COUNTRY : "";
} 

const Sitelineage = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(defaultCountry);
  const [isLoading, setIsLoading] = useState(false);
  const [types, setTypes] = useState(['Creation', 'Deletion', 'Split', 'Merge', 'Recode']);
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);
  const [selectOption, setSelectOption] = useState({});
  const [siteCodes, setSitecodes] = useState({});
  const [searchList, setSearchList] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const turnstoneRef = useRef();
  let dl = new(DataLoader);

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
          data: siteCodes[v].map?siteCodes[v].map(x=>({"search":x.SiteCode+" - "+x.SiteName,"status":v,...x})):[],
          searchType: "contains",
        }
      }
    )
  }

  let loadCountries = () => {
    dl.fetch(ConfigData.COUNTRIES_WITH_DATA)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
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
      }
    });
  }

  let changeCountry = (country) => {
    setCountry(country)
    setSitecodes({});
    setSearchList({});
    turnstoneRef.current?.clear();
    turnstoneRef.current?.blur();
    if(country !== "") {
      forceRefreshData();
    }
  }

  let changeTypes = (type) => {
    let values;
    if(types.includes(type)){
      values = types.filter((a)=>a !== type);
    }
    else {
      values = types.concat(type);
    }
    setTypes(values);
    clearSearch();
    forceRefreshData();
  }

  let changeStatus = (tabNum) => {
    setActiveTab(tabNum);
    // setIsTabChanged(true);
  }

  let setBackToPending = (changes, refresh)=>{
    // setBacking(true);
    // setUpdatingData(true);
    // let rBody = !Array.isArray(changes)?[changes]:changes

    // return postRequest(ConfigData.MOVE_TO_PENDING, rBody)
    // .then(data => {
    //     if(data?.ok){
    //       setUpdatingData(false);
    //       setBacking(false);
    //       let response = readResponse(data, "Back To Pending");
    //       if(refresh){
    //         forceRefreshData();
    //         setForceRefresh(forceRefresh+1);
    //       }
    //       return response;
    //     } else showErrorMessage("Back To Pending");
    //     setBacking(false);
    // }).catch(e => {
    //   showErrorMessage("Back To Pending");
    //   console.error(e)
    // });
    if(refresh){
      forceRefreshData();
      setForceRefresh(forceRefresh+1);
    }
    return response;
  }

  let acceptChanges = (changes, refresh)=>{
    // setAccepting(true);
    // setUpdatingData(true);
    // let rBody = !Array.isArray(changes)?[changes]:changes

    // return postRequest(ConfigData.ACCEPT_CHANGES, rBody)
    // .then(data => {
    //     if(data.ok){
    //       setUpdatingData(false);
    //       setAccepting(false);
    //       let response = readResponse(data, "Accept Changes");
    //       if(refresh){
    //         forceRefreshData();
    //         setForceRefresh(forceRefresh+1);
    //       }
    //       return response;
    //     } else showErrorMessage("Accept Changes");
    //     setAccepting(false);
    // }).catch(e => {
    //   showErrorMessage("Accept Changes");
    //   console.error(e);
    // });
    if(refresh){
      forceRefreshData();
      setForceRefresh(forceRefresh+1);
    }
    return response;
  }

  let rejectChanges = (changes, refresh)=>{
    // setRejecting(true);
    // setUpdatingData(true);
    // let rBody = !Array.isArray(changes)?[changes]:changes

    // return postRequest(ConfigData.REJECT_CHANGES, rBody)
    // .then(data => {
    //     if(data.ok){
    //       setUpdatingData(false);
    //       setRejecting(false);
    //       let response = readResponse(data, "Reject Changes");
    //       if(refresh){
    //         forceRefreshData();
    //         setForceRefresh(forceRefresh+1);
    //       }
    //       return response;
    //     } else showErrorMessage("Reject Changes");
    //     setRejecting(false);
    // }).catch(e => {
    //   showErrorMessage("Reject Changes");
    //   console.error(e);
    // });
    if(refresh){
      forceRefreshData();
      setForceRefresh(forceRefresh+1);
    }
    return response;
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
        <div></div>
        <div>{props.item.SiteName}<span className={"badge badge--lineage "+props.item.Type.toLowerCase()+" ms-2"}>{props.item.Type}</span></div>
        <div className="search--suboption">{props.item.SiteCode}</div>

      </div>
    )
  }

  const group = (props) => {
    return (
      <div>
        <span className={"badge status--"+props.children.toLowerCase()}>{props.children}</span>
      </div>
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

  let closeModal = () => {
    setShowModal(false);
    clearSearch();
    forceRefreshData();
    setForceRefresh(forceRefresh+1);
  }

  let forceRefreshData = () => {
    setIsLoading(true);
    setSitecodes({});
    setSearchList({});
    for(let i in refreshSitechanges)
      setRefreshSitechanges(i,true)
    setIsLoading(false);
  }

  if(countries.length === 0){
    loadCountries();
  }

  let exportLineage = () => {

  }

  return (
    <>
      <div className="container--main min-vh-100">
        <AppHeader page="sitelineage"/>
        <div className="content--wrapper">
          <CSidebar className="sidebar--light">
            <CSidebarNav>
              <li className="nav-title">Site Lineage</li>
              <li className="nav-item">
                <a className="nav-link" href="/#/sitelineage/overview">
                  <i className="fa-solid fa-bookmark"></i>
                  Lineage Overview
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/#/sitelineage/management">
                  <i className="fa-solid fa-bookmark"></i>
                  Lineage Management
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#/sitelineage/history">
                  <i className="fa-solid fa-bookmark"></i>
                  Lineage History
                </a>
              </li>
            </CSidebarNav>
          </CSidebar>
          <div className="main-content">
            <CContainer fluid>
              <div className="d-flex justify-content-between py-3">
                <div className="page-title">
                  <h1 className="h1">Lineage Management</h1>
                </div>
                <div>
                  <CButton color="primary" onClick={()=>updateModalValues("Export Lineage", "This will export lineage", "Continue", ()=>exportLineage(), "Cancel", ()=>{})} disabled={isLoading || Object.keys(siteCodes).length < 3}>Export</CButton>
                </div>
              </div>
              <div className="d-flex flex-start align-items-center p-3 card-lineage-type">
                <div className="me-5">
                  <h2 className="card-lineage-type-title">Type</h2>
                </div>
                <div>
                  <ul className="btn--list">
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 3}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_creation" checked={types.includes("Creation")} onClick={()=>changeTypes("Creation")} readOnly/>
                        <label htmlFor="lineage_check_creation" className="input-label badge badge--lineage creation">Creation
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 3}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_deletion" checked={types.includes("Deletion")} onClick={()=>changeTypes("Deletion")} readOnly/>
                        <label htmlFor="lineage_check_deletion" className="input-label badge badge--lineage deletion">Deletion
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 3}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_split" checked={types.includes("Split")} onClick={()=>changeTypes("Split")} readOnly/>
                        <label htmlFor="lineage_check_split" className="input-label badge badge--lineage split">Split
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 3}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_merge" checked={types.includes("Merge")} onClick={()=>changeTypes("Merge")} readOnly/>
                        <label htmlFor="merge" className="input-label badge badge--lineage merge">Merge
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 3}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_recode" checked={types.includes("Recode")} onClick={()=>changeTypes("Recode")} readOnly/>
                        <label htmlFor="lineage_check_recode" className="input-label badge badge--lineage recode">Recode
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <CRow>
                <CCol sm={12} md={6} lg={6} className="d-flex mb-4">
                  <div className="search--input">
                    <Turnstone
                      id="lineage_search"
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
                      disabled={Object.keys(siteCodes).length < 3}
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
                      <TableManagement
                        status="pending" 
                        country = {country}
                        level = {"Info"}
                        getRefresh={()=>getRefreshSitechanges("pending")} 
                        setRefresh={setRefreshSitechanges}
                        accept={acceptChanges}
                        reject={rejectChanges}
                        setBackToPending={setBackToPending}
                        updateModalValues={updateModalValues}
                        setSitecodes = {setCodes}
                        setShowModal={()=>showModalSitechanges()}
                        showModal={showModal}
                        closeModal={closeModal}
                      />
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="accepted-tab" visible={activeTab === 2}>
                      <TableManagement
                        status="accepted" 
                        country = {country}
                        level = {"Info"}
                        getRefresh={()=>getRefreshSitechanges("accepted")} 
                        setRefresh={setRefreshSitechanges}
                        accept={acceptChanges}
                        reject={rejectChanges}
                        setBackToPending={setBackToPending}
                        updateModalValues={updateModalValues}
                        setSitecodes = {setCodes}
                        setShowModal={()=>showModalSitechanges()}
                        showModal={showModal}
                        closeModal={closeModal}
                    />
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="rejected-tab" visible={activeTab === 3}>
                      <TableManagement
                        status="rejected" 
                        country = {country}
                        level = {"Info"}
                        getRefresh={()=>getRefreshSitechanges("rejected")} 
                        setRefresh={setRefreshSitechanges}
                        accept={acceptChanges}
                        reject={rejectChanges}
                        setBackToPending={setBackToPending}
                        updateModalValues={updateModalValues}
                        setSitecodes = {setCodes}
                        setShowModal={()=>showModalSitechanges()}
                        showModal={showModal}
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

export default Sitelineage
