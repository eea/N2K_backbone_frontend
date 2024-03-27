import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import { DataLoader } from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CAlert
} from '@coreui/react'

import { ConfirmationModal } from './../sitechanges/components/ConfirmationModal';
import ModalDocumentation from './ModalDocumentation';
import TableDocumentation from './TableDocumentation';

const Releases = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalItem, setModalItem] = useState({})
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(false)

  let dl = new DataLoader()

  const openModal = (data) => {
    setModalItem(data)
    setShowModal(true)
  }

  const closeModal = () => {
    setModalItem({})
    setShowModal(false)
    forceRefreshData()
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

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="releases" />
      <div className="content--wrapper">
        <AppSidebar
          title="Releases"
          options={UtilsData.SIDEBAR["releases"]}
          active="documentation"
        />
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Release Documentation</h1>
              </div>

            </div>
            <CAlert color="danger" visible={error.length > 0}>{error}</CAlert>

            <TableDocumentation
              openModal={openModal}
              showError={showError}
              refresh = {refresh}
              setRefresh = {(v)=>{setRefresh(v)}}
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
