import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';

import {
  CCol,
  CContainer,
  CRow
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

  const page = UtilsData.SIDEBAR["reports"].find(a => a.option === "sites");

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="reports"/>
      <div className="content--wrapper">
        <AppSidebar
          title="Reports"
          options={UtilsData.SIDEBAR["reports"]}
          active={page.option}
        />
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">{page.name}</h1>
              </div>
            </div>
            {page.description &&
              <div className="page-description">{page.description}</div>
            }
            <CRow>
              <CCol>
                <iframe
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  scrolling="no"
                  width="100%"
                  height={height}
                  src={ConfigData.TABLEAU_SITES + "?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:embed=y&:host_url=https://tableau-public.discomap.eea.europa.eu/&:refresh=true"}
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
