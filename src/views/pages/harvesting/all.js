import React, { lazy, useState } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import TableEnvelops from './TableEnvelops';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {ReactComponent as ReactLogo} from './../../../assets/images/harvesting.svg';

import {
  CSidebar,
  CSidebarNav,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

const Harvesting = () => {
  return (
    <div className="container--main min-vh-100">
      <AppHeader page="harvesting"/>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Harvesting</li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/incoming">
                <i className="fa-solid fa-bookmark"></i>
                Incoming
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/ready">
                <i className="fa-solid fa-bookmark"></i>
                Ready to Use
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/progress">
                <i className="fa-solid fa-bookmark"></i>
                In Progress
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/processed">
                <i className="fa-solid fa-bookmark"></i>
                Processed
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/harvesting/all">
                <i className="fa-solid fa-bookmark"></i>
                All
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">All</h1>
              </div>
            </div>
            <div className="text-center mb-4">
              <ReactLogo className="harvesting-chart" id="all_chart"/>
            </div>
            <CRow>
              <CCol md={12} lg={12}>
                <TableEnvelops tableType="all"/>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Harvesting
