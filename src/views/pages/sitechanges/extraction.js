import React, { useEffect, useState, useRef} from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CFormLabel,
  CFormSelect,
  CSpinner,
  CAlert
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import {DataLoader} from '../../../components/DataLoader';

const Sitechanges = () => {

  let dl = new(DataLoader);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showErrorMessage = (message) => {
    setErrorMessage("Something went wrong: " + message);
    setTimeout(() => {setErrorMessage('')}, UtilsData.MESSAGE_TIMEOUT);
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

  let changeCountry = (country) => {
    if(country) {
      setCountry(country);
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
            countriesList.push({name:data.Data[i].Country, code:data.Data[i].Code});
          }
          countriesList.sort((a, b) => a.name.localeCompare(b.name));
          countriesList.unshift({name:"All", code:countriesList.map(a => a.code).toString()});
        }
        setCountries(countriesList);
      }
    });
  }

  const downloadExtraction = (country) => {
    setIsDownloading(true);
    dl.fetch(ConfigData.EXTRACTION_DOWNLOAD+"?country="+country)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        window.location = data.Data;
      } else {
        showErrorMessage(data.Message);
      }
      setIsDownloading(false);
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
            active="extraction"
          />
          <div className="main-content">
            <CContainer fluid>
              <div className="d-flex  justify-content-between px-0 p-3">
                <div className="page-title">
                  <h1 className="h1">Changes Extraction</h1>
                </div>
              </div>
              <div>
                <CAlert color="danger" visible={errorMessage.length > 0}>{errorMessage}</CAlert>
              </div>
              <CRow>
                <CCol className="mb-4">
                  <div className="select--left">
                    <CFormLabel htmlFor="exampleFormControlInput1" className='form-label form-label-reporting col-md-4 col-form-label w-auto'>Country </CFormLabel>
                    <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={countries.length === 0 && loadingCountries} defaultValue="default" onChange={(e)=>changeCountry(e.target.value)}>
                      <option disabled value="default" hidden>Select a Country</option>
                      {
                        countries.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
                      }
                    </CFormSelect>
                    <CButton className="ms-3" color="primary" disabled={!country || isDownloading} onClick={()=>downloadExtraction(country)}>
                      {isDownloading && <CSpinner size="sm"/>}
                      {isDownloading ? " Downloading Extraction" : "Download Extraction"}
                    </CButton>
                  </div>
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
