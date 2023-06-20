import ConfigData from '../../../config.json';
import React, { useState } from 'react'
import { AppHeader } from '../../../components/index'
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
  CFormInput,
} from '@coreui/react'

import mockupMap from './../../../assets/images/sdf_urdaibai.png'
import MapViewer from './components/MapViewer'

  const jsonData = {
   "SiteInfo": {
      "SiteName": "Urdaibaiko Itsasadarra / Ría de Urdaibai",
      "Country": "Spain",
      "Directive": "A",
      "SiteCode": "ES0000144",
      "Area": 3242,
      "Est": 2000,
      "MarineArea": 44.0,
      "Habitats": 16,
      "Species": 122
    },
    "SiteIdentification": {
      "Type": "A",
      "SiteCode": "ES0000144",
      "SiteName": "Urdaibaiko Itsasadarra / Ría de Urdaibai",
      "FirstCompletionDate": "2000-07",
      "UpdateDate": "2021-10",
      "Respondent": {
        "Name/Organisation": "Dirección de Patrimonio Natural y Cambio Climático. Gobierno Vasco",
        "Address": "Dirección",
        "Email": "biodiversidad@euskadi.eus"
      },
      "SiteDesignation": [
        {
          "DateSPA": "2000-11",
          "ReferenceSPA": "DECRETO 358/2013, de 4 de junio, por el que se designan Zonas Especiales de Conservación 4 lugares de importancia comunitaria del ámbito de Urdaibai y San Juan de Gaztelugatxe y se aprueban las medidas de conservación de dichas ZEC y de la ZEPA Ría de Urdaibai: http://www.lehendakaritza.ejgv.euskadi.eus/r48-bopv2/es/bopv2/datos/2013/12/1305570a.pdf"
        },
        {
          "ProposedSCI": "2004-05",
          "ConfirmedSCI": "2004-05",
          "DesignatedSCI": "2004-05",
          "ReferenceSPA": "http://www.likumi.lv/doc.php?id=22697"
        }
      ]
    },
    "SiteLocation": {
      "SiteCentre": {
        "Longitude": -2.694700,
        "Latitude": 43.388000
      },
      "Area": 3242.3100,
      "MarineArea": 44.00,
      "SiteLength": "",
      "Region": {
        "NUTSLevel": "ES21",
        "Name": "País Vasco"
      },
      "BiogeographicalRegions":
        [{"Atlantic":56.2},{"Marine Atlantic":43.98}]
    },
    "EcologicalInformation": {
      "Habitats": [
        {"Coastal and Halophytic Habitats":10},
        {"Coastal sand dunes and inland dunes":3},
        {"Temperate heath and scrub":3},
        {"Sclerophyllous scrub":1},
        {"Natural and semi-natural grassland formations":2},
        {"Rocky habitats and caves":2},
        {"Forests":5},
      ],
      "HabitatsTabular": [
        {"HabitatName":"Sandbanks wich are slightly...",
          "Code": 1110,
          "PF": "",
          "NP": "",
          "Cover": "Birds",
          "Cave": "-",
          "DataQuality": "G",
          "Representativity": "C",
          "RelativeSurface": "",
          "Conservation": "B",
          "Global": "B",
        },
      ],
    },
    "SiteDescription": {},
    "SiteProtectionStatus": {},
    "SiteManagement": {},
    "MapOfTheSite": {}
  }

const SDFVisualization = () => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [data, setData] = useState(jsonData);
  const [activeKey, setActiveKey] = useState(1);

  const showMap = () => {
    //return (<div className='map'><i src={mockupMap} /></div>)
    return (
      <div className='sdf-map'>
        <MapViewer  
          siteCode={"ROSAC0007"} 
          version={0}
          reportedSpatial={"https://bio.discomap.eea.europa.eu/arcgis/rest/services/N2K_Backbone/N2KBackbone/MapServer/0"}
        />
      </div>
    )
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
            {ConfigData.SDI.SiteType[data.SiteInfo.Directive]}
          </div>
        </CRow>
        <CRow className="sdf-indicators">
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
          Site Identification
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          active={activeKey === 2}
          onClick={() => setActiveKey(2)}
        >
          Site Location
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          active={activeKey === 3}
          onClick={() => setActiveKey(3)}
        >
          Ecological Information
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          active={activeKey === 4}
          onClick={() => setActiveKey(4)}
        >
          Site Description
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          active={activeKey === 5}
          onClick={() => setActiveKey(5)}
        >
          Site Protection Status
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          active={activeKey === 6}
          onClick={() => setActiveKey(6)}
        >
          Site Management
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          active={activeKey === 7}
          onClick={() => setActiveKey(7)}
        >
          Map of the Site
        </CNavLink>
      </CNavItem>
    </CNav>
    );
  }
  
  return (
    <div className="container--main min-vh-100">
      <AppHeader page="sdf"/>
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
        {!isLoaded && <em className="loading-container">Loading...</em>}
    </div>
  );
}

const transformData = (activekey, data) => {
  switch(activekey) {
    case 1:
      return data.SiteIdentification;
    case 2:
      return data.SiteLocation;
      // let result = data.SiteLocation;
      // return Object.keys(result)
      //   .map(key =>  {
      //     if(key === "MarineArea"
      //       || key === "BiogeographicalRegion")
      //     return result["%" + key] = result[key]
      //     return result[key]
      // });
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
  }
}

const getPropertyName = (property) => {
  if(property.toLowerCase().includes("area"))
    property.concat(" [ha]")
  if(property.toLowerCase().includes("marinearea"))
    property.concat(" [%]")
  let result = property.split(/(?=[A-Z])/).join(' ').toLowerCase()
  return result[0].toUpperCase() + result.slice(1);
}

const renderTab = (activekey, data) => {
  // TODO make this into a general renderer and transform the data
  // passed to it instead of the view
  let tabTitles = 
    [ "Site Identification", "Site Location",
      "Ecological Information", "Site Description",
      "Site Protection Status", "Site Management", "Map of the Site" ];
  let mData = transformData(activekey, data);

  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CRow className="p-4">
        <h2>{activekey}.{tabTitles[activekey+1]}</h2>
        {Object.entries(mData).map((e,i) => 
          <CRow className="sdf-row">
            <CCol>
              <div className='sdf-row-title'>{activekey + '.' + (i+1) + ' ' + getPropertyName(e[0])}</div>
              {Array.isArray(e[1]) ? e[1].map((a) => 
                <div className="sdf-row-field">
                  {typeof a === 'object' ? Object.entries(a).map(ee => <p><b>{ee[0]}</b>: {ee[1]}</p>) : a[1]}
                </div>
              )
            : <div className="sdf-row-field">
                {typeof e[1] === 'object' ? Object.entries(e[1]).map(ee => <p><b>{ee[0]}</b>: {ee[1]}</p>) : e[1]}
              </div>}
            </CCol>
          </CRow>
        )}
      </CRow>
    </CTabPane>
  );
}

export default SDFVisualization;
