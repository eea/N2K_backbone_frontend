import React, { lazy, useState, useRef } from 'react'
import { CAlert } from '@coreui/react';
import { AppFooter, AppHeader } from '../../../components/index'
import TableEdition from './TableEdition';
import ConfigData from '../../../config.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Turnstone from 'turnstone';
import {DataLoader} from '../../../components/DataLoader';

import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CCard,
  CFormLabel,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CTooltip,
} from '@coreui/react'

import { ModalEdition } from './ModalEdition';
import { ConfirmationModal } from './components/ConfirmationModal';

const defaultCountry = () => {
  const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
  const parmCountry = searchParams.get('country');
  return parmCountry ? parmCountry : ConfigData.DEFAULT_COUNTRY ? ConfigData.DEFAULT_COUNTRY : "";
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

const Releases = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const [siteCodes, setSitecodes] = useState([]);
  const [filterEdited, setFilterEdited] = useState(false);
  const [filterJustification, setFilterJustification] = useState(false);
  const [searchList, setSearchList] = useState({});
  const [selectOption, setSelectOption] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(defaultCountry);
  const [bioRegions, setBioRegions] = useState([]);
  const [siteTypes, setSiteTypes] = useState([]);
  const turnstoneRef = useRef();
  const [refresh,setRefresh] = useState(false);
  const [modalValues, setModalValues] = useState({
    visibility: false,
    close: () => {
      setModalValues((prevState) => ({
        ...prevState,
        visibility: false
      }));
    }
  });
  let dl = new(DataLoader);
  
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

  let loadCountries = () => {
    setLoadingCountries(true);
    dl.fetch(ConfigData.GET_CLOSED_COUNTRIES)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        let countriesList = [];
        if(data.Data.length > 0) {
          setLoadingCountries(false);
          for(let i in data.Data){
            countriesList.push({name:data.Data[i].Country,code:data.Data[i].Code});
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

  if(countries.length === 0 && !loadingCountries){
    loadCountries();
  }

  if(bioRegions.length === 0){
    dl.fetch(ConfigData.BIOREGIONS_GET)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        let regionsList = data.Data;
        setBioRegions(regionsList);
      }
    });
  }

  if(siteTypes.length === 0){
    dl.fetch(ConfigData.SITETYPES_GET)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        let typesList = data.Data;
        setSiteTypes(typesList);
      }
    });
  }

  let setCodes = (data) => {
    if(data) {
      setSitecodes(data);
      setSearchList(getSitesList(data));
      setIsLoading(false);
    }
    else if (country){
      setIsLoading(false);
    }
  }

  let getSitesList = (data) => {
    return {
      name: "sites",
      data: data.map?data.map(x=>({"search":x.SiteCode+" - "+x.Name,...x})):[],
      searchType: "contains",
    }
  }

  let changeFilter = (type, value) => {
    if (type === "edited") {
      setFilterEdited(value);
    }
    else if (type === "justification") {
      setFilterJustification(value);
    }
    clearSearch();
    forceRefreshData();
  }

  let showModalSitechanges = (data) => {
    if (data) {
      openModal({SiteCode:data.SiteCode, Version:data.Version})
    }
  }

  let openModal = (data) => {
    setModalVisible(true);
    setModalItem(data);
  }

  let closeModal = () => {
    setModalVisible(false);
    setModalItem({});
    clearSearch();
    forceRefreshData();
  }

  let modalProps = {
    showEditModal(data){
      showModalSitechanges(data)
    }
  }

  let forceRefreshData = () => setSitecodes([]);

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
        <div>{props.item.Name}</div>
        <div className="search--suboption">{props.item.SiteCode}</div>
      </div>
    )
  }

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
      message: false,
      keepOpen: keepOpen ? true : false,
    });
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="releases"/>
      <div className="content--wrapper">
      <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Releases</li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/management">
                <i className="fa-solid fa-bookmark"></i>
                Release Management
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/documentation">
                <i className="fa-solid fa-bookmark"></i>
                Release Documentation
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/comparer">
                <i className="fa-solid fa-bookmark"></i>
                Release Comparer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/siteeditionoverview">
                <i className="fa-solid fa-bookmark"></i>
                Site Edition Overview
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/releases/siteedition">
                <i className="fa-solid fa-bookmark"></i>
                Site Edition
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/unionlists">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Site Edition</h1>
              </div>
            </div>
            <div className="d-flex flex-start align-items-center p-3 card-lineage-type">
                <div className="me-5">
                  <h2 className="card-lineage-type-title">Filter by</h2>
                </div>
                <div>
                  <ul className="btn--list">
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length === 0}>
                        <input type="checkbox" className="input-checkbox" id="edition_check_justification" checked={filterJustification} onClick={(e)=>changeFilter("justification", e.currentTarget.checked)} />
                        <label htmlFor="edition_check_justification" className="input-label badge color--default">Justification missing</label>
                      </div>
                    </li>
                    <li>
                      <div className="checkbox" disabled={Object.keys(siteCodes).length === 0}>
                        <input type="checkbox" className="input-checkbox" id="edition_check" checked={filterEdited} onClick={(e)=>changeFilter("edited", e.currentTarget.checked)} />
                        <label htmlFor="edition_check" className="input-label badge color--default">Edited
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
                    id="siteedition_search"
                    className="form-control"
                    listbox = {searchList}
                    listboxIsImmutable = {false}
                    placeholder="Search sites by site name or site code"
                    noItemsMessage="Site not found"
                    styles={{input:"form-control", listbox:"search--results", groupHeading:"search--group", noItemsMessage:"search--option"}}
                    onSelect={(e)=>selectSearchOption(e)}
                    ref={turnstoneRef}
                    Item={item}
                    typeahead={false}
                    disabled={Object.keys(siteCodes).length === 0}
                  />
                  {Object.keys(selectOption).length !== 0 &&
                    <span className="btn-icon" onClick={()=>clearSearch(true)}>
                      <i className="fa-solid fa-xmark"></i>
                    </span>
                  }
                </div>
                <CButton disabled={disabledSearchBtn} onClick={()=>showModalSitechanges(selectOption)}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </CButton>
              </CCol>
              <CCol sm={12} md={6} lg={6} className="mb-4">
                  <div className="select--right">
                    <CFormLabel className="form-label form-label-reporting col-md-4 col-form-label">
                      Country
                    </CFormLabel>
                    <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={Object.keys(siteCodes).length === 0} value={country} onChange={(e)=>changeCountry(e.target.value)}>
                      {
                        countries.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
                      }
                    </CFormSelect>
                  </div>
                </CCol>
            </CRow>
            <CRow className="grid">
              <>
                <TableEdition
                  updateModalValues={updateModalValues}
                  modalProps={modalProps}
                  refresh = {refresh}
                  setRefresh = {(v)=>{setRefresh(v)}}
                  country={country}
                  setSitecodes={setCodes}
                  siteCodes={siteCodes}
                  onlyEdited={filterEdited}
                  onlyJustReq = {filterJustification}
                  types={siteTypes}
                />
              </>
            </CRow>
          </CContainer>
          <ModalEdition
            visible = {modalVisible}
            close = {closeModal}
            item={modalItem.SiteCode}
            version={modalItem.Version}
            updateModalValues={updateModalValues}
            regions={bioRegions}
            types={siteTypes}
          />
          <ConfirmationModal modalValues={modalValues}/>
        </div>
      </div>
    </div>
  )
}

export default Releases
