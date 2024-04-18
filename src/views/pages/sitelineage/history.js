import React, { lazy, useState, useRef } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import TableLineage from './TableLineage';
import ConfigData from '../../../config.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Turnstone from 'turnstone';
import {DataLoader} from '../../../components/DataLoader';
import { dateFormatter } from 'src/components/DateUtils';
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
  CSidebar,
  CSidebarNav
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
  const [siteData, setSiteData] = useState({});
  const [tableData, setTableData] = useState({});
  const [searchList, setSearchList] = useState({});
  const [selectOption, setSelectOption] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [disabledSearchBtn, setDisabledSearchBtn] = useState(true);
  const turnstoneRef = useRef();
  let dl = new(DataLoader);

  if(countries.length === 0 && !loadingCountries){
    setLoadingCountries(true);
    dl.fetch(ConfigData.LINEAGE_COUNTRIES)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        let countriesList = [];
        if(data.Data.length > 0) {
          setLoadingCountries(false);
          data.Data.sort((a,b) => a.Country.localeCompare(b.Country))
          for(let i in data.Data){
            countriesList.push({name:data.Data[i].Country,code:data.Data[i].Code});
          }
          setCountries(countriesList);
        }
        if(country === ""){
          setCountry(countriesList[0]?.code);
          changeCountry(countriesList[0]?.code);
        }
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
      dl.fetch(ConfigData.LINEAGE_GET_SITES+
        "country="+country+
        "&onlyedited=false"+
        "&onlyjustreq=false"+
        "&onlysci=false")
      .then(response =>response.json())
      .then(data => {
        if(data?.Success) {
          if(Object.keys(data.Data).length === 0){
            setSiteCodes("nodata");
          }
          else {
            setSiteCodes(data.Data);
            setSearchList(getSitesList(data.Data));
          }
          setIsLoading(false);
        }
      });
    }
  }

  let loadData = () => {
    if (!isLoading){
      let promises = [];
      setIsLoading(true);
      promises.push(dl.fetch(ConfigData.SITEDETAIL_GET+"?siteCode="+siteCode)
        .then(response => response.json())
        .then(data => {
          if (data?.Success) {
            if(data.Data.SiteCode === siteCode) {
              setSiteData(data.Data);
            }
          }
        })
      );
      promises.push(dl.fetch(ConfigData.LINEAGE_GET_HISTORY+"?siteCode="+siteCode)
        .then(response => response.json())
        .then(data => {
          if (data?.Success) {
            if(data.Data.length === 0) {
              setTableData("nodata");
            }
            else {
              setTableData(data.Data);
            }
          }
        })
      );
      Promise.all(promises).then(d => setIsLoading(false));
    }
  }

  let loadCard = () => {
    let countryName = countries.find(a=>a.code===country).name;
    return (
      <CCol xs={12} md={6} lg={4} xl={3} className="lineage-container-left">
        <div className="search-card-header">
          <span className="search-card-title">{siteData.SiteName}</span>
        </div>
        <div className="mb-2">
          <b className="me-2">{siteCode}</b> | <span className="ms-2">{countryName}</span>
        </div>
        <div className="mb-2">Release Date: {dateFormatter(siteData.ReleaseDate)}</div>
        <div className="mb-2">
          Area: {siteData.Area} ha
        </div>
        <CButton color="primary">Review Lineage</CButton>
      </CCol>
    )
  }

  let reloadCard = (e) => {
    if(e.currentTarget.classList.contains("basic-node")){
      let code = e.currentTarget.dataset.id;
      setSiteCode(code);
      setSiteData({});
      clearSearch();
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
        focusable: false,
        type: 'straight',
      },
      yellow: {
        style: {stroke: "#FED100"},
        markerEnd: {
          type: MarkerType.Arrow,
          color: "#FED100"
        },
        className: "yellow-edge",
        focusable: false,
        type: 'straight',
      }
    }
    if(tableData === "nodata") {
      let node = {
        id: "noData",
        sourcePosition: 'right',
        position: { x: 0, y:  0},
        data: { label: "No Data" },
        type: 'input',
        className: "disabled-node",
        selectable: false,
      }
      nodes.push(node);
    }
    else {
      let x = 0;
      let y = 0;
      for(let i in tableData) {
        let index = tableData.length - 1 - i;
        let code = tableData[index].SiteCode;
        let release = tableData[index].Release;
        if(nodes.length !== 0) {
          if(nodes.some(a=>a.code===code)) {
            y = nodes.find(a=> a.code === code).position.y
          }
          else {
            y = Math.min(...nodes.map(a=>a.position.y)) - 50;
          }
          if(nodes.some(a=>a.release===release)) {
            x = nodes.find(a=> a.release === release).position.x;
          }
          else {
            x = Math.min(...nodes.map(a=>a.position.x)) - 150 - release.length*5;
          }
        }
        let node = {
          id: code+"-"+release,
          position: { x: x, y: y },
          sourcePosition: 'right',
          targetPosition: 'left',
          data: { label: release },
          className: 'color-node '+(code === siteCode ? "green-node" : "yellow-node"),
          selectable: false,
          release: release,
          code: code,
        }
        nodes.push(node);

        let predecessors = tableData[index].Predecessors.SiteCode?.split(",");
        let edge;
        for(let p in predecessors) {
          let predCode = predecessors[p]
          let predRelease = tableData[index].Predecessors.Release;
            edge = {
              id: code+"-"+release+"-"+predCode+"-"+predRelease,
              source: predCode+"-"+predRelease,
              target: code+"-"+release,
              ...(code === siteCode ? edgeStyles.green : edgeStyles.yellow)
            }
          edges.push(edge);
        }
      }

      let chartSiteCodes = Array.from(new Set(tableData.map(({ SiteCode }) => SiteCode)));
      x = Math.min(...nodes.map(a=>a.position.x)) - 150;
      for(let j in chartSiteCodes) {
        let code = chartSiteCodes[j];
        y = nodes.find(a=> a.code === code).position.y
        let node = {
          id: code,
          sourcePosition: 'right',
          position: { x: x, y:  y},
          data: { label: code },
          type: 'input',
          className: code === siteCode ? "active-node" : "basic-node",
          selectable: false,
        }
        nodes.push(node);

        let edge = {
          id: code+"-0",
          source: code,
          target: code+"-"+nodes.reverse().find(a=>a.code===code).release,
          style: {strokeDasharray: 4},
          focusable: false,
        }
        edges.push(edge);
      }
    }   
    return (
      <CCol xs={12} md={6} lg={8} xl={9} className="lineage-container-right">
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
    turnstoneRef.current?.blur();
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
    setSiteData({});
    clearSearch();
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
      <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Site Lineage</li>
            <li className="nav-item">
              <a className="nav-link" href="/#/sitelineage/overview">
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
              <a className="nav-link active" href="/#/sitelineage/history">
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
                <h1 className="h1">Lineage History</h1>
              </div>
            </div>
            <CRow>
              <CCol sm={12} md={6} lg={6} className="d-flex mb-4">
                <div className="search--input">
                  <Turnstone
                    id="sitelineage_search"
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
                    disabled={isLoading || !country}
                    value={selectOption}
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
              <CCol sm={12} md={6} lg={6} className="mb-4">
                  <div className="select--right">
                    <CFormLabel className="form-label form-label-reporting col-md-4 col-form-label">Country </CFormLabel>
                    <CFormSelect aria-label="Default select example" className='form-select-reporting' disabled={isLoading || !country} value={country} onChange={(e)=>changeCountry(e.target.value)}>
                      {
                        countries.map((e)=><option value={e.code} key={e.code}>{e.name}</option>)
                      }
                    </CFormSelect>
                  </div>
                </CCol>
            </CRow>
            <CRow className="grid">
              {isLoading || country === "" ?
                <div className="loading-container"><em>Loading...</em></div>
              : (!country ?
                <div className="nodata-container"><em>No Data</em></div>
                : Object.keys(siteData).length > 0 &&
                  <>
                    {loadCard()}
                    {loadChart()}
                    {tableData !== "nodata" &&
                      <TableLineage data={tableData} siteCode={siteCode}/>
                    }
                  </>
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
