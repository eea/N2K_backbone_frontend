import React, { lazy, useState } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import TableEnvelops from './TableEnvelops';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {ReactComponent as ReactLogo} from './../../../assets/images/harvesting.svg';

import {
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

const Harvesting = () => {
  return (
    <div className="container--main min-vh-100">
      <AppHeader page="harvesting"/>
      <div className="content--wrapper">
        <AppSidebar
          title="Harvesting"
          options={[
            {"path": "/#/harvesting/incoming", "name":"Incoming", "active": false},
            {"path": "/#/harvesting/ready", "name":"Ready to Use", "active": false},
            {"path": "/#/harvesting/progress", "name":"In Progress", "active": false},
            {"path": "/#/harvesting/processed", "name":"Processed", "active": true},
            {"path": "/#/harvesting/all", "name":"All", "active": false}
          ]}
        />
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Processed</h1>
              </div>
            </div>
            <div className="text-center mb-4">
              <ReactLogo className="harvesting-chart" id="processed_chart"/>
            </div>
            <CRow>
              <CCol md={12} lg={12}>
                <TableEnvelops tableType="processed" status="Discarded,Closed"/>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Harvesting
