import React, { lazy, useState, useEffect } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import ConfigData from '../../../config.json';
import '@coreui/icons/css/flag.min.css';
import { DataLoader } from '../../../components/DataLoader';

import {
  CAlert,
  CCol,
  CContainer,
  CRow,
  CCard
} from '@coreui/react'

const SiteEditionOverView = () => {
  const [countries, setCountries] = useState([])
  const [errors, setErrors] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  let dl = new (DataLoader);

  const loadData = () => {
    let promises = []
    promises.push(dl.fetch(ConfigData.GET_EDITION_COUNTRIES)
      .then(response => response.json())
      .then(data => {
        if (data?.Success) {
          data.Data.sort((a, b) => a.Country.localeCompare(b.Country));
          setCountries(data.Data);
        } else { setErrors("Error loading data") }
      }));
    Promise.all(promises).then(d => setIsLoading(false));
  }

  useEffect(() => {
    loadData()
  }, [])

  const countryCards = () => {
    let result = []

    countries.map((country) => {
      result.push(
        <CCol key={country.Country + "Card"} xs={12} md={6} lg={4} xl={3}>
          <a className="country-card-link" href={country.IsEditable ? "/#/releases/siteedition?country=" + country.Code : null}>
            <CCard className={"country-card" + (!country.IsEditable ? ' country-card-disabled' : '')}>
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
                  <span className="badge--type"><b>{country.SiteCount}</b> Sites</span>
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
        <AppSidebar
          title="Releases"
          options={[
            {"path": "/#/releases/management", "name":"Release Management", "active": false},
            {"path": "/#/releases/documentation", "name":"Release Documentation", "active": false},
            {"path": "/#/releases/comparer", "name":"Release Comparer", "active": false},
            {"path": "/#/releases/siteeditionoverview", "name":"Site Edition Overview", "active": true},
            {"path": "/#/releases/siteedition", "name":"Site Edition", "active": false},
            {"path": "/#/releases/unionlists", "name":"Union Lists", "active": false}
          ]}
        />
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Site Edition Overview</h1>
              </div>
            </div>
            <CRow className="grid">
              {errors.length > 0 && <CAlert color="danger">{errors}</CAlert>}
              {isLoading &&
                <div className="loading-container"><em>Loading...</em></div>
              }
              {!isLoading && countries.length > 0 && countryCards()}
              {!isLoading && countries.length == 0 && <em>No Data</em>}
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default SiteEditionOverView

