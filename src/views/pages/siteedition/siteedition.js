import React, { lazy, useState, useRef } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import ConfigData from '../../../config.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Turnstone from 'turnstone';

import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CFormInput,
  CCard,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'

import { ModalEdition } from './ModalEdition';

const Siteedition = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const [siteCodes, setSitecodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalValues, setModalValues] = useState({
    visibility: false,
    close: () => {
      setModalValues((prevState) => ({
        ...prevState,
        visibility: false
      }));
    }
  });
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);
  const turnstoneRef = useRef();

  let openModal = (data)=>{
    setModalVisible(true);
    setModalItem(data);
  }

  let closeModal = (refresh)=>{
    setModalVisible(false);
    setModalItem({});
    if(refresh) {
      setIsLoading(true);
      forceRefreshData();
    }
  }

  let forceRefreshData = ()=> setSitecodes([]);

  let clearSearch = () => {
    turnstoneRef.current?.clear();
    setDisabledSearchBtn(true);
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
    if(siteCodes.length === 0){
      fetch(ConfigData.SITECHANGES_GET+`country=DE&status=pending&level=Critical&page=1&limit=30`) //add correct URL
      .then(response =>response.json() )
      .then(data => {
        if(Object.keys(data.Data).length === 0){
          setSitecodes("nodata");
        }
        else {
          setSitecodes(data.Data);
          setIsLoading(false);
        }
      });
    }
  }

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

  let modalProps = {
    showAlert(text) {
      setAlertValues({
        visibility: true,
        text: text
      });
    },
    showHarvestModal(values) {
      updateModalValues("Harvest Envelopes", "This will harvest this envelope", "Continue", () => harvestHandler(values), "Cancel", () => modalProps.close);
    },
    showDiscardModal(values) {
      updateModalValues("Discard Envelopes", "This will discard this envelope", "Continue", () => discardHandler(values), "Cancel", () => modalProps.close);
    }
  }

  let loadCards = () => {
    let cards = [];
    for(let i in siteCodes){
      let siteName = siteCodes[i].SiteName;
      let siteCode = siteCodes[i].SiteCode;
      let country = siteCodes[i].Country;
      let version = siteCodes[i].Version;
      cards.push(
        <CCol xs={12} md={6} lg={4} xl={3} key={"card_"+i}>
          <CCard className="search-card">
            <div className="search-card-header">
              <span className="search-card-title">{siteName}</span>
            </div>
            <div className="search-card-body">
              <span className="search-card-description"><b>{siteCode}</b> | {country}</span>
            </div>
            <div className="search-card-button">
              <CButton color="link" className="btn-link--dark" onClick={()=>openModal({SiteCode:siteCode, Version:version})}>
                Edit
              </CButton>
            </div>
          </CCard>
        </CCol>
      )
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
      <AppHeader page="siteedition"/>
      <div className="content--wrapper">
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
                    //listbox = {searchList}
                    placeholder="Search sites by site name or site code"
                    noItemsMessage="Site not found"
                    styles={{input:"form-control", listbox:"search--results", groupHeading:"search--group", noItemsMessage:"search--option"}}
                    onSelect={(e)=>selectSearchOption(e)}
                    ref={turnstoneRef}
                    Item={item}
                    typeahead={false}
                  />
                  <span className="btn-icon" onClick={()=>clearSearch()}>
                    <i className="fa-solid fa-xmark"></i>
                  </span>
                </div>
                <CButton disabled={disabledSearchBtn}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </CButton>
              </CCol>
              <CCol className="mb-4">
                <div className="select--right">
                    <CFormLabel htmlFor="siteedition_input" className="form-label form-label-reporting col-md-4 col-form-label">Order by </CFormLabel>
                      <CFormSelect id="siteedition_input" aria-label="Order by" className="form-select-reporting" value="" onChange={(e)=>changeCountry(e.target.value)}>
                        <option value="opt_siteCode">Site name</option>
                        <option value="opt_siteName">Site code</option>
                        <option value="opt_date">Reported date</option>
                    </CFormSelect>
                </div>
              </CCol>
            </CRow>
            <CRow className="grid">
              {isLoading ?
                <div className="loading-container"><em>Loading...</em></div>
              : (siteCodes === "nodata" ?
                <div className="nodata-container"><em>No Data</em></div>
                : loadCards()
                )
              }
              <ModalEdition
                visible = {modalVisible}
                close = {closeModal}
                accept={()=>acceptChanges(modalItem)}
                reject={()=>rejectChanges(modalItem)}
                item={modalItem.SiteCode}
                version={modalItem.Version}
                updateModalValues = {() => updateModalValues()}
              />
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Siteedition
