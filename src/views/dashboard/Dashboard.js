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
import {ReactComponent as IconEnvelopes} from './../../assets/images/dashboard_envelopes.svg';
import {ReactComponent as IconChanges} from './../../assets/images/dashboard_changes.svg';
import {ReactComponent as IconReleases} from './../../assets/images/dashboard_releases.svg';
import {ReactComponent as IconReports} from './../../assets/images/dashboard_reports.svg';

import PendingCards from './components/PendingCards';
import SiteGraph from './components/SiteGraph';

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
                <a href="/#/harvesting/incoming">
                  <CCard className="card-dashboard-new">
                      <CCardBody>
                        <div className="card-icon-new">
                          <IconEnvelopes/>
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
                        <IconChanges/>
                      </div>
                      <CCardText className="card-text-new">
                        PENDING CHANGES
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </a>
              </div>
              <div className="col-md-6 col-xl-3">
                <a href="/#/releases/management">
                  <CCard className="card-dashboard-new">
                    <CCardBody>
                    <div className="card-icon-new">
                      <IconReleases/>
                    </div>
                      <CCardText className="card-text-new">
                        RELEASES & UNION LIST
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </a>
              </div>
              <div className="col-md-6 col-xl-3">
                <a href="/#/reports/added">
                  <CCard className="card-dashboard-new">
                    <CCardBody>
                      <div className="card-icon-new">
                        <IconReports/>
                      </div>
                      <CCardText className="card-text-new">
                        NEW REPORTS
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </a>
              </div>
              </CRow>
          </div>
          <div>
            <PendingCards />
          </div>
          <div className="dashboard-title">
            <h1 className="h1-main">Summary</h1>
          </div>
          <div className="container-card-dashboard mb-5">
            <CRow className="grid">
              <SiteGraph />
            </CRow>
          </div>
      </CContainer>
    </>
  )
}

export default Dashboard
