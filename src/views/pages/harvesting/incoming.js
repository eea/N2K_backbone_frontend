import React, { lazy, useState } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import TableEnvelops from './TableEnvelops';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {ReactComponent as ReactLogo} from './../../../assets/images/harvesting.svg';

import {
  CButton,
  CSidebar,
  CSidebarNav,
  CCol,
  CContainer,
  CRow,
  CAlert
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';

const Harvesting = () => {
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [alertValues, setAlertValues] = useState({
    visible: false,
    text: ''
  });
  const [modalValues, setModalValues] = useState({
    visibility: false,
    close: () => {
      setModalValues((prevState) => ({
        ...prevState,
        visibility: false
      }));
    }
  });

  let selectedCodes = [],
  setSelectedCodes = (v) => {
    if(document.querySelectorAll('input[sitecode]:checked').length !== 0 && v.length === 0) return;
    selectedCodes = v;
    if (selectedCodes.length === 0) {
      setDisabledBtn(true)
    } else {
      setDisabledBtn(false)
    }
  };

  function updateModalValues(title, text, primaryButtonText, primaryButtonFunction, secondaryButtonText, secondaryButtonFunction) {
    setModalValues({
      visibility: true,
      title: title,
      text: text,
      primaryButton: (
        primaryButtonText && primaryButtonFunction ? {
          text: primaryButtonText,
          function: () => primaryButtonFunction(),
        }
        : ''
      ),
      secondaryButton: (
        secondaryButtonText && secondaryButtonFunction ? {
          text: secondaryButtonText,
          function: () => secondaryButtonFunction(),
        }
        : ''
      ),
    });
  }

  let modalProps = {
    showAlert(text) {
      setAlertValues({
        visibility: true,
        text: text
      });
    },
    showHarvestModal(values) {
      updateModalValues("Harvest Envelopes", "This will harvest this envelope", "Continue", () => harvestHandler(values), "Cancel", () => modalProps.close);
    },
    showDiscardModal(values) {
      updateModalValues("Discard Envelopes", "This will discard this envelope", "Continue", () => discardHandler(values), "Cancel", () => modalProps.close);
    }
  }

  async function harvestHandler(values) {
    let versionId = values.versionId;
    let countryCode = values.countryCode;
    // var harvested =[{"VersionId": versionId, "CountryCode": countryCode}];
    // const response = await fetch(ConfigData.HARVESTING_HARVEST, {
    //   method: 'POST',
    //   body: JSON.stringify(harvested),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'accept': 'application/json'
    //   }
    // });
    // const data = await response.json();
    // if (data.Success)  {
    //   modalProps.showAlert("Envelope successfully harvested");
    // }
    // else 
    //   console.log("Error:" + data.Message);
  }

  async function discardHandler(values) {
    let versionId = values.versionId;
    let countryCode = values.countryCode;
    // var harvested =[{"VersionId": versionId, "CountryCode": countryCode}];
    // const response = await fetch(ConfigData.HARVESTING_DISCARD, {
    //   method: 'POST',
    //   body: JSON.stringify(harvested),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'accept': 'application/json'
    //   }
    // });
    // const data = await response.json();
    // if (data.Success)  {
    //   modalProps.showAlert("Envelope successfully discarded");
    // }
    // else 
    //   console.log("Error:" + data.Message);
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="harvesting"/>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Harvesting</li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/harvesting/incoming">
                <i className="fa-solid fa-bookmark"></i>
                Incoming
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/ready">
                <i className="fa-solid fa-bookmark"></i>
                Ready to Use
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/progress">
                <i className="fa-solid fa-bookmark"></i>
                In Progress
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/processed">
                <i className="fa-solid fa-bookmark"></i>
                Processed
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/all">
                <i className="fa-solid fa-bookmark"></i>
                All
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Incoming</h1>
              </div>
              <div>
                <ul className="btn--list">
                  <li><CButton color="secondary" disabled={disabledBtn} onClick={() => modalProps.showDiscardModal(selectedCodes)}>Discard</CButton></li>
                </ul>
              </div>
            </div>
            <div className="text-center mb-4">
              <ReactLogo className="harvesting-chart" id="incoming_chart"/>
            </div>
            <CRow>
              <CCol md={12} lg={12}>
                <TableEnvelops setSelected={setSelectedCodes} modalProps={modalProps} tableType="incoming"/>
                <ConfirmationModal modalValues={modalValues}/>
                <CAlert color="primary" dismissible visible={alertValues.visible} onClose={() => setAlertValues({visible:false})}>{alertValues.text}</CAlert>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Harvesting
