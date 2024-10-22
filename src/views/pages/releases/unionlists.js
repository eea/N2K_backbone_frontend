import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import {DataLoader} from '../../../components/DataLoader';
import TableUnionLists from './TableUnionLists';
import ScrollContainer from 'react-indiana-drag-scroll';

import {
  CAlert,
  CCol,
  CContainer,
  CRow,
  CButton,
  CPagination,
  CPaginationItem,
  CSpinner,
} from '@coreui/react'

const Releases = () => {
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  let dl = new(DataLoader);

  const messageTimeOut = () => {
    setTimeout(() => {
      setDownloadError(false);
    }, UtilsData.MESSAGE_TIMEOUT);
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
            if(data?.Success) {
              if(Object.keys(data.Data).length > 0){
                setBioRegions(data.Data);
                bioRegionsData = data.Data;
              }
            }
          })
        );
      }
      if(bioRegionsSummary.length === 0) {
        promises.push(
          dl.fetch(ConfigData.UNIONLISTS_SUMMARY)
          .then(response =>response.json())
          .then(data => {
            if(data?.Success) {
              if(data.Count === 0){
                setBioRegionsSummary(data.Data.BioRegionSummary);
                setPageResults(data.Count);
                setTableData1("nodata");
                setTableData2("nodata");
              }
              else if(Object.keys(data.Data).length > 0){
                setBioRegionsSummary(data.Data.BioRegionSummary);
                let terrestrial = bioRegionsData.filter(b=>!b.isMarine).map(a=>a.BioRegionShortCode);
                let results = data.Data.BioRegionSummary.filter(a=>terrestrial.includes(a.BioRegion)).map(a=>a.Count).reduce((a, b) => a + b);
                setPageResults(results);
                setActiveBioregions(data.Data.BioRegionSummary.filter(a=>a.Count>0 && terrestrial.includes(a.BioRegion)).map(a=>a.BioRegion).toString());
              }
              setIsLoading(false);
            }
          })
        );
      }
      else if(!tableDataLoading || (tableData1.length === 0 && tableData2.length === 0)) {
        if(activeBioregions==="") return;
        setTableDataLoading(true);
        promises.push(
          dl.fetch(ConfigData.UNIONLISTS_COMPARER+"?page="+pageNumber+"&limit="+pageSize + (activeBioregions && "&bioregions="+activeBioregions))
          .then(response => response.json())
          .then(data => {
            if(data?.Success) {
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
    let terrestrial = [];
    let marine = [];
    for(let i in bioRegionsSummary){
      let region = bioRegionsSummary[i];
      let regionName = bioRegions.find(a=>a.BioRegionShortCode === region.BioRegion).RefBioGeoName;
      let isMarine = bioRegions.find(a=>a.BioRegionShortCode === region.BioRegion).isMarine;
      let button = 
        <CButton color={activeBioregions.includes(region.BioRegion) || region.Count === 0 ? "primary" : "secondary"} key={region.BioRegion} disabled={tableDataLoading || region.Count===0} size="sm" onClick={(e)=>filterBioRegion(e)} data-type={isMarine ? "marine" : "terrestrial"} data-count={region.Count} value={region.BioRegion}>
          {region.Count + " " + regionName}
        </CButton>
      if(isMarine) {
        marine.push(button);
      }
      else {
        terrestrial.push(button);
      }
    }
    
    return (
      <>
        <div>
          <div className="checkbox mb-2">
              <input type="checkbox" className="input-checkbox" id="union_terrestrial"
                onClick={(e)=>(filterRegions(e))}
                disabled={tableDataLoading}
                defaultChecked={true}
                data-type="terrestrial"
              />
              <label htmlFor="union_terrestrial" className="input-label">
                <b>Terrestrial regions</b>
              </label>
            </div>
          <div className="unionlist-changes">
            {terrestrial}
          </div>
        </div>
        <div>
          <div className="checkbox mb-2">
            <input type="checkbox" className="input-checkbox" id="union_marine"
              onClick={(e)=>(filterRegions(e))}
              disabled={tableDataLoading}
              defaultChecked={false}
              data-type="marine"
            />
            <label htmlFor="union_marine" className="input-label">
              <b>Marine regions</b>
            </label>
          </div>
          <div className="unionlist-changes">
            {marine}
          </div>
        </div>
      </>
    );
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

  const filterRegions = (e) => {
    let filter;
    let results;
    let type = e.currentTarget.dataset.type;
    let regions = document.querySelectorAll(".unionlist-changes .btn[data-type='"+type+"']:not([data-count='0'])");
    regions = Array.from(regions).map(a => a.value);
    let active = activeBioregions.split(",").filter(a=>a!=="nodata");
    if(e.currentTarget.checked) {
      filter = active.concat(regions.filter(a=>!active.includes(a))).toString();
    }
    else {
      filter = active.filter(e=>!regions.includes(e)).toString();
    }
    if(filter === "") {
      filter = "nodata";
      results = 0;
      setTableData1("nodata");
      setTableData2("nodata");
    }
    else {
      results = filter.split(",").map(a=>bioRegionsSummary.find(b=>b.BioRegion==a).Count).reduce((a, b) => a + b);
      setTableData1([]);
      setTableData2([]);
    }
    setPageNumber(1);
    setPageResults(results);
    setActiveBioregions(filter);
  }

  const filterBioRegion = (e) => {
    let filter;
    let results;
    let value = e.currentTarget.value;
    let type = e.currentTarget.dataset.type;
    let regions = document.querySelectorAll(".unionlist-changes .btn[data-type='"+type+"']:not([data-count='0'])").length;
    let active = document.querySelectorAll(".unionlist-changes .btn.btn-primary[data-type='"+type+"']:not([data-count='0'])").length;
    if(activeBioregions.includes(value)) {
      filter = activeBioregions.split(",").filter(a=>a!==value).toString();
      results = pageResults - bioRegionsSummary.find(a=>a.BioRegion === value).Count;
      active--;
    }
    else {
      filter = activeBioregions.split(",").filter(a=>a!=="nodata").concat(value).toString();
      results = pageResults + bioRegionsSummary.find(a=>a.BioRegion === value).Count;
      active++;
    }
    if(active === 0) {
      document.querySelector("#union_" + type).indeterminate = false;
      document.querySelector("#union_" + type).checked = false;
    }
    else {
      if(regions > active) {
        document.querySelector("#union_" + type).indeterminate = true;
        document.querySelector("#union_" + type).checked = false;
      }
      else {
        document.querySelector("#union_" + type).indeterminate = false;
        document.querySelector("#union_" + type).checked = true;
      }
    }
    if(filter === "") {
      filter = "nodata";
      results = 0;
      setTableData1("nodata");
      setTableData2("nodata");
    }
    else {
      setTableData1([]);
      setTableData2([]);
    }
    setPageNumber(1);
    setPageResults(results);
    setActiveBioregions(filter);
  }

  let resizeIframe = () => {
    let width = document.querySelector(".main-content").offsetWidth/2 - 32;
    setTableWidth(width);
  }

  useEffect(() => {
    if((tableData1.length > 0 && tableData1 !== "nodata") && (tableData2.length > 0 && tableData2 !== "nodata") && document.querySelectorAll(".unionlist-table")[0] && document.querySelectorAll(".unionlist-table")[1]){
      let heading1 = document.querySelectorAll(".unionlist-table")[0].querySelectorAll("th");
      let heading2 = document.querySelectorAll(".unionlist-table")[1].querySelectorAll("th");
      heading1.forEach((th,i) => {
        let th2 = heading2[i];
        let width = Math.max(th.offsetWidth, th2.offsetWidth);
        th.style.width = width + "px";
        th2.style.width = width + "px";
      });
      tableScroll()
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

  const downloadUpdatedUnionLists = () => {
    let regions = bioRegionsSummary.filter(a=>a.Count > 0).map(a=>a.BioRegion).toString();
    setIsDownloading(true);
    dl.fetch(ConfigData.UNIONLISTS_DOWNLOAD+"?bioregs="+regions)
      .then(data => {
        if(data?.ok) {
          const regExp = /filename="(?<filename>.*)"/;
          const filename = regExp.exec(data.headers.get('Content-Disposition'))?.groups?.filename ?? null;
          data.blob()
            .then(blobresp => {
              downloadFile(filename, blobresp);
            })
        } else {
          setDownloadError(true);
          messageTimeOut();
        }
        setIsDownloading(false);
      });
  }

  const downloadUnionLists = () => {
    setIsDownloadingAll(true);
    dl.fetch(ConfigData.UNIONLISTS_DOWNLOAD)
      .then(data => {
        if(data?.ok) {
          const regExp = /filename="(?<filename>.*)"/;
          const filename = regExp.exec(data.headers.get('Content-Disposition'))?.groups?.filename ?? null;
          data.blob()
            .then(blobresp => {
              downloadFile(filename, blobresp);
            })
        } else {
          setDownloadError(true);
          messageTimeOut();
        }
        setIsDownloadingAll(false);
      });
  }

  const downloadFile = (filename, blobresp) => {
    var blob = new Blob([blobresp], { type: "octet/stream" });
    var url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  !isLoading && (!tableData || (tableData1.length === 0 && tableData2.length === 0)) && loadData();

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="releases"/>
      <div className="content--wrapper">
        <AppSidebar
          title="Releases"
          options={UtilsData.SIDEBAR["releases"]}
          active="unionlists"
        />
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Union Lists</h1>
                {downloadError &&
                  <CAlert color="danger">An error occurred while downloading</CAlert>
                }
              </div>
              <div>
                <ul className="btn--list">
                  <li>
                    <CButton color="primary"
                    disabled={isLoading && !tableData || isDownloading || isDownloadingAll || tableData1 == "nodata" || tableData2 == "nodata"}
                    onClick={()=>downloadUpdatedUnionLists()}>
                      {isDownloading && <CSpinner size="sm"/>}
                      {isDownloading ? " Downloading Updated Union Lists" : "Download Updated Union Lists"}
                    </CButton>
                  </li>
                  <li>
                    <CButton color="primary"
                    disabled={isLoading && !tableData || (isDownloading || isDownloadingAll || bioRegionsSummary.length === 0)}
                    onClick={()=>downloadUnionLists()}>
                      {isDownloadingAll && <CSpinner size="sm"/>}
                      {isDownloadingAll ? " Downloading Union Lists" : "Download Union Lists"}
                    </CButton>
                  </li>
                </ul>
              </div>
            </div>
            {isLoading && !tableData ?
              <div className="loading-container"><em>Loading...</em></div>
            : (bioRegionsSummary.length === 0 ? 
                <div className="nodata-container"><em>No Data</em></div>
              :
                <>
                  <CRow>
                    <CCol>
                      {loadBioRegionButtons()}
                    </CCol>
                  </CRow>
                  {tableDataLoading ? 
                    <div className="loading-container"><em>Loading...</em></div>
                  :
                    <>
                      <CRow>
                        <CCol xs={6}>
                          <b>Last Official Release</b>
                          <ScrollContainer hideScrollbars={false} className="scroll-container unionlist-table" style={{width: tableWidth}}>
                            {tableData1.length > 0 &&
                              <TableUnionLists data={tableData1} colors={false}/>
                            }
                          </ScrollContainer>
                        </CCol>
                        <CCol xs={6}>
                          <b>Submission</b>
                          <ScrollContainer hideScrollbars={false} className="scroll-container unionlist-table" style={{width: tableWidth}}>
                          {tableData2.length > 0 &&
                              <TableUnionLists data={tableData2} colors={true}/>
                            }
                          </ScrollContainer>
                        </CCol>
                      </CRow>
                      {pageResults > 0 &&
                        <div className="table-footer mt-3">
                          <div className="table-legend">
                            <div className="table-legend--item">
                              <span className="table-legend--color" style={{backgroundColor: UtilsData.COLORS.Red}}></span>
                              <span className="table-legend--label">Deleted/Decreased/Priority changed</span>
                            </div>
                            <div className="table-legend--item">
                              <span className="table-legend--color" style={{backgroundColor: UtilsData.COLORS.Green}}></span>
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
                      }
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
