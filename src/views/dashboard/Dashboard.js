import React from 'react'

import {
  CCard,
  CCardBody,
  CCardText,
  CFormLabel,
  CCol,
  CFormSelect,
  CContainer,
  CRow,
  CButton,
  CImage
} from '@coreui/react'

import '@fortawesome/fontawesome-free/css/all.min.css';

import justificationrequired from './../../assets/images/exclamation.svg'
import justificationprovided from './../../assets/images/file-text.svg'

import FetchPendingData from './FetchPendingData';
import FetchSiteData from './FetchSiteData';

const Dashboard = () => {  

  return (
    <>
      <CContainer fluid>
        <div className="dashboard-title">
          <div hidden className="select--right m-0">
            <CFormLabel htmlFor="exampleFormControlInput1" className="form-label form-label-reporting col-md-4 col-form-label">Country</CFormLabel>
              <CFormSelect aria-label="Default select example" className="form-select-reporting">
                <option>All</option>
                <option value="1">Austria</option>
                <option value="2">Belgium</option>
                <option value="3">Bulgaria</option>
                <option value="4">...</option>
              </CFormSelect>
            </div>
          <h1 className="h1-main">Dashboard</h1>
        </div>
          <div className="container-card-dashboard mb-5">
            <CRow className="grid">
              <div className="col-md-6 col-xl-3">
                <a href="/#/harvesting">
                  <CCard className="card-dashboard-new">
                      <CCardBody>
                        <div className="card-icon-new">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                          </svg>
                        </div>
                        <CCardText className="card-text-new">
                        PENDING SUBMISSIONS
                        </CCardText>
                      </CCardBody>
                  </CCard>
                </a>
              </div>
              <div className="col-md-6 col-xl-3">
                <a href="/#/sitechanges">
                  <CCard className="card-dashboard-new">
                    <CCardBody>
                      <div className="card-icon-new">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                          <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z" />
                          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z" />
                        </svg>
                      </div>
                      <CCardText className="card-text-new">
                        PENDING CHANGES
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </a>
              </div>
              <div className="col-md-6 col-xl-3">
                <CCard className="card-dashboard-new">
                  <CCardBody>
                  <div className="card-icon-new">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                        <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z" />
                      </svg>
                    </div>
                    <CCardText className="card-text-new">
                      RELEASES & UNION LIST
                    </CCardText>
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-md-6 col-xl-3">
                <CCard className="card-dashboard-new">
                  <CCardBody>
                    <div className="card-icon-new">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-clipboard-data-fill" viewBox="0 0 16 16">
                        <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1ZM10 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8Zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm4-3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" />
                      </svg>
                    </div>
                    <CCardText className="card-text-new">
                      NEW REPORTS
                    </CCardText>
                  </CCardBody>
                </CCard>
              </div>
              </CRow>
          </div>
          <div>
            {FetchPendingData()}
          </div>
          <div hidden className="dashboard-title">
            <h1 className="h1-main">Pending Changes</h1>
          </div>
          <div hidden className="bg-white rounded-4 mb-5">
            <CRow className="grid">
              <CCol xs={12} md={6} lg={4} xl={3}>
                <CCard className="pending-card">
                  <div className="pending-card-header">
                    <span className="pending-card-title"><b>25645</b> | Spain</span>
                    <CImage src={justificationrequired}/>
                  </div>
                  <div className="pending-card-body">
                    <span className="badge color--critical"><b>2</b> Critical</span>
                    <span className="badge color--warning"><b>7</b> Warning</span>
                    <span className="badge color--info"><b>2</b> Info</span>
                  </div>
                  <div className="pending-card-button">
                  <CButton color="link" className="btn-link--dark">
                    Review Changes
                  </CButton>
                  </div>
                </CCard>
              </CCol>
              <CCol xs={12} md={6} lg={4} xl={3}>
                <CCard className="pending-card">
                  <div className="pending-card-header">
                    <span className="pending-card-title"><b>13502</b> | Malta</span>
                    <CImage src={justificationrequired}/>
                  </div>
                  <div className="pending-card-body">
                    <span className="badge color--critical"><b>1</b> Critical</span>
                    <span className="badge color--warning"><b>6</b> Warning</span>
                    {/* <span className="badge color--info"><b>2</b> Info</span> */}
                  </div>
                  <div className="pending-card-button">
                  <CButton color="link" className="btn-link--dark">
                    Review Changes
                  </CButton>
                  </div>
                </CCard>
              </CCol>
              <CCol xs={12} md={6} lg={4} xl={3}>
                <CCard className="pending-card">
                  <div className="pending-card-header">
                    <span className="pending-card-title"><b>90877</b> | Italy</span>
                    <CImage src={justificationprovided}/>
                  </div>
                  <div className="pending-card-body">
                    {/* <span className="badge color--critical"><b>2</b> Critical</span> */}
                    <span className="badge color--warning"><b>1</b> Warning</span>
                    {/* <span className="badge color--info"><b>2</b> Info</span> */}
                  </div>
                  <div className="pending-card-button">
                  <CButton color="link" className="btn-link--dark">
                    Review Changes
                  </CButton>
                  </div>
                </CCard>
              </CCol>
              <CCol xs={12} md={6} lg={4} xl={3}>
                <CCard className="pending-card">
                  <div className="pending-card-header">
                    <span className="pending-card-title"><b>90877</b> | France</span>
                    <CImage src={justificationprovided}/>
                  </div>
                  <div className="pending-card-body">
                    {/* <span className="badge color--critical"><b>2</b> Critical</span> */}
                    <span className="badge color--warning"><b>1</b> Warning</span>
                    {/* <span className="badge color--info"><b>2</b> Info</span> */}
                  </div>
                  <div className="pending-card-button">
                  <CButton color="link" className="btn-link--dark">
                    Review Changes
                  </CButton>
                  </div>
                </CCard>
              </CCol>
            </CRow>
          </div>
          <div className="dashboard-title">
            <h1 className="h1-main">Summary</h1>
          </div>
          <div className="container-card-dashboard mb-5">
            <CRow className="grid">
              {FetchSiteData()}
            </CRow>
          </div>
      </CContainer>
    </>
  )
}

export default Dashboard
