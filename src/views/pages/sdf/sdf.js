import ConfigData from '../../../config.json';
import ConfigSDF from './sdf_config.json';
import React, { useState, useEffect } from 'react'
import { AppHeader } from '../../../components/index'
import {ReactComponent as NaturaLogo} from './../../../../src/assets/images/natura2000_logo.svg';
import {DataLoader} from '../../../components/DataLoader';
import SDFStructure from "./SDFStructure";
import SDFLegacyStructure from "./SDFLegacyStructure";
import {
  CRow,
  CCol,
  CButton,
  CContainer,
  CFormSelect,
  CHeader,
  CHeaderBrand,
  CAlert
} from '@coreui/react'

const SDFVisualization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [siteCode, setSiteCode] = useState("");
  const [type, setType] = useState("");
  const types = [{"type": "reference", "name": "Reference"}, {"type": "submission", "name": "Submission"}, {"type": "lastofficial", "name": "Last Official Release"}];
  const [nav, setNav] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if(window.scrollY === 0) {
        setShowScrollBtn(false);
      }
      else {
        setShowScrollBtn(true);
      }
    });
  }, []);

  useEffect(() => {
    if(nav && !isLoading && siteCode && siteCode !== "nodata" && data !== "nodata" && !errorLoading) {
      scrollTo(nav);
    }
  }, [isLoading]);

  let dl = new(DataLoader);

  const getSiteCode = () => {
    let query = window.location.hash.split("?")[1];
    let params = new URLSearchParams(query);
    let sitecode = params.get("site");
    let type = params.get("type");
    let nav = params.get("nav");
    if(sitecode && !type) {
      type = "reference";
      window.location.hash = "#/sdf?site=" + sitecode + "&type=" + type;
    }
    setType(type);
    setSiteCode(sitecode ? sitecode : "nodata");
    setNav(nav);
  }

  const getMapUrl = () => {
    switch(type) {
      case "reference":
        return ConfigData.MAP_REFERENCE
      case "submission":
        return ConfigData.MAP_SUBMISSION
      case "lastofficial":
        return ConfigData.MAP_RELEASES
    }
  }

  const getRelease = () => {
    switch(type) {
      case "lastofficial":
        return data.SiteInfo.Releases.sort((a, b) => new Date(b.ReleaseDate) - new Date(a.ReleaseDate))[0].ReleaseId;
      default:
        return false;
    }
  }

  const loadData = () => {
    if(siteCode !== "" && !isLoading) {
      setIsLoading(true);
      if(type === "lastofficial") {
        let releaseUrl = ConfigData.GET_LAST_RELEASE_ID + "?siteCode=" + siteCode;
        dl.fetch(releaseUrl)
        .then(response => response.json())
        .then(releaseData => {
          if(releaseData?.Success) {
            let releaseId = releaseData.Data;
            let url = ConfigData.GET_SDF_RELEASE_DATA + (releaseId < 100 ? "Legacy" : "") + "?siteCode=" + siteCode;
            dl.fetch(url)
            .then(response => response.json())
            .then(data => {
              if(data?.Success) {
                if(!data.Data.SiteInfo.SiteCode) {
                  setData("nodata");
                }
                else {
                  setData(formatData(data));
                }
              }
              else {
                setErrorLoading(true);
              }
              setIsLoading(false);
            });
          }
          else {
            setErrorLoading(true);
            setIsLoading(false);
          }
        });
      }
      else {
        let url = ConfigData.GET_SDF_DATA + "?siteCode=" + siteCode + "&submission=" + types.map(item => item.type).indexOf(type);
        dl.fetch(url)
        .then(response => response.json())
        .then(data => {
          if(data?.Success) {
            if(!data.Data.SiteInfo.SiteCode) {
              setData("nodata");
            }
            else {
              setData(data.Data);
            }
          }
          else {
            setErrorLoading(true);
          }
          setIsLoading(false);
        });
      }
    }
    else {
      setData("nodata");
      setIsLoading(false);
    }
  }

  const formatData = (data) => {
    let siteCentre = Object.fromEntries(Object.entries(data.Data.SiteLocation).filter(([key, value]) => key === "Latitude" || key === "Longitude"));
    data.Data.SiteLocation.Longitude = siteCentre;
    delete data.Data.SiteLocation.Latitude;
    let siteCharacter = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key === "GeneralCharacter" || key === "OtherCharacteristics"));
    data.Data.SiteDescription.GeneralCharacter = siteCharacter;
    delete data.Data.SiteDescription.OtherCharacteristics;
    let threats = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key === "NegativeThreats" || key === "PositiveThreats"));
    data.Data.SiteDescription.NegativeThreats = threats;
    delete data.Data.SiteDescription.PositiveThreats;
    let documents = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key === "Documents" || key === "Links"));
    data.Data.SiteDescription.Documents = documents;
    delete data.Data.SiteDescription.Links;
    return data.Data;
  }

  if(!siteCode) {
    getSiteCode();
  }

  if(!isLoading && siteCode && siteCode !== "nodata" && Object.keys(data).length === 0 && !errorLoading) {
    loadData();
  }

  const changeType = (type) => {
    window.location.hash = "#/sdf?site=" + siteCode + "&type=" + type;
    setSiteCode("");
    setType("");
    setData([]);
    setErrorLoading(false);
  }

  const scrollTo = (item) => {
    event.stopPropagation();
    event.preventDefault();
    let element = document.getElementById(item);
    const y = element.getBoundingClientRect().top + window.scrollY;
    window.history.pushState(null, null, window.location.href.split("&nav")[0] + "&nav=" + item);
    window.scroll({
      top: y,
      behavior: 'instant'
    });
  }

  const formatDate = (date, ddmmyyyy) => {
    date = new Date(date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    if(ddmmyyyy) {
      date = (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
    }
    else {
      date = (y + '-' + (m <= 9 ? '0' + m : m));
    }
    return date;
  };

  return (
    <div className="sdf container--main min-vh-100">
      <CHeader className="header--custom">
        <CRow className="align-items-center">
          <CCol className="header__title">
            <CHeaderBrand href="#" target="_blank">Natura Change Manager</CHeaderBrand>
          </CCol>
        </CRow>
      </CHeader>
      <CContainer fluid className="sdf-header">
        <CRow className="p-4">
          <CCol>
            <div className="sdf-head">
              <NaturaLogo/>
              <div>
                <h1>NATURA 2000 - STANDARD DATA FORM</h1>
                <b>{type && types.find(a => a.type === type).name}</b>
                {type === "lastofficial" && !isLoading && data !== "nodata" && Object.keys(data).length > 0 && !errorLoading &&
                  <b> ({formatDate(data.SiteInfo.Releases.sort((a, b) => new Date(b.ReleaseDate) - new Date(a.ReleaseDate))[0].ReleaseDate, true)})</b>
                }
                {
                  !isLoading && siteCode && siteCode !== "nodata" && data !== "nodata" && Object.keys(data).length > 0 && !errorLoading &&
                  <h2>{data.SiteInfo.SiteName} ({data.SiteInfo.SiteCode} - {ConfigSDF.SiteType[data.SiteInfo.SiteType ?? data.SiteInfo.Directive]})</h2>
                }
              </div>
              <div className="select--right">
                <CFormSelect aria-label="Select type" className="form-select-reporting" disabled={isLoading || errorLoading || siteCode === "nodata"} value={type} onChange={(e) => {changeType(e.currentTarget.value)}}>
                  {
                    types.map((e)=><option value={e.type} key={e.type}>{e.name}</option>)
                  }
                </CFormSelect>
                {
                  !isLoading && siteCode && siteCode !== "nodata" && data !== "nodata" && Object.keys(data).length > 0 && !errorLoading &&
                  <CButton color="primary" onClick={()=>{window.print()}}>
                    <i className="fa-solid fa-download"></i> Download PDF
                  </CButton>
                }
              </div>
            </div>
          </CCol>
        </CRow>
      </CContainer>
      {(errorLoading && !isLoading) &&
        <CContainer fluid>
          <CRow className="p-4">
            <CAlert color="danger">Error loading data</CAlert>
          </CRow>
        </CContainer>
      }
      {isLoading ?
        <div className="loading-container"><em>Loading...</em></div>
      :
      siteCode === "nodata" || data === "nodata" ? <div className="nodata-container"><em>No Data</em></div> :
      siteCode && Object.keys(data).length > 0 &&
        <>
          {type === "lastofficial" && getRelease() < 100 ?
            <SDFLegacyStructure
              data={data}
              siteCode={siteCode}
              release={getRelease()}
              mapUrl={getMapUrl()}
            ></SDFLegacyStructure>
            :
            <SDFStructure
              data={data}
              siteCode={siteCode}
              release={getRelease()}
              mapUrl={getMapUrl()}
            ></SDFStructure>
          }
        </>
      }
      {showScrollBtn &&
        <div className="sdf-scroll">
          <CButton color="primary" onClick={() => window.scroll({top: 0, behavior: 'instant'})}>
            <i className="fas fa-arrow-up"></i>
          </CButton>
        </div>
      }
    </div>
  );
}

export default SDFVisualization;
