import React, { lazy, useState, useRef } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import TableLineage from './TableLineage';
import ConfigData from '../../../config.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Turnstone from 'turnstone';
import {DataLoader} from '../../../components/DataLoader';
import ReactFlow, { Controls, Background, MarkerType } from 'reactflow';
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
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(defaultCountry);
  const [siteCode, setSiteCode] = useState();
  const [siteCodes, setSiteCodes] = useState([]);
  const [siteLineage, setSiteLineage] = useState({antecessor: [], successors: ["AT2208000","AT2209000"]});
  const [siteData, setSiteData] = useState({});
  const [testTableData, setTestTableData] = useState({});
  const [searchList, setSearchList] = useState({});
  const [selectOption, setSelectOption] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);
  const turnstoneRef = useRef();
  let dl = new(DataLoader);

  if(countries.length === 0 && !loadingCountries){
    setLoadingCountries(true);
    dl.fetch(ConfigData.COUNTRIES_WITH_DATA)
    .then(response => response.json())
    .then(data => {
      setLoadingCountries(false);
      let countriesList = [];
      for(let i in data.Data){
        countriesList.push({name:data.Data[i].Country,code:data.Data[i].Code});
      }
      countriesList = [{name:"",code:""}, ...countriesList];
      setCountries(countriesList);
      if(country === ""){
        setCountry((countriesList.length>1)?countriesList[1]?.code:countriesList[0]?.code);
        changeCountry((countriesList.length>1)?countriesList[1]?.code:countriesList[0]?.code);
      }
    });
  }

  let changeCountry = (country) => {
    setCountry(country);
    setSearchList({});
    turnstoneRef.current?.clear();
    turnstoneRef.current?.blur();
    forceRefreshData();
  }

  let getSitesList = (data) => {
    return {
      name: "sites",
      data: data.map?data.map(x=>({"search":x.SiteCode+" - "+x.Name,...x})):[],
      searchType: "contains",
    }
  }

  let forceRefreshData = () => {
    setSiteCode();
    setSiteCodes([]);
    setSiteData({});
  };

  let loadSites = () => {
    if(!isLoading && siteCodes.length === 0) {
      setIsLoading(true);
      dl.fetch(ConfigData.SITEEDITION_GET+"country="+country)
      .then(response =>response.json())
      .then(data => {
        if(Object.keys(data.Data).length === 0){
          setSiteCodes("nodata");
        }
        else {
          setSiteCodes(data.Data);
          setSearchList(getSitesList(data.Data));
        }
        setIsLoading(false);
      });
    }
  }

  let loadData = () => {
    if (!isLoading){
      setIsLoading(true);
      dl.fetch(ConfigData.SITEDETAIL_GET+"?siteCode="+siteCode)
      .then(response => response.json())
      .then(data => {
        if(data.Data.SiteCode === siteCode) {
          setIsLoading(false);
          setSiteData(data.Data);
          let testData = [
            {
              "SiteCode": siteCode,
              "Version": "V1",
              "Antecessors": {
                "SiteCode": null,
                "Version": null,
              },
              "Successors": {
                "SiteCode": siteCode,
                "Version": "V2",
              },
            },
            {
              "SiteCode": siteCode,
              "Version": "V2",
              "Antecessors": {
                "SiteCode": siteCode,
                "Version": "V1",
              },
              "Successors": {
                "SiteCode": "AT2208000, AT2209000",
                "Version": "V2",
              },
            },
            {
              "SiteCode": "AT2208000",
              "Version": "V3",
              "Antecessors": {
                "SiteCode": siteCode,
                "Version": "V2",
              },
              "Successors": {
                "SiteCode": "AT2208000",
                "Version": "V4",
              },
            },
            {
              "SiteCode": "AT2208000",
              "Version": "V4",
              "Antecessors": {
                "SiteCode": "AT2208000",
                "Version": "V3"
              },
              "Successors": {
                "SiteCode": null,
                "Version": null
              },
            },
            {
              "SiteCode": "AT2209000",
              "Version": "V3",
              "Antecessors": {
                "SiteCode": siteCode,
                "Version": "V2"
              },
              "Successors": {
                "SiteCode": null,
                "Version": null
              },
            },
          ]
          setTestTableData(testData);
        }
      });
    }
  }

  let loadCard = () => {
    let countryName = countries.find(a=>a.code===country).name;
    return (
      <CCol xs={12} md={6} lg={4} xl={3}>
        <div className="search-card-header">
          <span className="search-card-title">{siteData.SiteName}</span>
        </div>
        <div className="mb-2"><b>{siteCode}</b> | {countryName}</div>
        <div>
          Area: {siteData.Area} ha
        </div>
      </CCol>
    )
  }

  let reloadCard = (e) => {
    let site = e.currentTarget.innerText;
    if(e.currentTarget.classList.contains("basic-node")){
      if(site === 'AT2208000') {
        setSiteLineage({antecessor: siteCode, successors:[]});
        setSiteCode(e.currentTarget.innerText);
      }
      else if(site === 'AT2209000') {
        setSiteLineage({antecessor: siteCode, successors:[]});
        setSiteCode(e.currentTarget.innerText);
      }
      else {
        setSiteLineage({antecessor: "", successors:["AT2208000", "AT2209000"]});
        setSiteCode(e.currentTarget.innerText);
      }
    }
  }

  let loadChart = () => {
    let nodes = [];
    let edges = [];
    let edgeStyles = {
      green:{
        style: {stroke: "#4FC1C5"},
        markerEnd: {
          type: MarkerType.Arrow,
          color: "#4FC1C5"
        },
        className: "green-edge",
        selectable: false,
      },
      yellow: {
        style: {stroke: "#FED100"},
        markerEnd: {
          type: MarkerType.Arrow,
          color: "#FED100"
        },
        className: "yellow-edge",
        selectable: false,
      }
    }
    if(siteCode === 'AT2208000') {
      nodes = [
        {
          id: '0a',
          sourcePosition: 'right',
          position: { x: 0, y: -50 },
          data: { label: siteCode },
          type: 'input',
          className: "active-node",
          selectable: false,
        },
        {
          id: '0b',
          sourcePosition: 'right',
          position: { x: 0, y: 0 },
          data: { label: siteLineage.antecessor },
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
          className: 'color-node yellow-node',
          selectable: false,
        },
        {
          id: '2',
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: 250, y: 0 },
          data: { label: 'V2' },
          className: 'color-node yellow-node',
          selectable: false,
        },
        {
          id: '3a',
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: 350, y: -50 },
          data: { label: 'V3' },
          className: 'color-node green-node',
          selectable: false,
        },
        {
          id: '4a',
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: 450, y: -50 },
          data: { label: "V4" },
          className: 'color-node green-node',
          selectable: false,
        },
      ];
      edges = [
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
          id: '1-2',
          source: '1',
          target: '2',
          ...edgeStyles.yellow,
        },
        {
          id: '2-3a',
          source: '2',
          target: '3a',
          type: 'straight',
          ...edgeStyles.green,
        },
        {
          id: '3a-4a',
          source: '3a',
          target: '4a',
          type: 'straight',
          ...edgeStyles.green,
        },
      ];
    }
    else if(siteCode === 'AT2209000') {
      nodes = [
        {
          id: '0b',
          sourcePosition: 'right',
          position: { x: 0, y: 0 },
          data: { label: siteLineage.antecessor },
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
          className: "active-node",
          selectable: false,
        },
        {
          id: '1',
          position: { x: 150, y: 0 },
          sourcePosition: 'right',
          targetPosition: 'left',
          data: { label: 'V1' },
          className: 'color-node yellow-node',
          selectable: false,
        },
        {
          id: '2',
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: 250, y: 0 },
          data: { label: 'V2' },
          className: 'color-node yellow-node',
          selectable: false,
        },

        {
          id: '3b',
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: 350, y: 50 },
          data: { label: 'V3' },
          className: 'color-node green-node',
          selectable: false,
        }
      ];
      edges = [
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
          ...edgeStyles.yellow,
        },
        {
          id: '2-3b',
          source: '2',
          target: '3b',
          type: 'straight',
          ...edgeStyles.green,
        },
      ];
    }
    else {
      nodes = [
        {
          id: '0a',
          sourcePosition: 'right',
          position: { x: 0, y: -50 },
          data: { label: siteLineage.successors[0] },
          type: 'input',
          className: "basic-node",
          selectable: false,
          onClick: ()=>alert()
        },
        {
          id: '0b',
          sourcePosition: 'right',
          position: { x: 0, y: 0 },
          data: { label: siteCode },
          type: 'input',
          className: "active-node",
          selectable: false,
        },
        {
          id: '0c',
          sourcePosition: 'right',
          position: { x: 0, y: 50 },
          data: { label: siteLineage.successors[1] },
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
          data: { label: 'V2' },
          className: 'color-node green-node',
          selectable: false,
        },
        {
          id: '3a',
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: 350, y: -50 },
          data: { label: 'V3' },
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
      ];
      edges = [
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
      ];
    }
    return (
      <CCol xs={12} md={6} lg={8} xl={9}>
        <div className="chart-container" style={{height:"300px"}}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            onNodeClick={(e)=>reloadCard(e)}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </CCol>
    )
  }

  let clearSearch = () => {
    turnstoneRef.current?.clear();
    setDisabledSearchBtn(true);
    setSelectOption({});
  }

  let selectSearchOption = (e) => {
    if (e) {
      setDisabledSearchBtn(false);
      setSelectOption(e);
    }
    else {
      setDisabledSearchBtn(true);
    }
  }

  let selectSite = () => {
    setSiteCode(selectOption.SiteCode);
    setSiteLineage({antecessor: "", successors:["AT2208000", "AT2209000"]});
    setSiteData({});
  } 

  const item = (props) => {
    return (
      <div className="search--option">
        <div>{props.item.Name}</div>
        <div className="search--suboption">{props.item.SiteCode}</div>
      </div>
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
                <h1 className="h1">Site Edition</h1>
              </div>
            </div>
            <CRow>
              <CCol md={12} lg={6} xl={9} className="d-flex mb-4">
                <div className="search--input">
                  <Turnstone
                    id="siteedition_search"
                    className="form-control"
                    listbox = {searchList}
                    listboxIsImmutable = {false}
                    placeholder="Search sites by site name or site code"
                    noItemsMessage="Site not found"
                    styles={{input:"form-control", listbox:"search--results", groupHeading:"search--group", noItemsMessage:"search--option"}}
                    onSelect={(e)=>selectSearchOption(e)}
                    ref={turnstoneRef}
                    Item={item}
                    typeahead={false}
                  />
                  {Object.keys(selectOption).length !== 0 &&
                    <span className="btn-icon" onClick={()=>clearSearch()}>
                      <i className="fa-solid fa-xmark"></i>
                    </span>
                  }
                </div>
                <CButton disabled={disabledSearchBtn} onClick={()=>selectSite()}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </CButton>
              </CCol>
              <CCol className="mb-4">
                  <div className="select--right">
                    <CFormLabel className="form-label form-label-reporting col-md-4 col-form-label">Country </CFormLabel>
                    <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={isLoading} value={country} onChange={(e)=>changeCountry(e.target.value)}>
                      {
                        countries.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
                      }
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
                  <TableLineage data={testTableData} siteCode={siteCode}/>
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
