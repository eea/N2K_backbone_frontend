import ConfigData from '../../../config.json';
import ConfigSDF from './sdf_config.json';
import React, { useState, useEffect } from 'react'
import { AppHeader } from '../../../components/index'
import {ReactComponent as NaturaLogo} from './../../../../src/assets/images/natura2000_logo.svg';
import {DataLoader} from '../../../components/DataLoader';
import {
  CRow,
  CCol,
  CButton,
  CContainer,
  CFormSelect,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CHeader,
  CHeaderBrand,
  CAlert
} from '@coreui/react'

import MapViewer from '../../../components/MapViewer'

const SDFVisualization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [siteCode, setSiteCode] = useState("");
  const [release, setRelease] = useState("");
  const [releases, setReleases] = useState([]);
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
    if(nav && !isLoading && siteCode && siteCode !== "nodata" && Object.keys(data).length !== 0 && !errorLoading) {
      scrollTo(nav);
    }
  }, [isLoading]);

  let dl = new(DataLoader);

  const getSiteCode = () => {
    let query = window.location.hash.split("?")[1];
    let params = new URLSearchParams(query);
    let sitecode = params.get("sitecode");
    let release = params.get("release");
    let nav = params.get("nav");
    setSiteCode(sitecode ? sitecode : "nodata");
    setRelease(release ? parseInt(release) : "");
    setNav(nav);
  }

  const showMap = () => {
    return (
      <div className='sdf-map px-4 pb-5'>
        <MapViewer
          siteCode={siteCode}
          mapSubmission={ConfigData.MAP_REFERENCE}
        />
      </div>
    )
  }

  const loadData = () => {
    if(siteCode !== "" && !isLoading) {
      setIsLoading(true);
      let url = ConfigData.GET_SDF_RELEASE_DATA;
      if(release) {
        url += "?siteCode=" + siteCode + "&releaseId=" + release;
      }
      else {
        url += "?siteCode=" + siteCode;
      }
      dl.fetch(url)
      .then(response =>response.json())
      .then(data => {
        if(data?.Success) {
          if(!data.Data.SiteInfo.SiteCode) {
            setData("nodata");
          }
          else {
            let releases = data.Data.SiteInfo.Releases.sort((a, b) => b.ReleaseId - a.ReleaseId);
            setReleases(releases);
            setData(formatData(data));
            if(!release) {
              let release = releases[0].ReleaseId;
              setRelease(release);
              window.location.hash = "#/sdf-release?sitecode=" + siteCode + "&release=" + release;
            }
          }
        }
        else {
          setErrorLoading(true);
        }
        setIsLoading(false);
      });
    }
    else {
      setData("nodata");
      setIsLoading(false);
    }
  }

  const formatData = (data) => {
    let siteCentre = Object.fromEntries(Object.entries(data.Data.SiteLocation).filter(([key, value]) => key==="Latitude" || key==="Longitude"));
    data.Data.SiteLocation.Longitude = siteCentre;
    delete data.Data.SiteLocation.Latitude;
    let siteCharacter = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key==="GeneralCharacter" || key==="OtherCharacteristics"));
    data.Data.SiteDescription.GeneralCharacter = siteCharacter;
    delete data.Data.SiteDescription.OtherCharacteristics;
    let threats = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key==="NegativeThreats" || key==="PositiveThreats"));
    data.Data.SiteDescription.NegativeThreats = threats;
    delete data.Data.SiteDescription.PositiveThreats;
    let documents = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key==="Documents" || key==="Links"));
    data.Data.SiteDescription.Documents = documents;
    delete data.Data.SiteDescription.Links;
    return data.Data;
  }
  
  const showMainData = () => {
    return (
      <CContainer fluid>
        <CRow className="sdf-title p-4">
          <CCol className='col-auto'>
            <div>
              Site code: <b>{data.SiteInfo.SiteCode}</b>
            </div>
            <div>
              Site name: <b>{data.SiteInfo.SiteName}</b>
            </div>
          </CCol>
          <CCol className='col-auto ms-auto'>
            <CButton color="primary" onClick={()=>{window.print()}}>
              <i className="fa-solid fa-download"></i> Download PDF
            </CButton>
          </CCol>
        </CRow>
        <CRow className="sdf-index p-4">
          <CCol>
            <h2>Table of contents</h2>
            <ol>
              {Object.keys(data).filter(a => a !== "SiteInfo").map((a, i) => <a href="#" data-id={i+1} key={i} onClick={(e) => scrollTo(e.currentTarget.dataset.id)}><li>{ConfigSDF.Titles[i]}</li></a>)}
            </ol>
          </CCol>
        </CRow>
      </CContainer>
    );
  }

  if(!siteCode) {
    getSiteCode();
  }

  if(!isLoading && siteCode && siteCode !== "nodata" && Object.keys(data).length === 0 && !errorLoading) {
    loadData();
  }

  const changeRelease = (release) => {
    window.location.hash = "#/sdf-release?sitecode=" + siteCode + "&release=" + release;
    setSiteCode("");
    setRelease("");
    setData([]);
    setErrorLoading(false);
  }

  return (
    <div className="container--main min-vh-100">
      <CHeader className='header--custom'>
        <CRow className='align-items-center'>
          <CCol className="header__title">
            <CHeaderBrand href="#" target="_blank">Natura Change Manager</CHeaderBrand>
          </CCol>
        </CRow>
      </CHeader>
      <CContainer fluid>
        <CRow className="p-4">
          <CCol>
            <div className="sdf-general">
              <div className="sdf-head">
                <NaturaLogo/>
                <div>
                  <h1>NATURA 2000 - STANDARD DATA FORM - <span className="sensitive">SENSITIVE</span></h1>
                  <b>RELEASE {release && releases.length > 0 && releases.find(a => a.ReleaseId === release)?.ReleaseName}</b>
                </div>
              </div>
              <div className="select--right">
                <CFormSelect aria-label="Select release" className="form-select-reporting" disabled={isLoading || siteCode === "nodata" || releases.length === 0} value={releases.find(a => a.ReleaseId === release) ? release : ""} onChange={(e) => {changeRelease(e.currentTarget.value)}}>
                  <option hidden disabled value="">Select a release</option>
                  {
                    releases.map((e)=><option value={e.ReleaseId} key={e.ReleaseId}>{e.ReleaseName + " (" + formatDate(e.ReleaseDate, true) + ")"}</option>)
                  }
                </CFormSelect>
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
          {showMainData()}
          <CContainer fluid>
            <CTabContent>
              {renderSections(data)}
              {showMap()}
            </CTabContent>
          </CContainer>
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

const scrollTo = (item) => {
  event.stopPropagation();
  event.preventDefault();
  let element = document.getElementById(item).parentNode;
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

const sectionsContent = (activekey, data) => {
  let fields = [];
  for(let i in Object.entries(data)){
    let field = Object.entries(data)[i];
    let index = activekey + "." + (parseInt(i)+1);
    let title;
    let value;
    let type;
    let layout;
    let legend;

    switch(activekey) {
      case 1:
        switch(field[0]) {
          case "Type":
            title = "Type";
            value = field[1];
            type = "single";
            break;
          case "SiteCode":
            title = "Site Code";
            value = field[1];
            type = "single";
            break;
          case "SiteName":
            title = "Site Name";
            value = field[1];
            type = "single";
            break;
          case "FirstCompletionDate":
            title = "First Compilation date";
            value = field[1];
            type = "single";
            break;
          case "UpdateDate":
            title = "Update date";
            value = field[1];
            type = "single";
            break;
          case "Respondent":
            title = "Respondent";
            value = field[1];
            type = "single";
            break;
          case "SiteDesignation":
            title = "Site indication and designation / classification dates";
            value = field[1][0];
            let tableHeader = ConfigSDF.TableHeader.SiteDesignationGroup;
            let filter = (obj, keys) => keys.reduce((a, b) => (a[b] = obj[b], a), {});
            let explanations = filter(value, tableHeader.e);
            value = [filter(value, tableHeader.a), filter(value, tableHeader.b)];
            if(explanations.Explanations) {
              value.push(explanations);
            }
            type = "multiple";
            break;
        }
        break;
      case 2:
        switch(field[0]) {
          case "Longitude":
            title = "Site-centre location [decimal degrees]";
            value = field[1];
            type = "single";
            break;
          case "Area":
            title = "Area [ha]";
            value = field[1];
            type = "single";
            break;
          case "MarineArea":
            title = "Marine area [%]";
            value = field[1];
            type = "single";
            break;
          case "SiteLength":
            title = "Sitelength [km] (optional)";
            value = field[1];
            type = "single";
            break;
          case "Region":
            title = "Administrative region code and name";
            value = field[1];
            type = "table";
            break;
          case "BiogeographicalRegions":
            title = "Biogeographical Region(s)";
            value = field[1];
            type = "table";
            break;
        }
        break;
      case 3:
        switch(field[0]) {
          case "HabitatTypes":
            title = "Habitat types present on the site and assessment for them";
            value = field[1];
            type = "table";
            legend = ConfigSDF.Legend.HabitatTypes;
            break;
          case "Species":
            title = "Species referred to in Article 4 of Directive 2009/147/EC and listed in Annex II of Directive 92/43/EEC and site evaluation for them";
            value = field[1];
            var filters = ["AnnexIV", "AnnexV", "OtherCategoriesA", "OtherCategoriesB", "OtherCategoriesC", "OtherCategoriesD"];
            value.map(a => filters.forEach(b => delete a[b]));
            type = "table";
            legend = ConfigSDF.Legend.Species;
            break;
          case "OtherSpecies":
            title = "Other important species of flora and fauna (optional)";
            value = field[1];
            var filters = ["Type", "DataQuality", "Population", "Conservation", "Isolation", "Global"];
            value.map(a => filters.forEach(b => delete a[b]));
            type = "table";
            legend = ConfigSDF.Legend.OtherSpecies;
            break;
        }
        break;
      case 4:
        switch(field[0]) {
          case "GeneralCharacter":
            title = "General site character";
            value = field[1].GeneralCharacter;
            value = value.map(obj => ({"Code": obj.Code, "HabitatClass": ConfigSDF.HabitatClasses[obj.Code], "Cover": obj.Cover}));
            let total = value.map(a => a["Cover"]).reduce((a, b) => a + b, 0);
            value.push({ "Code": "","HabitatClass": "Total Habitat Cover", "Cover": parseFloat((total).toFixed(4))});
            legend = field[1].OtherCharacteristics;
            type = "table";
            break;
          case "Quality":
            title = "Quality and importance";
            value = field[1];
            type = "single";
            break;
          case "NegativeThreats":
            title = "Threats, pressures and activities with impacts on the site";
            value = field[1];
            type = "double-table";
            legend = ConfigSDF.Legend.Threats;
            break;
          case "Ownership":
            title = "Ownership (optional)";
            value = field[1];
            if(value.length) {
              let tableHeader = ConfigSDF.TableHeader.OwnershipType;
              let val = [];
              value.forEach(item => {
                let check = Object.entries(tableHeader).find(a => a[1].toLowerCase().includes(item.Type.toLowerCase()));
                if(check) {
                  item.Type = check[0];
                }
                let found = val.find(a => a.Type === item.Type);
                if(found) {
                  found.Percent += item.Percent;
                }
                else{
                  val.push({"Type": item.Type,"Percent": item.Percent});
                }
              });
              value = Object.keys(tableHeader).map(a => ({"Type": tableHeader[a], "Percent": val.filter(b => b.Type===a).length ? val.find(b => b.Type === a).Percent : 0}));
              let total = value.map(a => a["Percent"]).reduce((a, b) => a + b, 0);
              value.push({"Type": "Total","Percent": parseFloat((total).toFixed(4))});
            }
            type = "table";
            break;
          case "Documents":
            title = "Documentation (optional)";
            value = field[1];
            if(!value.Links?.length) {
              delete value.Links;
              if(!value.Documents) {
                value = null;
              }
            }
            type = "single";
            break;
        }
        break;
      case 5:
        switch(field[0]) {
          case "DesignationTypes":
            title = "Designation types at national and regional level (optional)";
            value = field[1];
            type = "table";
            break;
          case "RelationSites":
            title = "Relation of the described site with other sites (optional)";
            value = field[1];
            type = "table";
            break;
          case "SiteDesignation":
            title = "Site designation (optional)";
            value = field[1];
            type = "single";
            break;
        }
        break;
      case 6:
        switch(field[0]) {
          case "BodyResponsible":
            title = "Body(ies) responsible for the site management";
            value = field[1];
            type = "multiple";
            break;
          case "ManagementPlan":
            title = "Management Plan(s)";
            value = field[1];
            type = "check"
            break;
          case "ConservationMeasures":
            title = "Conservation measures (optional)";
            value = field[1];
            type = "single";
            break;
        }
        break
      case 7:
        switch(field[0]) {
          case "INSPIRE":
            title = "INSPIRE ID";
            value = field[1];
            type = "single";
            break;
          case "MapDelivered":
            title = "Map delivered as PDF in electronic format (optional)";
            value = field[1];
            type = "single";
            break;
        }
    }
    if ((!value || value.length === 0) && value !== 0) {
      value = "No information provided";
      type = "single";
    }
    let labels = ConfigSDF[field[0]]; 
    if(labels) {
      if(Array.isArray(value)) {
        value = value.map(a => {let b = {}; Object.keys(a).forEach(key => b[labels[key]] = a[key] ? (isNaN(a[key]) && !isNaN(Date.parse(a[key].replaceAll(' ',""))) ? formatDate(a[key]) : a[key]) : a[key]); return b});
      }
      else if(type === "double-table") {
        let c = {};
        Object.keys(value).forEach(i => c[i] = value[i].map(a => {let b = {}; Object.keys(a).forEach(key => b[ConfigSDF[i][key]] = a[key]); return b}))
        value = c;
      }
      else if (typeof value === 'object' && type !== "double-table") {
        let b = {};
        Object.keys(value).forEach(key => b[labels[key]] = value[key] ? (isNaN(value[key]) && !isNaN(Date.parse(value[key].replaceAll(' ',""))) ? formatDate(value[key]) : value[key]) : value[key]);
        value = b;
      }
    }
    else {
      value = typeof value !== 'object' && isNaN(value) && !isNaN(Date.parse(value.replaceAll(' ',""))) ? formatDate(value) : value;
    }

    const parseLinks = (text) => {
      const reg = new RegExp(/(^|\s)(https?:\/\/[^\s]+|www\.[^\s]+|[\w-]+\.com[^\s]*)/g, 'gi');
      let parts = text;
      if(isNaN(text)) {
        parts = !Array.isArray(text) ? text.split(reg) : text;
        return parts.map((part, i) => (part.match(reg) ? <a className="sdf-link" href={part} target="_blank" key={i+"_"+part}>{part}</a> : part));
      }
      else {
        return parts;
      }
    }

    const dataType = (field, type, data) => {
      switch (type) {
        case "single":
          return (
            <div className="sdf-row-field">
              {typeof data === 'object' ? Object.entries(data).map(a => <p key={"v_"+a}><b>{a[0]}</b>: {a[1] ? parseLinks(a[1]) : "No information provided"}</p>) : parseLinks(data)}
            </div>
          )
        case "multiple":
          return (
            Array.isArray(data) && data.map((a, i) => 
              <div className="sdf-row-field" key={"a_"+i}>
                {typeof a === 'object' ? Object.entries(a).map(b => <p key={"b_"+b}><b>{b[0]}</b>: {b[1] ? parseLinks(b[1]) : "No information provided"}</p>) : parseLinks(a[1])}
              </div>
            )
          )
        case "table":
          let header = Object.keys(value[0]).map(a => { 
            return (
              <th scope="col" key={a}>{a}</th>
            )
          });
          let checkCellLink = (cell, value) => {
            if(field === "HabitatTypes" && cell === "Code") {
              value = <a href={"https://eunis.eea.europa.eu/habitats_code2000/" + value} target="blank">{value}</a>
            }
            else if((field === "Species" || field === "OtherSpecies") && cell === "Scientific Name" && value !== "-") {
              value = <a href={"https://eunis.eea.europa.eu/species/" + value} target="blank">{value}</a>
            }
            else if((field === "Species" || field === "OtherSpecies") && cell === "Code" && value !== "-") {
              value = <a href={"https://eunis.eea.europa.eu/species_code2000/" + value} target="blank">{value}</a>
            }
            return value;
          }
          let body = value.map((row, i) => {
            let color;
            if((field === "Species" || field === "OtherSpecies") && Object.entries(row).find(a => a[0] === "S" && a[1] === "Yes")) {
              color = ConfigSDF.Colors.Red;
            }
            return (
              <tr style={{backgroundColor: color ? color : ""}} key={"tr_"+i}>
                {Object.keys(value[0]).map((cell, ii) => {
                  return <CTableDataCell key={"tc_"+i+ii}><span>{checkCellLink(cell, row[cell])}</span></CTableDataCell>
                })}
              </tr>
            )
          });
          let tableHeader = ConfigSDF.TableHeader[field];
          return (
            <>
              <div className="sdf-row-field">
                <CTable>
                  <CTableHead>
                    {tableHeader &&
                      <CTableRow>
                        {tableHeader.map((a, i) => 
                          <th colSpan={a.span} key={"th_"+i}>
                            {a.text}
                          </th>
                        )}
                      </CTableRow>
                    }
                    <CTableRow>
                      {header}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {body}
                  </CTableBody>
                </CTable>
              </div>
              {legend &&
                (field === "GeneralCharacter" ? 
                  <>
                    <div className="sdf-legend mt-2">
                      <b>Other Site Characteristics</b>
                    </div>
                    <div className="sdf-row-field">
                      {typeof legend === 'object' ? Object.entries(legend).map(a => <p key={"v_"+a}><b>{a[0]}</b>: {a[1] ? parseLinks(a[1]) : "No information provided"}</p>) : parseLinks(legend)}
                    </div>
                  </>
                  :
                  <div className="sdf-legend mt-2">
                    {Object.keys(legend).map(a => <div key={a}><b>{a}: </b>{legend[a]}</div>)}
                  </div>
                )
              }
            </>
          )
        case "double-table":
          let tables = [];
          Object.entries(value).map(a => {
            let header = a[1].length > 0 ? Object.keys(a[1][0]).map(b => {return(<CTableHeaderCell scope="col" key={b}> {b} </CTableHeaderCell>)}) : null;
            let body = a[1].length > 0 && a[1].map((row, i) => {
              return (
                <tr key={"tr_"+i}>
                  {Object.keys(a[1][0]).map((cell, ii) => {
                    return <CTableDataCell key={"tc_"+i+ii}>{row[cell]}</CTableDataCell>
                  })}
                </tr>
              )
            });
            if(!body.length) {
              body = <tr><td>No data</td></tr> ;
            }
            let tableHeader = ConfigSDF.TableHeader[a[0]];
            tables.push(
              <CCol xs={12} md={6} lg={6} xl={6} key={a[0]}>
                <div className="mb-2">
                  <div className="sdf-row-field">
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          {tableHeader.map((a, i) => 
                            <th colSpan={a.span} key={"th_"+i}>
                              {a.text}
                            </th>
                          )}
                        </CTableRow>
                        <CTableRow>
                          {header}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {body}
                      </CTableBody>
                    </CTable>
                  </div>
                </div>
              </CCol>
            );
          });
          return (
            <CRow>
              {tables}
              {legend &&
                <div className="sdf-legend">
                  {Object.keys(legend).map(a => <div key={a}><b>{a}: </b>{legend[a]}</div>)}
                </div>
              }
            </CRow>
          );
        case "check":
          let options = ConfigSDF.TableHeader.ManagementPlan;
          let checked = value[0].Exists ? value[0].Exists : "N";
          let check = options.map((a, i) => {
            return (
              <div key={"m_" + i}>
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id={"management_check_"+i} disabled checked={checked === a.value}/>
                  <label htmlFor={"management_check_"+i} className="input-label">{a.text}</label>
                </div >
                {checked === "Y" && checked === a.value &&
                  Array.isArray(data) && data.map((a, i) => 
                    <div className="mb-3" key={"a_"+i}>
                      {typeof a === 'object' ? Object.entries(a).map(b => b[0] !== "Exists" && <p className="mb-1" key={"b_"+b}><b>{b[0]}</b>: {b[1] ? parseLinks(b[1]) : "No information provided"}</p>) : parseLinks(a[1])}
                    </div>
                  )
                }
              </div>
            )
          });
          return (
            <div className="sdf-row-field">
              {check}
            </div>
          )
      }
    }
    
    fields.push(
      <CRow className={"sdf-row" + (layout === 2 ? " col-md-6 col-12" : "")} key={index}>
        <CCol>
          <div className='sdf-row-title'>{index + ' ' + title}</div>
          {dataType(field[0], type, value)}
        </CCol>
      </CRow>
    );
  }
  return fields;
}

const renderSections = (data) => {
  let sections = [];
  Object.keys(data).filter(a => a !== "SiteInfo").forEach((item, i) => {
    sections.push(
      <CRow className="p-4" key={i}>
        <div id={i+1}>
          <h2>{i+1}. {ConfigSDF.Titles[i]}</h2>
          {sectionsContent(i+1, data[item])}
        </div>
      </CRow>
    )
  });
  return sections;
}

export default SDFVisualization;
