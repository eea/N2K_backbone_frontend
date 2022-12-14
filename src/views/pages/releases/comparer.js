import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';
import TableUnionLists from './TableUnionLists';
import ScrollContainer from 'react-indiana-drag-scroll';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CButton,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from '@coreui/react'

const Releases = () => {
  const [releaseList, setReleaseList] = useState([]);
  const [releaseList2, setReleaseList2] = useState([]);
  const [selectedRelease1, setSelectedRelease1] = useState();
  const [selectedRelease2, setSelectedRelease2] = useState();
  const [compare, setCompare] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bioRegions, setBioRegions] = useState([]);
  const [bioRegionsSummary, setBioRegionsSummary] = useState([]);
  const [activeBioregions, setActiveBioregions] = useState("");
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [tableData, setTableData] = useState(false);
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [tableWidth, setTableWidth] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageResults, setPageResults] = useState();
  let dl = new(DataLoader);

  let loadUnionLists = () => {
    setIsLoading(true);
    dl.fetch(ConfigData.RELEASES_GET)
    .then(response =>response.json())
    .then(data => {
      if(Object.keys(data.Data).length > 0){
        setReleaseList(data.Data);
      }
      setIsLoading(false);
    });
  }

  const compareReleases = () => {
    setTableData(false);
    setActiveBioregions([]);
    setTableData1([]);
    setTableData2([]);
    setBioRegionsSummary([]);
    setCompare(true);
    setPageNumber(1);
  }

  let loadData = () => {
    if(!isLoading && (tableData1.length === 0 && tableData2.length === 0)) {
      let promises = [];
      setIsLoading(true);
      let bioRegionsData = [];
      if(bioRegions.length === 0) {
        promises.push(
          dl.fetch(ConfigData.RELEASES_BIOREGIONS)
          .then(response =>response.json())
          .then(data => {
            if(Object.keys(data.Data).length > 0){
              setBioRegions(data.Data);
              bioRegionsData = data.Data;
            }
          })
        );
      }
      if(bioRegionsSummary.length === 0) {
        promises.push(
          dl.fetch(ConfigData.RELEASES_SUMMARY+"idSource="+selectedRelease1+"&idTarget="+selectedRelease2)
          .then(response =>response.json())
          .then(data => {
            if(Object.keys(data.Data).length > 0){
              setBioRegionsSummary(data.Data.BioRegionSummary);
              setPageResults(data.Count);
              setActiveBioregions(data.Data.BioRegionSummary.filter(a=>a.Count>0).map(a=>a.BioRegion).toString());
            }
          })
        );
      }
      if (activeBioregions === "nodata") {
        setTableData1("nodata");
        setTableData2("nodata");
      }
      else if(!tableDataLoading || (tableData1.length === 0 && tableData2.length === 0)) {
        setTableDataLoading(true);
        promises.push(
          dl.fetch(ConfigData.RELEASES_COMPARER+"?page="+pageNumber+"&limit="+pageSize+(activeBioregions && "&bioregions="+activeBioregions)+"&idSource="+selectedRelease1+"&idTarget="+selectedRelease2)
          .then(response => response.json())
          .then(data => {
            if(Object.keys(data.Data).length > 0 && tableData1.length === 0 && tableData2.length === 0) {
              let bioReg = bioRegions.length === 0 ? bioRegionsData : bioRegions;
              let dataTable1 = [];
              let dataTable2 = [];
              for(let i in data.Data) {
                let row = data.Data[i];
                let rowTable1 = {};
                let rowTable2 = {};
                Object.keys(row).forEach((key) => {
                  let value = row[key]?.Source === undefined ? row[key] : row[key]?.Source;
                  if(key === "BioRegion") {
                    value = bioReg.find(a=>a.BioRegionShortCode === value).RefBioGeoName;
                  }
                  if(row.Changes === "ADDED" && (key === "BioRegion" || key === "Sitecode")) {
                    value = "";
                  }
                  else if(key === "Priority") {
                    value = value !== null && (value ? "Yes" : "No");
                  }
                  rowTable1[key] = value;
                });
                dataTable1.push(rowTable1);
                Object.keys(row).forEach((key) => {
                  let value;
                  if((row.Changes === "ADDED" || row.Changes === "DELETED")) {
                    value = row[key]?.Target === undefined ? row[key] : row[key]?.Target;
                    if(key === "Priority") {
                      value = value !== null && (value ? "Yes" : "No");
                    }
                    if(key === "BioRegion") {
                      value = bioReg.find(a=>a.BioRegionShortCode === value).RefBioGeoName;
                    }
                    if(row.Changes === "DELETED" && (key === "BioRegion" || key === "Sitecode")) {
                      value = "";
                    }
                  }
                  else {
                    if(row[key]?.Change === null) {
                      value = row[key]?.Target === undefined ? row[key] : row[key]?.Target;
                      if(key === "Priority") {
                        value = value !== null && (value ? "Yes" : "No");
                      }
                    }
                    else {
                      value = row[key];
                      if(key === "Priority") {
                        value.Source = value.Source ? "Yes" : "No";
                        value.Target = value.Target ? "Yes" : "No";
                      }
                    }
                    if(key === "BioRegion") {
                      value = bioReg.find(a=>a.BioRegionShortCode === value).RefBioGeoName;
                    }
                  }
                  rowTable2[key] = value;
                });
                dataTable2.push(rowTable2);
              }
              setTableData1(dataTable1);
              setTableData2(dataTable2);
            }
          })
        );
      }
      Promise.all(promises).then(v=>{
        setIsLoading(false);
        setTableData(true);
        setTableDataLoading(false);
      });
    }
  }

  const loadBioRegionButtons = () => {
    let buttons = [];
    for(let i in bioRegionsSummary){
      let region = bioRegionsSummary[i];
      let regionName = bioRegions.find(a=>a.BioRegionShortCode === region.BioRegion).RefBioGeoName;
      buttons.push(
        <CButton color={activeBioregions.includes(region.BioRegion) || region.Count === 0 ? "primary" : "secondary"} key={region.BioRegion} disabled={tableDataLoading || region.Count===0} size="sm" onClick={(e)=>filterBioRegion(e)} value={region.BioRegion}>
          {region.Count + " " + regionName}
        </CButton>
      );
    }
    return buttons;
  }

  const gotoPage = (page, size) => {
    setTableData1([]);
    setTableData2([]);
    page && setPageNumber(page);
    if(size) {
      setPageNumber(1);
      setPageSize(size);
    }
  }

  const filterBioRegion = (e) => {
    let value = e.currentTarget.value;
    let filter;
    let results;
    if(activeBioregions.includes(value)) {
      filter = activeBioregions.split(",").filter(a=>a!==value).toString();
      results = pageResults - bioRegionsSummary.find(a=>a.BioRegion === value).Count;
      if(filter === "")
        filter = "nodata";
    }
    else {
      filter = activeBioregions.split(",").concat(value).toString();
      results = pageResults + bioRegionsSummary.find(a=>a.BioRegion === value).Count;
      if(activeBioregions.includes("nodata"))
        filter = filter.split(",").filter(a=>a!=="nodata").toString();
    }
    setPageNumber(1);
    setPageResults(results);
    setActiveBioregions(filter);
    setTableData1([]);
    setTableData2([]);
  }

  let resizeIframe = () => {
    let width = document.querySelector(".main-content").offsetWidth/2 - 32;
    setTableWidth(width);
  }

  useEffect(() => {
    if(tableData1.length > 0 && tableData2.length > 0 && document.querySelectorAll(".unionlist-table")[0] && document.querySelectorAll(".unionlist-table")[1]){
      let heading1 = document.querySelectorAll(".unionlist-table")[0].querySelectorAll("th");
      let heading2 = document.querySelectorAll(".unionlist-table")[1].querySelectorAll("th");
      heading1.forEach((th,i) => {
        let th2 = heading2[i];
        let width = Math.max(th.offsetWidth, th2.offsetWidth)
        th.style.width = width + "px";
        th2.style.width = width + "px";
      });
      tableScroll();
      resizeIframe();
      window.addEventListener('resize', resizeIframe);
    }
  });

  let tableScroll = () => {
    var ignoreScrollEvents = false;
    var s1 = document.querySelectorAll(".unionlist-table")[0];
    var s2 = document.querySelectorAll(".unionlist-table")[1];
    let select_scroll1 = (e) => {
      var ignore = ignoreScrollEvents
      ignoreScrollEvents = false
      if (ignore) return
      ignoreScrollEvents = true
      s2.scrollLeft = s1.scrollLeft;
    }
    let select_scroll2 = (e) => {
      var ignore = ignoreScrollEvents
      ignoreScrollEvents = false
      if (ignore) return
      ignoreScrollEvents = true
      s1.scrollLeft = s2.scrollLeft;
    }
    s1.addEventListener('scroll', select_scroll1, false);
    s2.addEventListener('scroll', select_scroll2, false);
  }

  let selectRelease1 = (release) => {
    setSelectedRelease1(release);
    let list2 = releaseList.filter((e) => 0 < e.CreateDate.localeCompare(releaseList.find((e) => e.ID == release).CreateDate));
    setReleaseList2(list2);
    if(list2.length === 0){
      setSelectedRelease2("noData");
    }
    else{
      setSelectedRelease2("default");
    }
  }

  releaseList.length === 0 && !isLoading && loadUnionLists();

  compare && (tableData1.length === 0 && tableData2.length === 0) && loadData();

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
              <a className="nav-link active" href="/#/releases/comparer">
                <i className="fa-solid fa-bookmark"></i>
                Release Comparer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/unionlists">
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
                <h1 className="h1">Release Comparer</h1>
              </div>
            </div>
            <CRow>
              <CCol>
                <div className="unionlist-compare">
                  <b>Compare</b>
                  <CFormSelect aria-label="Default select example" className='form-select-reporting' defaultValue="default" disabled={isLoading} onChange={(e)=>selectRelease1(e.target.value)}>/
                    <option disabled value="default" hidden>Select a Release</option>
                    {
                      releaseList.map((e)=><option value={e.ID} key={"c1-"+e.ID}>{e.Title}</option>)
                    }
                  </CFormSelect>
                  <div>
                    <i className="fa-solid fa-code-compare"></i>
                  </div>
                  <CFormSelect aria-label="Default select example" className='form-select-reporting' defaultValue={!selectedRelease2 && "default" || selectedRelease2 ==="noData" && "noData"} value={selectedRelease2 === "noData" ? "noData" : selectedRelease2} disabled={isLoading || !selectedRelease1 || selectedRelease2 === "noData"} onChange={(e)=>setSelectedRelease2(e.target.value)}>
                    <option disabled value="default" hidden>Select a Release</option>
                    {
                      selectedRelease1 &&
                      releaseList2.map((e)=><option value={e.ID} key={"c2-"+e.ID}>{e.Title}</option>)
                    }
                    <option disabled value="noData" hidden>No releases</option>
                  </CFormSelect>
                  <CButton color="primary" onClick={()=>compareReleases()} disabled={!selectedRelease1 || (selectedRelease2 === "noData" || selectedRelease2 === "default" ) || isLoading}>
                    Compare
                  </CButton>
                </div>
              </CCol>
            </CRow>
            {compare &&
              (isLoading && !tableData ?
                <div className="loading-container"><em>Loading...</em></div>
              :
                <>
                  <CRow>
                    <CCol>
                      <div className="unionlist-changes">
                        <b>Detected changes:</b>
                        {loadBioRegionButtons()}
                      </div>
                    </CCol>
                  </CRow>
                  {tableDataLoading ? 
                    <div className="loading-container"><em>Loading...</em></div>
                  :
                    <>
                      <CRow>
                        <CCol xs={6}>
                          <b>Previous Release</b>
                          <ScrollContainer hideScrollbars={false} className="scroll-container unionlist-table" style={{width: tableWidth}}>
                            {tableData1.length > 0 &&
                              <TableUnionLists data={tableData1} colors={false}/>
                            }
                          </ScrollContainer>
                        </CCol>
                        <CCol xs={6}>
                          <b>Current</b>
                          <ScrollContainer hideScrollbars={false} className="scroll-container unionlist-table" style={{width: tableWidth}}>
                            {tableData2.length > 0 &&
                              <TableUnionLists data={tableData2} colors={true}/>
                            }
                          </ScrollContainer>
                        </CCol>
                      </CRow>
                      <div className="table-footer mt-3">
                        <div className="table-legend">
                          <div className="table-legend--item">
                            <span className="table-legend--color" style={{backgroundColor: ConfigData.Colors.Red}}></span>
                            <span className="table-legend--label">Deleted/Decreased/Priority changed</span>
                          </div>
                          <div className="table-legend--item">
                            <span className="table-legend--color" style={{backgroundColor: ConfigData.Colors.Green}}></span>
                            <span className="table-legend--label">Added/Increased</span>
                          </div>
                        </div>
                        <CPagination>
                          <CPaginationItem onClick={() => gotoPage(1, null)} disabled={pageNumber === 1}>
                            <i className="fa-solid fa-angles-left"></i>
                          </CPaginationItem>
                          <CPaginationItem onClick={() => gotoPage(pageNumber-1, null)} disabled={pageNumber === 1}>
                            <i className="fa-solid fa-angle-left"></i>
                          </CPaginationItem>
                          <span>
                            Page{' '}
                            <strong>
                              {pageNumber} of {Math.ceil(pageResults / Number(pageSize))}
                            </strong>{' '}
                            ({pageResults === 1 ? pageResults + " result" : pageResults + " results"})
                          </span>
                          <CPaginationItem onClick={() => gotoPage(pageNumber+1, null)} disabled={pageNumber === Math.ceil(pageResults / Number(pageSize))}>
                            <i className="fa-solid fa-angle-right"></i>
                          </CPaginationItem>
                          <CPaginationItem onClick={() => gotoPage(Math.ceil(pageResults / Number(pageSize)), null)} disabled={pageNumber === Math.ceil(pageResults / Number(pageSize))}>
                            <i className="fa-solid fa-angles-right"></i>
                          </CPaginationItem>
                          <div className='pagination-rows'>
                            <label className='form-label'>Rows per page</label>
                            <select
                              className='form-select'
                              value={pageSize}
                              onChange={e => {
                                gotoPage(null,Number(e.target.value))
                              }}
                            >
                              {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                  {pageSize}
                                </option>
                              ))}
                            </select>
                          </div>
                        </CPagination>
                      </div>
                    </>
                  }
                </>
              )
            }
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Releases
