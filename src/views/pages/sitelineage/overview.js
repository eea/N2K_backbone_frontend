import React, { useState, useRef, useEffect } from 'react';
import { AppFooter, AppHeader } from '../../../components/index';
import '@coreui/icons/css/flag.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CCard,
} from '@coreui/react'

const Sitelineage = () => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let dl = new(DataLoader);

  let loadData = () => {
    if(countries.length !==0) return;
    if(!isLoading && countries!=="nodata" && countries.length === 0){
      setIsLoading(true);
      dl.fetch(ConfigData.LINEAGE_GET_OVERVIEW)
      .then(response =>response.json())
      .then(data => {
        if(Object.keys(data.Data).length === 0){
          setCountries("nodata");
        }
        else {
          setCountries(data.Data);
        }
        setIsLoading(false);
      });
    }
  }

  let loadCards = () => {
    let cards = [];
      countries.map((card) => {
        cards.push(
          <CCol key={card.Country + "Card"} xs={12} md={6} lg={4} xl={3}>
              <a className="country-card-link" href={"/#/sitelineage/management?country=" + card.CountryCode}>
                <CCard className="country-card">
                  <div className="country-card-header">
                    <div className="country-card-left">
                      <span className={"card-img--flag cif-" + card.CountryCode.toLowerCase()}></span>
                      <span className="country-card-title">{card.CountryName}</span>
                    </div>
                    <div className="country-card-right">
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                  <div className="country-card-body">
                    <span className="badge badge--lineage creation"><b>{card.Creation}</b> Creation</span>
                    <span className="badge badge--lineage deletion"><b>{card.Deletion}</b> Deletion</span>
                    <span className="badge badge--lineage split"><b>{card.Split}</b> Split</span>
                    <span className="badge badge--lineage merge"><b>{card.Merge}</b> Merge</span>
                    <span className="badge badge--lineage recode"><b>{card.Recode}</b> Recode</span>
                  </div>
                </CCard>
              </a>
          </CCol>
        )
      }
    )
    return(
      <>
        {cards}
      </>
    )
  }

  loadData();

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="sitelineage"/>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Site Lineage</li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/sitelineage/overview">
                <i className="fa-solid fa-bookmark"></i>
                Lineage Overview
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/sitelineage/management">
                <i className="fa-solid fa-bookmark"></i>
                Lineage Management
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/sitelineage/history">
                <i className="fa-solid fa-bookmark"></i>
                Lineage History
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Lineage Overview</h1>
              </div>
            </div>
            <CRow className="grid">
              {isLoading ?
                <div className="loading-container"><em>Loading...</em></div>
              : (countries === "nodata" ?
                <div className="nodata-container"><em>No Data</em></div>
                : countries.length > 0 &&
                loadCards()
                )
              }
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Sitelineage
