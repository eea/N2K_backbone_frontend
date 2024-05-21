import React, {useCallback, useEffect, useState, useRef} from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Turnstone from 'turnstone';

import TableNoChanges from './TableNoChanges';
import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CFormLabel,
  CFormSelect,
  CTabContent,
  CTabPane,
  CAlert
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import {DataLoader} from '../../../components/DataLoader';

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

const Sitechanges = () => {

  let dl = new(DataLoader);

  const [isLoading, setIsLoading] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [country, setCountry] = useState(defaultCountry);
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);
  const [siteCodes, setSitecodes] = useState({});
  const [searchList, setSearchList] = useState({});
  const [selectOption, setSelectOption] = useState({});
  const [modalHasChanges, setModalHasChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const turnstoneRef = useRef();

  useEffect(() => {
    if(!modalHasChanges) return;

    function handleBeforeUnload(e) {
      e.preventDefault();
      return (e.returnValue = '');
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      setModalHasChanges(false)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [modalHasChanges])

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

  let getSitesList = (data) =>{
    return {
      name: "sites",
      data: data.map?data.map(x=>({"search":x.SiteCode+" - "+x.Name,...x})):[],
      searchType: "contains",
    }
  }

  const showErrorMessage = (message) => {
    setErrorMessage("Something went wrong: " + message);
    setTimeout(() => {setErrorMessage('')}, UtilsData.MESSAGE_TIMEOUT);
  }

  let forceRefreshData = () => setSitecodes([]);

  const [modalValues, setModalValues] = useState({
    visibility: false,
    close: () => {
      setModalValues((prevState) => ({
        ...prevState,
        visibility: false
      }));
    }
  });

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

  const group = (props) => {
    return (
      <div>
        <span className={"badge status--" + props.children}>{props.children}</span>
      </div>
    )
  }

  let changeCountry = (country)=>{
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

  //Initial set for countries
  if(countries.length === 0 && !loadingCountries){
    loadCountries();
  }

  return (
    <>
      <div className="container--main min-vh-100">
        <AppHeader page="sitechanges"/>
        <div className="content--wrapper">
          <AppSidebar
            title="Site Changes"
            options={UtilsData.SIDEBAR["sitechanges"]}
            active="nochanges"
          />
          <div className="main-content">
            <CContainer fluid>
              <div className="d-flex  justify-content-between px-0 p-3">
                <div className="page-title">
                  <h1 className="h1">No Changes</h1>
                </div>
              </div>
              <div>
                <CAlert color="danger" visible={errorMessage.length > 0}>{errorMessage}</CAlert>
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
                      disabled={Object.keys(siteCodes).length === 0}
                    />
                    {Object.keys(selectOption).length !== 0 &&
                      <span className="btn-icon" onClick={()=>clearSearch(true)}>
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    }
                  </div>
                  <CButton disabled={disabledSearchBtn} onClick={()=>{window.open("/#/sdf?sitecode="+selectOption.SiteCode, "_blank"); clearSearch()}}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </CButton>
                  <></>
                </CCol>
                <CCol sm={12} md={6} lg={6} className="mb-4">
                  <div className="select--right">
                    <CFormLabel htmlFor="exampleFormControlInput1" className='form-label form-label-reporting col-md-4 col-form-label'>Country </CFormLabel>
                      <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={Object.keys(siteCodes).length === 0} value={country} onChange={(e)=>changeCountry(e.target.value)}>
                      {
                        countries.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
                      }
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={12} lg={12}>
                  <CTabContent>
                    <CTabPane role="tabpanel" aria-labelledby="pending-tab" visible={true}>
                      <TableNoChanges 
                        refresh = {refresh}
                        setRefresh = {(v)=>{setRefresh(v)}}
                        country={country}
                        setSitecodes={setCodes}
                        siteCodes={siteCodes}
                        showErrorMessage={showErrorMessage}
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
