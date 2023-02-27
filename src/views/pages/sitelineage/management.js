import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav
} from '@coreui/react'

const Sitelineage = () => {

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="sitelineage"/>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Site Lineage</li>
            <li className="nav-item">
              <a className="nav-link" href="/#/sitelineage/overview">
                <i className="fa-solid fa-bookmark"></i>
                Changes Overview
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/sitelineage/management">
                <i className="fa-solid fa-bookmark"></i>
                Changes Management
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
                <h1 className="h1">Changes Management</h1>
              </div>
            </div>
            <CRow>
              <CCol>

              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Sitelineage
