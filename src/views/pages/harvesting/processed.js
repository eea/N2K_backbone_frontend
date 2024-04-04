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

import UtilsData from '../../../data/utils.json';

const Harvesting = () => {
  return (
    <div className="container--main min-vh-100">
      <AppHeader page="harvesting"/>
      <div className="content--wrapper">
        <AppSidebar
          title="Harvesting"
          options={UtilsData.SIDEBAR["harvesting"]}
          active="processed"
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
