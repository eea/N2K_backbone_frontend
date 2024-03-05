import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import { DataLoader } from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CButton,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CAlert,
} from '@coreui/react'

import { ConfirmationModal } from './../sitechanges/components/ConfirmationModal';
import ModalDocumentation from './ModalDocumentation';
import TableDocumentation from './TableDocumentation';

const Releases = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalItem, setModalItem] = useState({})
  const [error, setError] = useState('')

  let dl = new DataLoader()

  const openModal = (data) => {
    setModalItem(data)
    setShowModal(true)
  }

  const closeModal = () => {
    setModalItem({})
    setShowModal(false)
  }

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
              <a className="nav-link active" href="/#/releases/documentation">
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
              <a className="nav-link" href="/#/releases/siteedition">
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
                <h1 className="h1">Release Documentation</h1>
              </div>

            </div>
            <CAlert color="danger" visible={error.length > 0}>{error}</CAlert>

            <TableDocumentation
              openModal={openModal}
              showError={showError}
            />
            {showModal &&
              <ModalDocumentation
                visible={showModal}
                setVisible={setShowModal}
                item={modalItem}
                updateModalValues={updateModalValues}
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
