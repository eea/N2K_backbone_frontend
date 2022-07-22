import React, { useState } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import {
  CCard,
  CCardBody,
  CCardImage,
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
import ConfigData from '../../config.json';

const Dashboard = () => {  
  /*
  ------- Pending Cards -------
  */
  
  const [pendingCountriesData, setPendingCountriesData] = useState([]);
  const [isPendingLoading, setIsPendingLoading] = useState(true);
  
  function populatePendingCountriesData() {
    if(isPendingLoading)
      fetch(ConfigData.GET_PENDING_LEVEL)
        .then(response => response.json())
        .then(data => {
          setIsPendingLoading(false);
          setPendingCountriesData(data.Data);
        });
  }
  
  const getPending = () => {
    populatePendingCountriesData();
    return pendingCountriesData.map((c) => ({
      name: c.Country,
      pendingInfo: c.NumInfo,
      pendingWarning: c.NumWarning,
      pendingCritical: c.NumCritical
    }))
  }
  
  let pendingCountries = getPending();
  
  function sumTotal(total, current) {
    return total + current;
  }
  
  let totalPendingInfo = pendingCountries.map((c) => c.pendingInfo).reduce(sumTotal, 0);
  let totalPendingWarning = pendingCountries.map((c) => c.pendingWarning).reduce(sumTotal, 0);
  let totalPendingCritical = pendingCountries.map((c) => c.pendingCritical).reduce(sumTotal, 0);

  const renderCards = () => {
    let countryPath;
    let result = []
    pendingCountries.map((country) => {
      countryPath = country.name.toLowerCase();
      if (countryPath.includes("czech")) {
        countryPath = countryPath.split(" ")[0];
      } else if (countryPath.includes("macedonia")) {
        countryPath = countryPath.split(" ")[1]
      }
    result.push(
      <CCol key={country.name+"Card"} xs={12} md={6} lg={4} xl={3}>
        <CCard className="country-card">
          <div className="country-card-left">
            <CCardImage className="card-img--flag" src={require("./../../../src/assets/images/flags/" + countryPath + ".png")} width="32px" />
          </div>
          <div className="country-card-right">
            <div className="country-card-header">
              <span className="country-card-title">{country.name}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
            <div className="country-card-body">
              <span className="badge color--critical"><b>{country.pendingCritical}</b> Critical</span>
              <span className="badge color--warning"><b>{country.pendingWarning}</b> Warning</span>
              <span className="badge color--info"><b>{country.pendingInfo}</b> Info</span>
            </div>
          </div>
        </CCard>
      </CCol>
    )
    });
    return (<>{result}</>);
  }
  
  /*
  ------- Sites Chart -------
  */

  let countries = pendingCountries.map((e) => e.name);

  const [sitesCountriesData, setSitesCountriesData] = useState([]);
  const [isSitesLoading, setIsSitesLoading] = useState(true);

  function populateSitesCountriesData() {
    if(isSitesLoading)
      fetch(ConfigData.GET_SITE_COUNT)
        .then(response => response.json())
        .then(data => {
          let chngPending = [], chngAccepted = [], chngRejected = [];
          for(let i in data.Data) {
              chngPending.push(data.Data[i].NumPending);
              chngAccepted.push(data.Data[i].NumAccepted);
              chngRejected.push(data.Data[i].NumRejected);
          }
          let result = [
              {name: 'Pending',   index: 1,   data: chngPending,  color: '#db6c70'},
              {name: 'Accepted',  index: 2,   data: chngAccepted, color: '#c6db6c'},
              {name: 'Rejected',  index: 3,   data: chngRejected, color: '#6cdb90'}
          ]
          setIsSitesLoading(false);
          setSitesCountriesData(result);
        });
  }
  
  populateSitesCountriesData();
  
  const options = {
    chart: {
      type: 'column'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Sites (Pending/Accepted/Rejected)'
    },
    xAxis: {
      categories: countries
    },
    yAxis: {
      min: 0,
      reversedStacks: false,
      title: {
        text: ''
      }
    },
    plotOptions: {
      series: {
        stacking: 'percent'
      }
    },
    accessibility: {
      enabled: false
    },
    series: sitesCountriesData
  }

  const renderChart = () => (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
    )

  return (
    <>
      <CContainer fluid>
        <div className="dashboard-title">
          <div className="select--right m-0">
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
          <div className="dashboard-title">
            <h1 className="h1-main me-5">Countries</h1>
            <div>
              <span className="badge badge--all active me-2">All</span>
              <span className="badge badge--critical radio me-2"><b>{totalPendingCritical}</b> Critical</span>
              <span className="badge badge--warning me-2"><b>{totalPendingWarning}</b> Warning</span>
              <span className="badge badge--info me-2"><b>{totalPendingInfo}</b> Info</span>
            </div>
          </div>
          <div className="bg-white rounded-2 mb-5">
            <CRow className="grid">
              {renderCards()}
            </CRow>
          </div>
          <div className="dashboard-title">
            <h1 className="h1-main">Pending Changes</h1>
          </div>
          <div className="bg-white rounded-4 mb-5">
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
                  {renderChart()}
            </CRow>
          </div>
      </CContainer>
    </>
  )
}

export default Dashboard
