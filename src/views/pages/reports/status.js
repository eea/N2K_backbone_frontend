import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav
} from '@coreui/react'

const Reports = () => {
  const [height, setHeight] = useState();

  let resizeIframe = () => {
    let height = window.innerHeight - document.querySelector(".header").offsetHeight - document.querySelector(".page-title").offsetHeight - 64;
    setHeight(height);
  }

  useEffect(() => {
    resizeIframe();
    window.addEventListener('resize', resizeIframe)
  }, []);

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="reports"/>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Reports</li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/releases">
                <i className="fa-solid fa-bookmark"></i>
                Releases Dates
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/sites">
                <i className="fa-solid fa-bookmark"></i>
                Reference Sites Details
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/reports/status">
                <i className="fa-solid fa-bookmark"></i>
                Site Status
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/unionlists">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists Changes
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Site Status</h1>
              </div>
            </div>
            <CRow>
              <CCol>
                <iframe
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  scrolling="no"
                  width="100%"
                  height={height}
                  src={ConfigData.TABLEAU_STATUS + "?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:embed=y&:host_url=https://tableau-public.discomap.eea.europa.eu/&:refresh=true"}
                >
                </iframe>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Reports
