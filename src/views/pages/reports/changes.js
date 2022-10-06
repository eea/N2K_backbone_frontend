import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';

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
              <a className="nav-link" href="/#/reports/management">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists Management
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/comparer">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists Comparer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/added">
                <i className="fa-solid fa-bookmark"></i>
                Sites Added
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/deleted">
                <i className="fa-solid fa-bookmark"></i>
                Sites Deleted
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/reports/changes">
                <i className="fa-solid fa-bookmark"></i>
                Changes
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Changes</h1>
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
                  src="https://tableau-public.discomap.eea.europa.eu/views/Barometer/Barometerstatistics?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Ftableau-public.discomap.eea.europa.eu%2F&:embed_code_version=3&:tabs=yes&:toolbar=yes&:showAppBanner=false&:display_count=no&iframeSizedToWindow=true&:loadOrderID=0">
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
