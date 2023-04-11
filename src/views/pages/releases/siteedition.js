import React, { lazy, useState, useRef } from 'react'
import { CAlert } from '@coreui/react';
import { AppFooter, AppHeader } from '../../../components/index'
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

const Releases = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const [siteCodes, setSitecodes] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
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
  const [pageSize, setPageSize] = useState(30);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
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

  if(countries.length === 0 && !loadingCountries){
    setLoadingCountries(true);
    dl.fetch(ConfigData.GET_CLOSED_COUNTRIES)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        let countriesList = [];
        for(let i in data.Data){
          countriesList.push({name:data.Data[i].Country,code:data.Data[i].Code});
        }
        countriesList.sort((a, b) => a.name.localeCompare(b.name));
        countriesList = [{name:"",code:""}, ...countriesList];
        setCountries(countriesList);
        if(country === ""){
          setCountry((countriesList.length>1)?countriesList[1]?.code:countriesList[0]?.code);
          changeCountry((countriesList.length>1)?countriesList[1]?.code:countriesList[0]?.code)
        }
      } else { setErrorLoading(true) }
      setLoadingCountries(false);
    });
  }

  let changeCountry = (country) => {
    setCountry(country);
    setSearchList({});
    turnstoneRef.current?.clear();
    turnstoneRef.current?.blur();
    forceRefreshData();
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

  let getSitesList = (data) => {
    return {
      name: "sites",
      data: data.map?data.map(x=>({"search":x.SiteCode+" - "+x.Name,...x})):[],
      searchType: "contains",
    }
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
    forceRefreshData();
  }

  let forceRefreshData = () => setSitecodes([]);

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
        <div>{props.item.Name}</div>
        <div className="search--suboption">{props.item.SiteCode}</div>
      </div>
    )
  }

  let loadData = () => {
    if(siteCodes.length !==0) return;
    if(country !=="" && !isLoading && siteCodes!=="nodata" && siteCodes.length === 0 && !errorLoading){
      setIsLoading(true);
      dl.fetch(ConfigData.SITEEDITION_NON_PENDING_GET+"country="+country)
      .then(response =>response.json())
      .then(data => {
        if(data?.Success) {
          if(Object.keys(data.Data).length === 0){
            setSitecodes("nodata");
          }
          else {
            setSitecodes(data.Data);
            setSearchList(getSitesList(data.Data));
            setPageCount(Math.ceil(data.Data.length / Number(pageSize)));
          }
        } else { setErrorLoading(true) }
        setIsLoading(false);
      });
    }
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

  let loadCards = () => {
    let cards = [];
    if(countries.length > 0){
      let countryName = countries.find(a=>a.code===country).name;
      let sites = siteCodes.slice(pageIndex*pageSize-pageSize,pageIndex*pageSize);
      for(let i in sites){
        let siteName = sites[i].Name;
        let siteCode = sites[i].SiteCode;
        let version = sites[i].Version;
        let date = sites[i].EditedDate;
        let user = sites[i].EditedBy;
        cards.push(
          <CCol xs={12} md={6} lg={4} xl={3} key={"card_"+i}>
            <CCard className="search-card">
              <div className="search-card-header">
                <span className="search-card-title">{siteName}</span>
              </div>
              <div className="search-card-body">
                <span className="search-card-description"><b>{siteCode}</b> | {countryName}</span>
              </div>
              <div className="search-card-button">
                <CButton color="link" className="btn-link--dark" onClick={()=>openModal({SiteCode:siteCode, Version:version})}>
                  Edit
                </CButton>
                {date && user &&
                <CTooltip 
                  content={"Edited"
                    + (date && " on " + date.slice(0,10).split('-').reverse().join('/'))
                    + (user && " by " + user)}>
                  <div className="btn-icon btn-hover btn-editinfo">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </div>
                </CTooltip>
              }
              </div>
            </CCard>
          </CCol>
        )
      }
    }
    return(
      <>
        {cards}
      </>
    )
  }

  loadData();

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
              <a className="nav-link" href="/#/releases/comparer">
                <i className="fa-solid fa-bookmark"></i>
                Release Comparer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/unionlists">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/releases/siteedition">
                <i className="fa-solid fa-bookmark"></i>
                Site Edition
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
            <CRow>
              <CCol md={12} lg={6} xl={9} className="d-flex mb-4">
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
              </CCol>
              <CCol md={12} lg={6} xl={3} className="mb-4">
                  <div className="select--right">
                    <CFormLabel className="form-label form-label-reporting col-md-4 col-form-label">Country </CFormLabel>
                    <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={isLoading} value={country} onChange={(e)=>changeCountry(e.target.value)}>
                      {
                        countries.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
                      }
                    </CFormSelect>
                  </div>
                </CCol>
            </CRow>
            <CRow className="grid">
              {(errorLoading && !isLoading) &&
                <CAlert color="danger">Error loading data</CAlert>
              }
              {(!errorLoading && isLoading) ?
                <div className="loading-container"><em>Loading...</em></div>
              : (siteCodes === "nodata" ?
                <div className="nodata-container"><em>No Data</em></div>
                : siteCodes.length > 0 &&
                  <>
                    {loadCards()}
                    <CPagination className="mt-3">
                      <CPaginationItem onClick={() => setPageIndex(1)} disabled={pageIndex===1}>
                        <i className="fa-solid fa-angles-left"></i>
                      </CPaginationItem>
                      <CPaginationItem onClick={() => setPageIndex(pageIndex-1)} disabled={pageIndex===1}>
                        <i className="fa-solid fa-angle-left"></i>
                      </CPaginationItem>
                      <span>
                        Page{' '}
                        <strong>
                          {pageIndex} of {pageCount}
                        </strong>{' '}
                      </span>
                      <CPaginationItem onClick={() => {setPageIndex(pageIndex+1);loadCards()}} disabled={pageIndex===pageCount}>
                        <i className="fa-solid fa-angle-right"></i>
                      </CPaginationItem>
                      <CPaginationItem onClick={() => setPageIndex(pageCount)} disabled={pageIndex===pageCount}>
                        <i className="fa-solid fa-angles-right"></i>
                      </CPaginationItem>

                      <div className='pagination-rows'>
                        <label className='form-label'>Rows per page</label>
                        <select
                          className='form-select'
                          value={pageSize}
                          onChange={e => {
                            setPageCount(Math.ceil(siteCodes.length / Number(e.target.value)));
                            setPageSize(Number(e.target.value));
                            setPageIndex(1);
                          }}
                        >
                          {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                              {pageSize}
                            </option>
                          ))}
                        </select>
                      </div>
                    </CPagination>
                  </>
                )
              }
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
