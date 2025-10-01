import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import UtilsData from '../../../data/utils.json';

import {
  CCol,
  CContainer,
  CRow,
  CAlert,
  CButton
} from '@coreui/react'

import { ConfirmationModal } from './../sitechanges/components/ConfirmationModal';
import ModalDocumentation from './ModalDocumentation';
import TableDocumentation from './TableDocumentation';

const openCountryModal = () =>{
  const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
  const country = searchParams.get('country');
  // if (country) {
  //   openModal(data.find(a => a.Code === country))
  // }
  return country ?? "";
}

const Releases = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalItem, setModalItem] = useState({})
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [showDescription, setShowDescription] = useState(false);
  const [documentationData, setDocumentationData] = useState({});

  useEffect(() => {
    if(!showDescription) {
      if(document.querySelector(".page-description")?.scrollHeight < 6*16){
        setShowDescription("all");
      }
      else {
        setShowDescription("hide");
      }
    }
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
    const country = searchParams.get('country');
    if (country && documentationData.length > 0) {
      openModal(documentationData.find(a => a.Code === country));
    }

  },[documentationData]); 

  const openModal = (data) => {
    setModalItem(data)
    setShowModal(true)
  }

  const cleanCountryParm = () => {
    const base = window.location.href.split('?')[0];
    const parms = new URLSearchParams(window.location.href.split('?')[1]);
    parms.delete("country");
    location.href = base;
  }

  const closeModal = () => {
    if(openCountryModal() !== "" ) {
      cleanCountryParm();
    }
    setModalItem({});
    setShowModal(false);
    forceRefreshData();
  }

  let forceRefreshData = () => {
    setRefresh(true);
  };

  const showError = (e) => {
    setError("Something went wrong: " + e);
    setTimeout(() => { setError('') }, UtilsData.MESSAGE_TIMEOUT);
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

  const page = UtilsData.SIDEBAR["releases"].find(a => a.option === "documentation");

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="releases" />
      <div className="content--wrapper">
        <AppSidebar
          title="Releases"
          options={UtilsData.SIDEBAR["releases"]}
          active={page.option}
        />
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">{page.name}</h1>
              </div>
            </div>
            {page.description &&
              <div className={"page-description " + showDescription}>
                {page.description}
                {showDescription !== "all" &&
                  <CButton color="link" className="btn-link--dark text-nowrap" onClick={() => setShowDescription(prevCheck => prevCheck === "show" ? "hide" : "show")}>
                    {showDescription === "show" ? "Hide description" : "Show description"}
                  </CButton>
                }
              </div>
            }
            <CAlert color="danger" visible={error.length > 0}>{error}</CAlert>
            <TableDocumentation
              openModal={openModal}
              showError={showError}
              refresh = {refresh}
              setRefresh = {(v)=>{setRefresh(v)}}
              setDocumentationData={setDocumentationData}
            />
            {showModal &&
              <ModalDocumentation
                visible={showModal}
                setVisible={setShowModal}
                item={modalItem}
                updateModalValues={updateModalValues}
                close = {closeModal}
              />
            }
          </CContainer>
        </div>
      </div>
      <ConfirmationModal modalValues={modalValues} />
    </div>
  )
}

export default Releases
