import React, { lazy, useState, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import ConfigData from '../../../config.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { DataLoader } from '../../../components/DataLoader';

import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CCard,
  CFormLabel,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CTooltip,
} from '@coreui/react'

const SiteEditionOverView = () => {
  const [countries, setCountries] = useState([])
  const [data, setData] = useState([])
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  let dl = new (DataLoader);

  const loadData = () => {
    let promises = []
    promises.push(dl.fetch(ConfigData.GET_CLOSED_COUNTRIES)
      .then(response => response.json())
      .then(data => {
        if (data?.Success) {
          data.Data.sort((a, b) => a.Country.localeCompare(b.Country));
          setCountries(data.Data);
        } else { setErrors("Error loading countries list") }
      }));
    promises.push(dl.fetch(ConfigData.GET_CLOSED_COUNTRIES)
      .then(response => response.json())
      .then(data => {
        if (data?.Success) {
          setData(data.Data);
        } else { setErrors("Error loading country data") }
      }));
    Promise.all(promises).then(d => setIsLoading(false));
  }

  useEffect(() => {
    loadData()
  }, [])

  const countryCards = () => {
    console.log(countries)
    let result = []

    countries.map((country) => {
      result.push(
        <CCol key={country.name + "Card"} xs={12} md={6} lg={4} xl={3}>
          <a className="country-card-link" href={"/#/releases/siteedition?country=" + country.Code}>
            <CCard className="country-card">
              <div className="country-card-header">
                <div className="country-card-left">
                  <span className={"card-img--flag cif-" + country.Code.toLowerCase()}></span>
                  <span className="country-card-title">{country.Country}</span>
                </div>
                <div className="country-card-right">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="country-card-body">
                <div>
                  <span className="badge--type">Sites: </span>
                </div>
              </div>
            </CCard>
          </a>
        </CCol>
      )
    });
    return result;
  }

  // render
  return (
    <div className="container--main min-vh-100">
      <AppHeader page="releases" />
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Releases</li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/management">
                <i className="fa-solid fa-bookmark"></i>
                Release Management
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/comparer">
                <i className="fa-solid fa-bookmark"></i>
                Release Comparer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/releases/siteeditionoverview">
                <i className="fa-solid fa-bookmark"></i>
                Site Edition Overview
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/siteedition">
                <i className="fa-solid fa-bookmark"></i>
                Site Edition
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/unionlists">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Site Edition Overview</h1>
              </div>
              <CRow className="grid">
                {isLoading && <em>Loading...</em>}
                {!isLoading && countries.length > 0 && countryCards()}
                {!isLoading && countries.length == 0 && <em>No Data</em>}
              </CRow>
            </div>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default SiteEditionOverView

