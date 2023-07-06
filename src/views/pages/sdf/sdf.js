import ConfigData from '../../../config.json';
import ConfigSDF from './sdf_config.json';
import DataSDF from './sdf_data.json';
import React, { useState } from 'react'
import { AppHeader } from '../../../components/index'
import {DataLoader} from '../../../components/DataLoader';
import {
  CRow,
  CCol,
  CButton,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'

import MapViewer from '../../../components/MapViewer'

const SDFVisualization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [activeKey, setActiveKey] = useState(1);
  const [siteCode, setSiteCode] = useState("");

  let dl = new(DataLoader);

  const getSiteCode = () => {
    let query = window.location.hash.split("?")[1];
    let params = new URLSearchParams(query);
    let siteCode = params.get("sitecode")
    setSiteCode(siteCode ? siteCode : "ES0000144"); 
  }

  const showMap = () => {
    return (
      <div className='sdf-map'>
        <MapViewer  
          siteCode={"AT1101112"}
          reportedSpatial={ConfigData.REPORTED_SPATIAL}
        />
      </div>
    )
  }

  const loadData = () => {
    if(siteCode !=="" && !isLoading) {
      setIsLoading(true);
      dl.fetch(ConfigData.SITEDETAIL_GET+"?siteCode="+siteCode)
      .then(response =>response.json())
      .then(data => {
        if(data?.Success) {
          if(Object.keys(data.Data).length === 0){
            setData("nodata");
          }
          else {
            setData(DataSDF);
          }
        } else { setErrorLoading(true) }
        setIsLoading(false);
      });
    }
  }
  
  const showMainData = () => {
    return (
      <div className="sdf-header header--custom">
        <CRow className='sdf-title'>
          <CCol className='col-auto'>
            <h1>{data.SiteInfo.SiteName.toUpperCase()}</h1>
          </CCol>
          <CCol className='col-auto ms-auto'>
            <CButton color="white" onClick={()=>{window.print()}}>
              <i className="fa-solid fa-download"></i> Download PDF
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <div>
            {data.SiteInfo.Country}
          </div>
          <div>
            {ConfigSDF.SiteType[data.SiteInfo.Directive]}
          </div>
        </CRow>
        <CRow className="sdf-header-items">
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.SiteCode}</b>
            <div>SITE CODE</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.Area} ha</b>
            <div>AREA</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.Est}</b>
            <div>SITE ESTABLISHED</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.MarineArea} %</b>
            <div>MARINE AREA</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.Habitats}</b>
            <div>HABITATS</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.Species}</b>
            <div>SPECIES</div>
          </CCol>
        </CRow>
      </div>
    );
  }

  const showTabs = () => {
    return (
      <CNav variant="tabs" role="tablist">
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            {ConfigSDF.Titles[0]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 2}
            onClick={() => setActiveKey(2)}
          >
            {ConfigSDF.Titles[1]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 3}
            onClick={() => setActiveKey(3)}
          >
            {ConfigSDF.Titles[2]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 4}
            onClick={() => setActiveKey(4)}
          >
            {ConfigSDF.Titles[3]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 5}
            onClick={() => setActiveKey(5)}
          >
            {ConfigSDF.Titles[4]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 6}
            onClick={() => setActiveKey(6)}
          >
            {ConfigSDF.Titles[5]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 7}
            onClick={() => setActiveKey(7)}
          >
            {ConfigSDF.Titles[6]}
          </CNavLink>
        </CNavItem>
      </CNav>
    );
  }

  if(!siteCode) {
    getSiteCode();
  }

  if(siteCode && Object.keys(data).length === 0) {
    loadData();
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="sdf"/>
        {isLoading ?
          <div className="loading-container"><em>Loading...</em></div>
        :
        siteCode && Object.keys(data).length > 0 &&
          <>
            {showMap()}
            {showMainData()}
            <CContainer fluid>
              <CRow className="p-3">
                {showTabs()}
              </CRow>
              <CTabContent>
                {renderTab(activeKey, data)}
              </CTabContent>
            </CContainer>
          </>
        }
    </div>
  );
}

const transformData = (activekey, data) => {
  switch(activekey) {
    case 1:
      return data.SiteIdentification;
    case 2:
      return data.SiteLocation;
    case 3:
      return data.EcologicalInformation;
    case 4:
      return data.SiteDescription;
    case 5:
      return data.SiteProtectionStatus;
    case 6:
      return data.SiteManagement;
    case 7:
      return data.MapOfTheSite;
  }
}

