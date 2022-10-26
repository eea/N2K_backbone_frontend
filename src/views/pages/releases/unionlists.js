import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CButton,
  CFormLabel,
  CFormSelect,
  CTable
} from '@coreui/react'

let hasTableScroll = false;

const Reports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [unionLists, setUnionLists] = useState([]);
  const [bioRegions, setBioRegions] = useState([]);
  const [filteredBioRegions, setFilteredBioRegions] = useState([]);
  const [selectedUnionList1, setSelectedUnionList1] = useState();
  const [selectedUnionList2, setSelectedUnionList2] = useState();
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  let dl = new(DataLoader);

  let loadUnionLists = () => {
    setIsLoading(true);
    dl.fetch(ConfigData.UNIONLISTS_GET)
    .then(response =>response.json())
    .then(data => {
      if(Object.keys(data.Data).length > 0){
        setUnionLists(data.Data);
      }
      setIsLoading(false);
    });
  }

  let loadBioRegions = () => {
    dl.fetch(ConfigData.UNIONLISTS_BIOREGIONS)
    .then(response =>response.json())
    .then(data => {
      if(Object.keys(data.Data).length > 0){
        setBioRegions(data.Data);
      }
    });
  }

  let loadData = (unionlist1, unionlist2) => {
    if(!isLoading && (Object.keys(tableData1).length===0 || Object.keys(tableData2).length===0)) {
      setIsLoading(true);
      dl.fetch(ConfigData.UNIONLISTS_DETAIL)
      .then(response => response.json())
      .then(data => {
        if(Object.keys(data.Data).length > 0) {
          let dataFilter = data.Data;
          setTableData(data.Data);
          if(filteredBioRegions.length > 0){
            for(let i in filteredBioRegions){
              dataFilter.push(dataFilter.filter(a=>a.BioRegion === filteredBioRegions[i]));
            }
          }
          setTableData(dataFilter.slice(0,100));
          setTableData1(dataFilter.slice(0,100));
          setTableData2(dataFilter.slice(0,100));
        }
        setIsLoading(false);
      })
    }
  }

  const loadBioRegionButtons = () => {
    let buttons = [];
    for(let i in bioRegions){
      let region = bioRegions[i];
      let count = tableData.filter(a => a.BioRegion === region.BioRegionShortCode).length;
      buttons.push(
        <CButton color="primary" key={region.BioRegionShortCode} disabled={count===0} size="sm" onClick={(e)=>filterBioRegion(e)} value={region.BioRegionShortCode}>
          {count + " " + region.RefBioGeoName}
        </CButton>
      );
    }
    return buttons;
  }

  const loadTable = (table) => {
    let header = [
      {field:"BioRegion",name:"Biogeographical Region"},
      {field:"SCI_code",name:"Sitecode"},
      {field:"SCI_Name",name:"Site Name"},
      {field:"Priority",name:"Priority"},
      {field:"Area",name:"Area"},
      {field:"Length",name:"Length"},
      {field:"Lat",name:"Latitude"},
      {field:"Long",name:"Longitude"}
    ];
    let data = tableData.slice(0,10);
    let rows = [];
    for(let i in data) {
      let row = [];
      let rowData = data[i];
      for(let j in header) {
        let head = header[j].field;
        let field = rowData[head];
        if(head === "Priority"){
          field = field ? "Yes" : "No";
        }
        row.push(<td key={table+"_td_"+head+"_"+i} style={{whiteSpace:"nowrap"}}>{field}</td>);
      }
      rows.push(row);
    }

    return (
      <CTable>
        <thead>
          <tr>
            {header.map((e)=><th key={table+"_th_"+e.field}>{e.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((e, f)=><tr key={table+"_tr_"+f}>{e}</tr>)}
        </tbody>
      </CTable>
    )
  }

  const filterBioRegion = (e) => {
    let value = e.currentTarget.value;
    if(filteredBioRegions.includes(value)) {
      let filter = filteredBioRegions.filter(e => e !== value);
      setFilteredBioRegions(filter);
    }
    else {
      let filter = filteredBioRegions.concat(value);
      setFilteredBioRegions(filter);
    }
    // setTableData([]);
    // compareUnionLists();
    e.currentTarget.classList.toggle("btn-secondary");
  }

  useEffect(() => {
    if(document.querySelectorAll(".unionlist-table")[0] && document.querySelectorAll(".unionlist-table")[1] && !hasTableScroll){
      hasTableScroll = true;
      tableScroll();
    }
  });

  let tableScroll = () => {
    var s1 = document.querySelectorAll(".unionlist-table")[0];
    var s2 = document.querySelectorAll(".unionlist-table")[1];
    let select_scroll1 = (e) => {
      s2.scrollLeft = s1.scrollLeft;
    }
    let select_scroll2 = (e) => {
      s1.scrollLeft = s2.scrollLeft;
    }
    s1.addEventListener('scroll', select_scroll1, false);
    s2.addEventListener('scroll', select_scroll2, false);
  }

  if(unionLists.length === 0 && !isLoading){
    loadUnionLists();
  }

  if(bioRegions.length === 0){
    loadBioRegions();
  }

  setTableData.length !== 0 && loadData(selectedUnionList1, selectedUnionList2);

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="releases"/>
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
              <a className="nav-link active" href="/#/releases/unionlists">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/siteedition">
                <i className="fa-solid fa-bookmark"></i>
                Site Edition
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Union Lists</h1>
              </div>
              <div>
                <ul className="btn--list">
                  <CButton color="primary">
                    Create Union Lists
                  </CButton>
                </ul>
              </div>
            </div>
            {isLoading &&
              <div className="loading-container"><em>Loading...</em></div>
            }
            {tableData1.length > 0 && tableData2.length > 0 &&
              <>
                <CRow>
                  <CCol>
                    <div className="unionlist-changes">
                      <b>Detected changes:</b>
                      {loadBioRegionButtons()}
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs={6}>
                    <b>{selectedUnionList1 && unionLists.find(e=>e.idULHeader === parseInt(selectedUnionList1)).Name}</b>
                    <div className="unionlist-table">
                      {tableData1 &&
                        loadTable("tableData1")
                      }
                    </div>
                  </CCol>
                  <CCol xs={6}>
                    <b>{selectedUnionList2 && unionLists.find(e=>e.idULHeader === parseInt(selectedUnionList2)).Name}</b>
                    <div className="unionlist-table">
                      {tableData2 &&
                        loadTable("tableData2")
                      }
                    </div>
                  </CCol>
                </CRow>
              </>
            }
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Reports
