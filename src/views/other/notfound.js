import React from 'react'
import { AppFooter, AppHeader } from '../../components/index'
import {ReactComponent as ReactLogo} from './../../../src/assets/images/404_image.svg';

import {
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'

const NotFound = () => {

  return (
    <div className="container--main min-vh-100">
      <AppHeader/>
      <div className="content--wrapper">
        <div className="main-content">
          <CContainer fluid>
            <CRow>
              <CCol md={12} lg={12}>
                <div className="text-center my-4">
                  <ReactLogo className="page-image"/>
                </div>
                <div className="page-title text-center">
                  <h1 className="h1">Page not found</h1>
                  <CButton color="secondary" href="/#/dashboard">Back to Home</CButton>
                </div>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default NotFound
