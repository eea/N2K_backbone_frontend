import React, { useState, useRef, useEffect } from 'react';
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index';
import '@coreui/icons/css/flag.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import {DataLoader} from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CCard,
  CAlert,
  CButton
} from '@coreui/react'

const Sitelineage = () => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorsLoading, setErrorsLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  let dl = new(DataLoader);

  useEffect(() => {
    if(!showDescription) {
      if(document.querySelector(".page-description")?.scrollHeight < 6*16){
        setShowDescription("all");
      }
      else {
        setShowDescription("hide");
      }
    }
  });

  let loadData = () => {
    if(countries.length !==0) return;
    if(!isLoading && countries!=="nodata" && countries.length === 0 && !errorsLoading){
      setIsLoading(true);
      dl.fetch(ConfigData.LINEAGE_GET_OVERVIEW)
      .then(response =>response.json())
      .then(data => {
        if (data?.Success) {
          if(Object.keys(data.Data).length === 0){
            setCountries("nodata");
          }
          else {
            data.Data.sort((a, b) => a.CountryName.localeCompare(b.CountryName));
            setCountries(data.Data);
          }
        }
        else {
          setErrorsLoading(true);
        }
        setIsLoading(false);
      });
    }
  }

  let loadCards = () => {
    let cards = [];
      countries.map((card) => {
        cards.push(
          <CCol key={card.CountryCode + "Card"} xs={12} md={6} lg={4} xl={3}>
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
                    {
                      UtilsData.CHANGETYPES.map((change) => {
                        return <span className={"badge badge--lineage " + change.toLowerCase()}><b>{card[change]}</b> {change}</span>
                      })
                    }
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

  const page = UtilsData.SIDEBAR["sitelineage"].find(a => a.option === "overview");

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="sitelineage"/>
      <div className="content--wrapper">
        <AppSidebar
          title="Site Lineage"
          options={UtilsData.SIDEBAR["sitelineage"]}
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
              <div className={"page-description " + showDescription}>
                {page.description}
                {showDescription !== "all" &&
                  <CButton color="link" className="btn-link--dark text-nowrap" onClick={() => setShowDescription(prevCheck => prevCheck === "show" ? "hide" : "show")}>
                    {showDescription === "show" ? "Hide description" : "Show description"}
                  </CButton>
                }
              </div>
            }
            <CRow className="grid">
              {isLoading ?
                <div className="loading-container"><em>Loading...</em></div>
              : (countries === "nodata" ?
                <div className="nodata-container"><em>No Data</em></div>
                : countries.length > 0 &&
                loadCards()
                )
              }
              {!isLoading && errorsLoading &&
                <div>
                  <CAlert color="danger">Error loading countries data</CAlert>
                </div>
              }
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Sitelineage
