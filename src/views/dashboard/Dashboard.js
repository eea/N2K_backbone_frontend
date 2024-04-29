import React, {useState} from 'react';
import { AppFooter, AppHeader } from './../../../src/components/index';
import ConfigData from '../../config.json';
import {DataLoader} from '../../components/DataLoader';

import {
  CCard,
  CCardBody,
  CCardText,
  CContainer,
  CRow,
  CCol
} from '@coreui/react'

import '@fortawesome/fontawesome-free/css/all.min.css';
import {ReactComponent as IconEnvelopes} from './../../assets/images/dashboard_envelopes.svg';
import {ReactComponent as IconChanges} from './../../assets/images/dashboard_changes.svg';
import {ReactComponent as IconReleases} from './../../assets/images/dashboard_releases.svg';
import {ReactComponent as IconReports} from './../../assets/images/dashboard_reports.svg';

import PendingCards from './components/PendingCards';
import SiteGraph from './components/SiteGraph';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorLoadingCards, setErrorLoadingCards] = useState(false);
  const [errorLoadingChart, setErrorLoadingChart] = useState(false);
  const [countriesPendingData, setCountriesPendingData] = useState([]);
  const [sitesPendingData, setSitesPendingData] = useState([]);
  const [sitesAcceptedData, setSitesAcceptedData] = useState([]);
  const [sitesRejectedData, setSitesRejectedData] = useState([]);
  const [changesCountriesData, setChangesCountriesData] = useState([]);
  let dl = new(DataLoader);

  let loadData = () => {
    let promises = [];
    let errorCards = false;
    let errorChart = false;
    setIsLoading(true);
    promises.push(dl.fetch(ConfigData.GET_PENDING_LEVEL)
    .then(response => response.json())
    .then(data => {
      if (data?.Success) {
        data.Data.sort((a, b) => a.Country.localeCompare(b.Country));
        setCountriesPendingData(data.Data);
      } else { errorCards = true }
    }));
    promises.push(dl.fetch(ConfigData.GET_SITE_LEVEL + '?status=Pending')
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          setSitesPendingData(data.Data);
        } else { errorCards = true, errorChart = true }
      }));
    promises.push(dl.fetch(ConfigData.GET_SITE_LEVEL + '?status=Accepted')
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          setSitesAcceptedData(data.Data);
        } else { errorChart = true }
      }));
    promises.push(dl.fetch(ConfigData.GET_SITE_LEVEL + '?status=Rejected')
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          setSitesRejectedData(data.Data);
        } else { errorChart = true }
      }));
    promises.push(dl.fetch(ConfigData.GET_SITE_COUNT)
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          data.Data.sort((a, b) => a.Country.localeCompare(b.Country));
          setChangesCountriesData(data.Data);
        } else { errorChart = true }
      }));
    Promise.all(promises).then(d => {
      setIsLoaded(true);
      setIsLoading(false);
      if (errorCards) {
        setErrorLoadingCards(true);
      }
      if (errorChart) {
        setErrorLoadingChart(true);
      } 
    });
  }

  if(!isLoaded && !isLoading) {
    loadData();
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="dashboard"/>
      <div className="main-content">
        <CContainer fluid>
          <div className="dashboard-title">
            <h1 className="h1-main">Dashboard</h1>
          </div>
          <div className="container-card-dashboard noborder mb-5">
            <CRow className="grid">
              <div className="col-md-6 col-xl-3">
                <a href="/#/harvesting/incoming">
                  <CCard className="card-dashboard-new">
                      <CCardBody>
                        <div className="card-icon-new">
                          <IconEnvelopes/>
                        </div>
                        <CCardText className="card-text-new">
                          Incoming Submissions
                        </CCardText>
                      </CCardBody>
                  </CCard>
                </a>
              </div>
              <div className="col-md-6 col-xl-3">
                <a href="/#/sitechanges/changes">
                  <CCard className="card-dashboard-new">
                    <CCardBody>
                      <div className="card-icon-new">
                        <IconChanges/>
                      </div>
                      <CCardText className="card-text-new">
                        Site Changes
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
                        Releases & Union Lists
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </a>
              </div>
              <div className="col-md-6 col-xl-3">
                <a href="/#/reports/releasesoverview">
                  <CCard className="card-dashboard-new">
                    <CCardBody>
                      <div className="card-icon-new">
                        <IconReports/>
                      </div>
                      <CCardText className="card-text-new">
                        Reports
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </a>
              </div>
              </CRow>
          </div>
          <div>
            <PendingCards
              isLoading={isLoading}
              countriesPendingData={countriesPendingData}
              sitesPendingData={sitesPendingData}
              errorsLoading={errorLoadingCards}
            />
          </div>
          <div className="dashboard-title">
            <h1 className="h1-main">Summary</h1>
          </div>
          <div className="container-card-dashboard mb-5">
            <CRow className="grid">
              <CCol>
                <SiteGraph
                  isLoading={isLoading}
                  changesCountriesData={changesCountriesData}
                  sitesPendingData={sitesPendingData}
                  sitesAcceptedData={sitesAcceptedData}
                  sitesRejectedData={sitesRejectedData}
                  errorsLoading={errorLoadingChart}
                />
              </CCol>
            </CRow>
          </div>
        </CContainer>
      </div>
    </div>
  )
}

export default Dashboard
