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

  const jsonData = {
   "SiteInfo": {
      "SiteName": "Urdaibaiko Itsasadarra / Ría de Urdaibai",
      "Country": "Spain",
      "Directive": "Birds Directive",
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
      "FirstComplDate": "2000-07",
      "UpdateDate": "2021-10",
      "Respondent": {
        "Name/Organisation": "Dirección de Patrimonio Natural y Cambio Climático. Gobierno Vasco",
        "Address": "Dirección",
        "Email": "biodiversidad@euskadi.eus"
      },
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
      "BioRegions":
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
    return (<div><i src={mockupMap} /></div>)
  }
  
  const showMainData = () => {
    return (
      <div className="header header--custom">
      <CRow className="p-3">
        <CCol>
          <b>{data.SiteInfo.SiteName.toUpperCase()}</b>
        </CCol>
        <CCol>
          <CButton>
            <i className="fa-light fa-download"></i> Download PDF
          </CButton>
        </CCol>
      </CRow>
      <CRow className="p-3">
        <CRow>
          {data.SiteInfo.Country}
        </CRow>
        <CRow>
          {data.SiteInfo.Directive}
        </CRow>
      </CRow>
      <CRow className="p-3">
        <CRow>
          <CCol><b>{data.SiteInfo.SiteCode}</b></CCol>
          <CCol><b>{data.SiteInfo.Area} ha</b></CCol>
          <CCol><b>{data.SiteInfo.Est}</b></CCol>
          <CCol><b>{data.SiteInfo.MarineArea} %</b></CCol>
          <CCol><b>{data.SiteInfo.Habitats}</b></CCol>
          <CCol><b>{data.SiteInfo.Species}</b></CCol>
        </CRow>
        <CRow>
          <CCol>SITE CODE</CCol>
          <CCol>AREA</CCol>
          <CCol>SITE ESTABLISHED</CCol>
          <CCol>MARINE AREA</CCol>
          <CCol>HABITATS</CCol>
          <CCol>SPECIES</CCol>
        </CRow>
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
  
  const showTabContent = (activeKey) => {
    switch(activeKey) {
      case 1:
        return renderIdentification(activeKey, data.SiteIdentification);
      case 2:
        return renderLocation(activeKey, data.SiteLocation);
      case 3:
        return renderEcological(activeKey, data.EcologicalInformation);
      case 4:
        return renderDescription(activeKey, data.SiteDescription);
      case 5:
        return renderProtectionStatus(activeKey, data.SiteProtectionStatus);
      case 6:
        return renderManagement(activeKey, data.SiteManagement);
      case 7:
        return renderMapSite(activeKey, data.MapOfTheSite);
    }
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
              {showTabContent(activeKey)}
            </CTabContent>
          </CContainer>
        {!isLoaded && <em className="loading-container">Loading...</em>}
    </div>
  );
}

const renderIdentification = (activekey, data) => {
  // TODO make this into a general renderer and transform the data
  // passed to it instead of the view
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CCol className="p-4">
        <CRow><b>{activekey}.Site Identification</b></CRow>
        {Object.entries(data).map((e,i) => 
        <>
          <CRow><b>{activekey + '.' + (i+1) + ' ' + e[0]}</b></CRow>
          {typeof e[1] === 'object' ?
            <div className="form-control">
              {Object.entries(e[1]).map(ee => <p><b>{ee[0]}</b>: {ee[1]}</p>)}
            </div>
          : <div className="form-control">{e[1]}</div>
          }
        </>
        )}
      </CCol>
    </CTabPane>
  );
}

const renderLocation = (activekey, data) => {
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CCol className="p-3">
        <b>2.Site Location</b>
      </CCol>
    </CTabPane>
  );
}

const renderEcological = (activekey, data) => {
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CCol className="p-3">
        <b>3.Ecological Information</b>
      </CCol>
    </CTabPane>
  );
}

const renderDescription = (activekey, data) => {
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CCol className="p-3">
        <b>4.Site Description</b>
      </CCol>
    </CTabPane>
  );
}

const renderProtectionStatus = (activekey, data) => {
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CCol className="p-3">
        <b>5.Site Protection Status</b>
      </CCol>
    </CTabPane>
  );
}

const renderManagement = (activekey, data) => {
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CCol className="p-3">
        <b>6.Site Management</b>
      </CCol>
    </CTabPane>
  );
}

const renderMapSite = (activekey, data) => {
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CCol className="p-3">
        <b>7.Map of the Site</b>
      </CCol>
    </CTabPane>
  );
}

export default SDFVisualization;