const tabStructure = (activekey, data) => {
  let fields = [];
  for(let i in Object.entries(data)){
    let field = Object.entries(data)[i];
    let index = activekey + "." + (parseInt(i)+1);
    let title;
    let value;
    let type;
    let layout;

    switch(activekey) {
      case 1:
        switch(field[0]) {
          case "Type":
            title = "Type";
            value = field[1];
            type = "value";
            break;
          case "SiteCode":
            title = "Site Code";
            value = field[1];
            type = "value";
            break;
          case "SiteName":
            title = "Site Name";
            value = field[1];
            type = "value";
            break;
          case "FirstCompletionDate":
            title = "First Compilation date";
            value = field[1];
            type = "value";
            break;
          case "UpdateDate":
            title = "Update date";
            value = field[1];
            type = "value";
            break;
          case "Respondent":
            title = "Respondent";
            value = field[1];
            type = "value";
            break;
          case "SiteDesignation":
            title = "Site indication and designation / classification dates";
            value = field[1];
            type = "array";
            break;
        }
        break;
      case 2:
        switch(field[0]) {
          case "SiteCentre":
            title = "Site-centre location [decimal degrees]";
            value = field[1];
            type = "value";
            layout = 2;
            break;
          case "Area":
            title = "Area [ha]";
            value = field[1];
            type = "value";
            layout = 2;
            break;
          case "MarineArea":
            title = "Marine area [%]";
            value = field[1];
            type = "chart";
            layout = 2;
            break;
          case "SiteLength":
            title = "Sitelength [km] (optional)";
            value = field[1];
            type = "value";
            layout = 2;
            break;
          case "Region":
            title = "Administrative region code and name";
            value = field[1];
            type = "value";
            break;
          case "BiogeographicalRegions":
            title = "Biogeographical Region(s)";
            value = field[1];
            type = "chart";
            break;
        }
        break;
      case 3:
        switch(field[0]) {
          case "HabitatTypes":
            title = "Habitat types present on the site and assessment for them";
            value = field[1];
            type = "combo";
            break;
          case "Species":
            title = "Species referred to in Article 4 of Directive 2009/147/EC and listed in Annex II of Directive 92/43/EEC and site evaluation for them";
            value = field[1];
            type = "combo";
            break;
          case "OtherSpecies":
            title = "Other important species of flora and fauna (optional)";
            value = field[1];
            type = "table";
            break;
        }
        break;
      case 4:
        switch(field[0]) {
          case "GeneralCharacter":
            title = "General site character";
            value = field[1];
            value = value.map(obj => ({"Habitat Class": ConfigSDF.HabitatClasses[obj.Code], ...obj}));
            let total = value.map(a=> a["Cover [%]"]).reduce((a, b) => a + b, 0);
            value.push({"Habitat Class":"Total Habitat Code", "Code":"","Cover [%]":total});
            type = "table";
            break;
          case "Quality":
            title = "Quality and importance";
            value = field[1];
            type = "value";
            break;
          case "Threats":
            title = "Threats, pressures and activities with impacts on the site";
            value = field[1];
            type = "double-table";
            break;
          case "Ownership":
            title = "Ownership (optional)";
            value = field[1];
            type = "table";
            break;
          case "Documentation":
            title = "Documentation (optional)";
            value = field[1];
            type = "array";
            break;
        }
        break;
      case 5:
        switch(field[0]) {
          case "DesignationTypes":
            title = "Designation types at national and regional level (optional)";
            value = field[1];
            type = "array";
            break;
          case "RelationSites":
            title = "Relation of the described site with other sites (optional)";
            value = field[1];
            type = "table";
            break;
          case "SiteDesignation":
            title = "Site designation (optional)";
            value = field[1];
            type = "value";
            break;
        }
        break;
      case 6:
        switch(field[0]) {
          case "BodyResponsible":
            title = "Body(ies) responsible for the site management";
            value = field[1];
            type = "array";
            break;
          case "ManagementPlan":
            title = "Management Plan(s)";
            value = field[1];
            type = "array";
            break;
          case "ConservationMeasures":
            title = "Conservation measures (optional)";
            value = field[1];
            type = "value";
            break;
        }
        break
      case 7:
        switch(field[0]) {
          case "INSPIRE":
            title = "INSPIRE ID";
            value = field[1];
            type = "value";
            break;
          case "MapDelivered":
            title = "Map delivered as PDF in electronic format (optional)";
            value = field[1];
            type = "value";
            break;
        }
    }
    if (!value) {
      value = "No information provided";
    }

    const dataType = (field, type, data) => {
      switch (type) {
        case "value":
          return (
            <div className="sdf-row-field">
              {typeof data === 'object' ? Object.entries(data).map(a => <p><b>{a[0]}</b>: {a[1] ? a[1] : "No information provided"}</p>) : data}
            </div>
          )
        case "array":
          return (
            Array.isArray(data) && data.map((a) => 
              <div className="sdf-row-field">
                {typeof a === 'object' ? Object.entries(a).map(b => <p><b>{b[0]}</b>: {b[1] ? b[1] : "No information provided"}</p>) : a[1]}
              </div>
            )
          )
        case "chart":
          return (
            <div className="piechart-container">
            {Array.isArray(value) ? value.map((a) =>
              Object.entries(a).map(b => 
              <div className="piechart-item">
                <div className="piechart" data-progress={b[1].toFixed(2)} data-label={b[0]} style={{"--progress": (b[1]*360/100+"deg")}}>{b[1]}%</div>
                <label>{b[0]}</label>
              </div>
              )
            )
            : <div className="piechart" data-progress={value.toFixed(2)} style={{"--progress": (value*360/100+"deg")}}>{value}%</div>}
            </div>
          )
        case "table": case "combo":
          let indicators;
          let codes = [];
          var count = {};
          if(type === "combo") {
            if(field === "HabitatTypes") {
              codes = value.map(a=> ConfigSDF.HabitatTypes[parseInt(a.Code.toString().substring(0, 1))]);
            }
            else if(field === "Species") {
              codes = value.map(a=> ConfigSDF.Species[a.Group]);
            }
            codes.forEach((i) => { count[i] = (count[i]||0) + 1;});
            indicators = 
              <CRow className="indicators-container">
                {Object.entries(count).map((a,i)=>
                  <CCol xs={12} md={6} lg={4} xl={3} key={"i_"+[i]}>
                    <div className="indicators-item">
                      <div className="indicators-number">{a[1]}</div>
                      <div className="indicators-title">{a[0]}</div>
                    </div>
                  </CCol>
                )}
              </CRow>
          }
          let tooltips = ConfigSDF.Tooltips;
          let header = Object.keys(value[0]).map(a => { 
            return (
              <th scope="col" key={a}>{a}
                {
                  tooltips[field] && tooltips[field][a] &&
                  <span tooltips={tooltips[field][a]}>
                    <i className="fa-solid fa-circle-info"></i>
                  </span>
                }
              </th>
            )
          });
          let body = value.map((row, i) => {
            return (
              <tr key={"tr_"+i}>
                {Object.keys(value[0]).map((cell, ii) => {
                  return <CTableDataCell key={"tc_"+i+ii}><span>{row[cell]}</span></CTableDataCell>
                })}
              </tr>
            )
          });
          
          return (
          <>
            {type === "combo" && indicators}
            <div className="sdf-row-field">
              <CTable>
                <CTableHead>
                  <CTableRow>
                    {header}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {body}
                </CTableBody>
              </CTable>
            </div>
          </>
          )
        case "double-table":
          let tables = [];
          let indicator;
          let color;
          Object.entries(value).map( a => {
            if(a[0] === "Negative") {
              indicator = {"Threats and pressures":a[1].length};
              color = "red"
            }
            else if (a[0] === "Positive") {
              indicator = {"Activities and Management":a[1].length};
              color = "green";
            }
            a[1] = a[1].map(obj => ({...obj, "Origin": ConfigSDF.Origin[obj.Origin]}));

            let header = Object.keys(a[1][0]).map(b => {return(<CTableHeaderCell scope="col" key={b}> {b} </CTableHeaderCell>)});
            let body = a[1].map((row, i) => {
              return (
                <tr key={"tr_"+i}>
                  {Object.keys(a[1][0]).map((cell, ii) => {
                    return <CTableDataCell key={"tc_"+i+ii}>{row[cell]}</CTableDataCell>
                  })}
                </tr>
              )
            });
            tables.push(
              <CCol xs={12} md={6} lg={6} xl={6}>
                <div className="indicators-container">
                    <div className={"indicators-item " + color}>
                      <div className="indicators-number">{Object.values(indicator)}</div>
                      <div className="indicators-title">{Object.keys(indicator)}</div>
                    </div>
                  <div className="sdf-row-field">
                    <CTable>
                      <CTableHead>
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
            </CRow>
          );
      }
    }
    
    fields.push(
      <CRow className={"sdf-row" + (layout === 2 ? " col-md-6 col-12" : "")}>
        <CCol>
          <div className='sdf-row-title'>{index + ' ' + title}</div>
            {dataType(field[0], type, value)}
        </CCol>
      </CRow>
    );
  }
  return fields;
}

const renderTab = (activekey, data) => {
  let mData = transformData(activekey, data);
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CRow className="p-4">
        <h2>{activekey}.{ConfigSDF.Titles[activekey-1]}</h2>
        {tabStructure(activekey, mData)}
      </CRow>
    </CTabPane>
  );
}

export default SDFVisualization;
