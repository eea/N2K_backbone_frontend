import React from 'react'
import { AppFooter, AppHeader } from '../../components/index'

import {
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'

const Home = (props) => {
  return (
    <div className="container--main min-vh-100">
      <AppHeader isLoggedIn={props.isLoggedIn}/>
      <div className="content--wrapper">
        <div className="main-content">
          <CContainer fluid>
            <CRow>
              <CCol md={12} lg={12}>
                <div className="page-title text-center p-3">
                  <h1 className="h1">Natura Change Manager</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <CButton color="secondary" href="/#/">
                    <i className="fa-solid fa-arrow-right-to-bracket me-2"></i>Log In
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Home
