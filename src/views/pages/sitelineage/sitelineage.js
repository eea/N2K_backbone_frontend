import React, { lazy, useState, useRef } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import ConfigData from '../../../config.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {DataLoader} from '../../../components/DataLoader';
import ReactFlow, { Controls, Background, MiniMap, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CCard,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'

const defaultCountry = () => {
  const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
  const parmCountry = searchParams.get('country');
  return parmCountry ? parmCountry : ConfigData.DEFAULT_COUNTRY ? ConfigData.DEFAULT_COUNTRY : "";
}

const Sitelineage = () => {
  const [siteCode, setSiteCode] = useState();
  const [siteCodes, setSiteCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState();
  const [siteData, setSiteData] = useState({});
  let dl = new(DataLoader);

  if(countries.length === 0 && !loadingCountries){-
    setLoadingCountries(true);
    dl.fetch(ConfigData.COUNTRIES_WITH_DATA)
    .then(response => response.json())
    .then(data => {
      setLoadingCountries(false);
      let countriesList = [];
      for(let i in data.Data){
        countriesList.push({name:data.Data[i].Country,code:data.Data[i].Code});
      }
      setCountries(countriesList);
    });
  }

  let changeCountry = (country) => {
    setCountry(country);
    forceRefreshData();
  }

  let forceRefreshData = () => {
    setSiteCode();
    setSiteCodes([]);
    setSiteData({});
  };

  let loadSites = () => {
    if(!isLoading && siteCodes.length === 0) {
      setIsLoading(true);
      dl.fetch(ConfigData.SITECHANGES_GET+"country="+country)
      .then(response =>response.json())
      .then(data => {
        if(Object.keys(data.Data).length === 0){
          setSiteCodes("nodata");
        }
        else {
          setSiteCodes(data.Data);
        }
        setIsLoading(false);
      });
    }
  }

  let changeSite = (site) => {
    setSiteCode(site);
    setSiteData({});
  }

  let loadData = () => {
    if (!isLoading){
      setIsLoading(true);
      dl.fetch(ConfigData.SITECHANGES_DETAIL+"siteCode="+siteCode+"&version="+siteCodes.find(a=>a.SiteCode === siteCode).Version)
      .then(response => response.json())
      .then(data => {
        if(data.Data.SiteCode === siteCode) {
          setIsLoading(false);
          setSiteData(data.Data);
        }
      });
    }
  }

  let loadCard = () => {
    let site = siteCodes.find(a=>a.SiteCode === siteCode);
    return (
      <CCol xs={12} md={6} lg={4} xl={3}>
        <CCard className="search-card">
          <div className="search-card-header">
            <span className="search-card-title">{site.SiteName}</span>
          </div>
          <div className="search-card-body">
            <span className="search-card-description"><b>{siteCode}</b> | {site.Country}</span>
          </div>
        </CCard>
      </CCol>
    )
  }

  let loadChart = () => {
    const nodes = [
      {
        id: '0a',
        sourcePosition: 'right',
        position: { x: 0, y: -50 },
        data: { label: siteCode },
        type: 'input',
        className: "basic-node",
        selectable: false,
      },
      {
        id: '0b',
        sourcePosition: 'right',
        position: { x: 0, y: 0 },
        data: { label: siteCode },
        type: 'input',
        className: "basic-node",
        selectable: false,
      },
      {
        id: '0c',
        sourcePosition: 'right',
        position: { x: 0, y: 50 },
        data: { label: siteCode },
        type: 'input',
        className: "basic-node",
        selectable: false,
      },
      {
        id: '1',
        position: { x: 150, y: 0 },
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'V1' },
        className: 'color-node green-node',
        selectable: false,
      },
      {
        id: '2',
        sourcePosition: 'right',
        targetPosition: 'left',
        position: { x: 250, y: 0 },
        data: { label: <span >V2</span> },
        className: 'color-node green-node',
        selectable: false,
      },
      {
        id: '3a',
        sourcePosition: 'right',
        targetPosition: 'left',
        position: { x: 350, y: -50 },
        data: { label: <span>V3</span> },
        className: 'color-node yellow-node',
        selectable: false,
      },
      {
        id: '3b',
        sourcePosition: 'right',
        targetPosition: 'left',
        position: { x: 350, y: 50 },
        data: { label: "V3" },
        className: 'color-node yellow-node',
        selectable: false,
      },
      {
        id: '4a',
        sourcePosition: 'right',
        targetPosition: 'left',
        position: { x: 450, y: -50 },
        data: { label: "V4" },
        className: 'color-node yellow-node',
        selectable: false,
      },
      {
        id: '4b',
        sourcePosition: 'right',
        targetPosition: 'left',
        position: { x: 450, y: 50 },
        data: { label: "V4" },
        className: 'color-node yellow-node',
        selectable: false,
      },
    ];
    let edgeStyles = {
      green:{
        style: {stroke: "#4fd1c5"},
        markerEnd: {
          type: MarkerType.Arrow,
          color: "#4fd1c5"
        },
        className: "green-edge",
        selectable: false,
      },
      yellow: {
        style: {stroke: "#f6e05e"},
        markerEnd: {
          type: MarkerType.Arrow,
          color: "#f6e05e"
        },
        className: "yellow-edge",
        selectable: false,
      }
    }
    const edges = [
      {
        id: '0a-1',
        source: '0a',
        target: '3a',
        style: {strokeDasharray: 4},
        selectable: false,
      },
      {
        id: '0b-1',
        source: '0b',
        target: '1',
        style: {strokeDasharray: 4},
        selectable: false,
      },
      {
        id: '0c-1',
        source: '0c',
        target: '3b',
        style: {strokeDasharray: 4},
        selectable: false,
      },
      {
        id: '1-2',
        source: '1',
        target: '2',
        ...edgeStyles.green,
      },
      {
        id: '2-3a',
        source: '2',
        target: '3a',
        type: 'straight',
        ...edgeStyles.yellow,
      },
      { 
        id: '2-3b',
        source: '2',
        target: '3b',
        type: 'straight',
        ...edgeStyles.yellow,
      },
      {
        id: '3a-4a',
        source: '3a',
        target: '4a',
        type: 'straight',
        ...edgeStyles.yellow,
      },
      {
        id: '3b-4b',
        source: '3b',
        target: '4b',
        type: 'straight',
        ...edgeStyles.yellow,
      }
    ];
    return (
      <CCol xs={12} md={6} lg={8} xl={9}>
        <div className="chart-container" style={{height:"450px"}}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            // onNodesChange={onNodesChange}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </CCol>
    )
  }

  {country && loadSites()}
  {siteCode && Object.keys(siteData).length === 0 && loadData()}

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="sitelineage"/>
      <div className="content--wrapper">
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Site Lineage</h1>
              </div>
            </div>
            <CRow>
              <CCol className="d-flex justify-content-end mb-4">
                  <div className="select--right w-auto">
                    <CFormLabel className="form-label form-label-reporting col-md-4 col-form-label">Country </CFormLabel>
                    <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={loadingCountries || isLoading} value={country} onChange={(e)=>changeCountry(e.target.value)}>
                      <option disabled selected value hidden>Select a country</option>
                      {
                        countries.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
                      }
                    </CFormSelect>
                  </div>
                  <div className="select--right w-auto ms-4">
                    <CFormLabel className="form-label form-label-reporting col-md-4 col-form-label">Site Code </CFormLabel>
                    <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={isLoading || (!country && siteCodes.length <= 0)} value={siteCode} onChange={(e)=>changeSite(e.target.value)}>
                      <>
                        <option disabled selected value hidden>Select a Site Code</option>
                        {siteCodes.map((e)=><option value={e.SiteCode} key={e.SiteCode}>{e.SiteCode}</option>)}
                      </>
                    </CFormSelect>
                  </div>
                </CCol>
            </CRow>
            <CRow className="grid">
              {
                siteCode && isLoading ?
                  <div className="loading-container"><em>Loading...</em></div>
                : Object.keys(siteData).length > 0 &&
                <>
                  {loadCard()}
                  {loadChart()}
                </>
              }
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Sitelineage
