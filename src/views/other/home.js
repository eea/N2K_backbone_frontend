import React from 'react'
import { AppFooter, AppHeader } from '../../components/index'
import { EULogin } from 'src/components/EULogin'

import {
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'

const Home = (props) => {
  let euLogin = new (EULogin);
  
  let login = (e)=>{
    e.preventDefault();
    if(location.hash.includes("sharesite")) {
      sessionStorage.setItem("sharedUrl",document.location.href);
    }
    euLogin.generateCodeVerifier();
    euLogin.generateLoginUrl().then(a=>{
        location.href =a;
    });
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader isLoggedIn={props.isLoggedIn}/>
      <div className="content--wrapper">
        <div className="main-content">
          <CContainer fluid>
            <CRow>
              <CCol md={12} lg={12}>
                <div className="page-title text-center p-3 mt-5">
                  <h1 className="h1">Natura Change Manager</h1>
                  <p>
                    This application is accessible only to authorised user, using their EU login. Please click on “Log In”.
                  </p>
                  <CButton color="primary" href="/#/" onClick={(e)=>login(e)}>
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
