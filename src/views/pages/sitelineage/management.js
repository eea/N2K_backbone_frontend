import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import {DataLoader} from '../../../components/DataLoader';
import { ConfirmationModal } from './components/ConfirmationModal';
import TableManagement from './TableManagement';
import Turnstone from 'turnstone';

import {
  CAlert,
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

let refreshSitechanges={"Proposed":false,"Consolidated":false}, 
  getRefreshSitechanges=(state)=>refreshSitechanges[state], 
  setRefreshSitechanges=(state,v)=>refreshSitechanges[state] = v;

const defaultCountry = () => {
  const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
  const parmCountry = searchParams.get('country');
  return parmCountry ? parmCountry : ConfigData.DEFAULT_COUNTRY ? ConfigData.DEFAULT_COUNTRY : "";
} 

const openSite = () => {
  const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
  const siteCode = searchParams.get('siteCode');
  return siteCode ?? "";
}

const changeCountryParam = (country) => {
  const base = window.location.href.split('?')[0];
  const parms = new URLSearchParams(window.location.href.split('?')[1]);
  if(country) {
    parms.set("country", country);
    location.href = base + '?' + parms.toString();
  }
  else {
    parms.delete("country");
    location.href = base;
  }
}

const cleanSiteParm = () => {
  const base = window.location.href.split('?')[0];
  const parms = new URLSearchParams(window.location.href.split('?')[1]);
  parms.delete("siteCode");
  if(parms.toString()!==""){
    location.href = base + '?' + parms.toString();
  }
}

const Sitelineage = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(defaultCountry);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [site, setSite] = useState(openSite);
  const [isLoading, setIsLoading] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [types, setTypes] = useState(['Creation', 'Deletion', 'Split', 'Merge', 'Recode']);
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);
  const [selectOption, setSelectOption] = useState({});
  const [searchList, setSearchList] = useState({});
  const [siteCodes, setSitecodes] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [changesCount, setChangesCount] = useState([]);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const turnstoneRef = useRef();
  let dl = new(DataLoader);

  let loadCountries = () => {
    setLoadingCountries(true);
    dl.fetch(ConfigData.COUNTRIES_WITH_DATA)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        let countriesList = [];
        if(data.Data.length > 0) {
          for(let i in data.Data){
            countriesList.push({name:data.Data[i].Country,code:data.Data[i].Code,version:data.Data[i].Version});
          }
          countriesList.sort((a, b) => a.name.localeCompare(b.name));
        }
        setCountries(countriesList);
        if(country === "" || !countriesList.some(a => a.code === country)) {
          changeCountry(countriesList[0]?.code);
        }
        if(countriesList[0]) {
          setIsLoading(false);
        }
      }
    });
  }

  let setCodes = (data) => {
    if(data) {
      let codes = siteCodes;
      if(data.name === "Proposed")
        codes[0] = data;
      if(data.name === "Consolidated")
        codes[1] = data;
      setSitecodes(codes);
      setSearchList([siteCodes[0], siteCodes[1]]);
      setIsLoading(false);
    }
    else if (country){
      setIsLoading(false);
    }
  }

  let changeCountry = (country) => {
    setCountry(country);
    setSitecodes({});
    setSearchList({});
    turnstoneRef.current?.clear();
    turnstoneRef.current?.blur();
    if(country !== "") {
      forceRefreshData();
      changeCountryParam(country);
    }
  }

  let changeTypes = (type, check) => {
    let values;
    if(type === "All") {
      if(check) {
        values = ["Creation", "Deletion", "Split", "Merge", "Recode"];
      }
      else {
        values = [];
      }
    }
    else {
      if(types.includes(type)) {
        values = types.filter((a) => a !== type);
      }
      else {
        values = types.concat(type);
      }
    }
    if(values.length === 0 || values.length === 5) {
      document.querySelector("#lineage_check_all").indeterminate = false;
    }
    else {
      document.querySelector("#lineage_check_all").indeterminate = true;
    }
    setTypes(values);
    clearSearch();
    forceRefreshData();
  }

  let changeStatus = (tabNum) => {
    setActiveTab(tabNum);
    // setIsTabChanged(true);
  }

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

  let showErrorMessage = (target, message)  => {
    if (target === "modal") {
      setModalError(message)
      setTimeout(() => {
        setModalError("")
      }, UtilsData.MESSAGE_TIMEOUT);
    } else if (target === "management") {
      setError(message);
      setTimeout(() => {
        setError("")
      }, UtilsData.MESSAGE_TIMEOUT);
    }
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

  let clearSearch = (focus) => {
    turnstoneRef.current?.clear();
    if(!focus) {
      turnstoneRef.current?.blur();
    }
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
        {/* <div><span className={"badge status--" + props.item.status.toLowerCase()}>{props.item.status}</span></div> */}
        <div>{props.item.Name}<span className={"badge badge--lineage "+props.item.Type.toLowerCase()+" ms-2"}>{props.item.Type}</span></div>
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

  let showModalLineagechanges = (data) => {
    if (data) {
      setShowModal(data);
    }
    else {
      setShowModal();
    }
  }

  let closeModal = () => {
    if(openSite() !== "")
      cleanSiteParm();
    setShowModal(false);
    clearSearch();
    forceRefreshData();
    setForceRefresh(forceRefresh+1);
  }

  let forceRefreshData = () => {
    setIsLoading(true);
    setSearchList({});
    setSitecodes({});
    setChangesCount([]);
    for(let i in refreshSitechanges)
      setRefreshSitechanges(i,true)
    setIsLoading(false);
    setIsLoadingCount(false);
  }

  if(countries.length === 0 && !loadingCountries){
    loadCountries();
  }

  let getChangesCount = () => {
    setIsLoadingCount(true);
    let url = ConfigData.LINEAGE_GET_CHANGES_COUNT;
    url += '?country=' + country;
    url += '&creation=' + types.includes("Creation");
    url += '&deletion=' + types.includes("Deletion");
    url += '&split=' + types.includes("Split");
    url += '&merge=' + types.includes("Merge");
    url += '&recode=' + types.includes("Recode");
    return dl.fetch(url)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        setChangesCount([data.Data.Proposed, data.Data.Consolidated])
      }
    });
  }
  
  if(country && changesCount.length === 0 && !isLoadingCount && countries.length > 0) {
    getChangesCount();
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
                  <CButton color="primary" onClick={()=>updateModalValues("Export Lineage", "This will export lineage", "Continue", ()=>exportLineage(), "Cancel", ()=>{})} disabled={isLoading}>Export</CButton>
                </div>
              </div>
              <div>
                <CAlert color="danger" visible={error.length > 0}>{error}</CAlert>
              </div>
              <div className="d-flex flex-start align-items-center p-3 card-lineage-type">
                <div className="me-5">
                  <h2 className="card-lineage-type-title">Type</h2>
                </div>
                <div>
                  <ul className="btn--list">
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 2}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_all"
                          checked={types.length === 5} onClick={(e)=>{changeTypes("All", e.currentTarget.checked)}} />
                        <label htmlFor="lineage_check_all" className="input-label badge badge--default">All
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 2}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_creation"
                          checked={types.includes("Creation")} onClick={()=>changeTypes("Creation")} />
                        <label htmlFor="lineage_check_creation" className="input-label badge badge--lineage creation">Creation
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 2}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_deletion"
                          checked={types.includes("Deletion")} onClick={()=>changeTypes("Deletion")} />
                        <label htmlFor="lineage_check_deletion" className="input-label badge badge--lineage deletion">Deletion
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 2}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_split"
                          checked={types.includes("Split")} onClick={()=>changeTypes("Split")} />
                        <label htmlFor="lineage_check_split" className="input-label badge badge--lineage split">Split
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 2}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_merge"
                          checked={types.includes("Merge")} onClick={()=>changeTypes("Merge")} />
                        <label htmlFor="lineage_check_merge" className="input-label badge badge--lineage merge">Merge
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length < 2}>
                        <input type="checkbox" className="input-checkbox" id="lineage_check_recode"
                          checked={types.includes("Recode")} onClick={()=>changeTypes("Recode")} />
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
                      disabled={Object.keys(siteCodes).length < 2}
                    />
                    {Object.keys(selectOption).length !== 0 &&
                      <span className="btn-icon" onClick={()=>clearSearch(true)}>
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    }
                  </div>
                  <CButton disabled={disabledSearchBtn} onClick={()=>showModalLineagechanges(selectOption)}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </CButton>
                  <></>
                </CCol>
                <CCol sm={12} md={6} lg={6} className="mb-4">
                  <div className="select--right">
                    <CFormLabel htmlFor="exampleFormControlInput1" className='form-label form-label-reporting col-md-4 col-form-label'>Country </CFormLabel>
                      <CFormSelect aria-label="Default select example" className='form-select-reporting'
                        disabled={Object.keys(siteCodes).length < 2} value={country} onChange={(e)=>changeCountry(e.target.value)}>
                      {
                        countries.length > 0 && countries?.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
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
                          Proposed <span className="badge status--pending">{changesCount[0]}</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeTab === 2}
                          onClick={() => {changeStatus(2);}}
                        >
                          Consolidated <span className="badge status--accepted">{changesCount[1]}</span>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent>
                    <CTabPane role="tabpanel" aria-labelledby="pending-tab" visible={activeTab === 1}>
                      <TableManagement
                        status="Proposed" 
                        country = {country}
                        typeFilter = {types}
                        getRefresh={()=>getRefreshSitechanges("Proposed")} 
                        setRefresh={setRefreshSitechanges}
                        updateModalValues={updateModalValues}
                        setShowModal={showModalLineagechanges}
                        setSitecodes={setCodes}
                        showModal={showModal}
                        errorMessage = {modalError}
                        site={site}
                        setSite={setSite}
                        closeModal={closeModal}
                      />
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="accepted-tab" visible={activeTab === 2}>
                      <TableManagement
                        status="Consolidated" 
                        country = {country}
                        typeFilter = {types}
                        getRefresh={()=>getRefreshSitechanges("Consolidated")} 
                        setRefresh={setRefreshSitechanges}
                        updateModalValues={updateModalValues}
                        setShowModal={showModalLineagechanges}
                        setSitecodes={setCodes}
                        showModal={showModal}
                        errorMessage = {modalError}
                        site={site}
                        setSite={setSite}
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
