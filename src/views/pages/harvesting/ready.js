import React, { lazy, useState } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import TableEnvelops from './TableEnvelops';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {ReactComponent as ReactLogo} from './../../../assets/images/harvesting.svg';
import {DataLoader} from '../../../components/DataLoader';
import {HubConnectionBuilder} from '@microsoft/signalr';

import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CAlert,
  CSpinner
} from '@coreui/react'

import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';

import { ConfirmationModal } from './components/ConfirmationModal';

let refreshEnvelopes=false, 
  getRefreshEnvelopes=()=>refreshEnvelopes, 
  setRefreshEnvelopes=(state)=>refreshEnvelopes=state;

const Harvesting = () => {
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [updatingData, setUpdatingData] = useState({
    updating: false,
    harvesting: false,
    discarding: false
  });
  const [alertValues, setAlertValues] = useState({
    visible: false,
    text: '',
    color: 'primary'
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
  let dl = new(DataLoader);
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
    showHarvestModal(values) {
      updateModalValues("Harvest Envelopes", "This will harvest these envelopes", "Continue", () => harvestHandler(values), "Cancel", () => modalProps.close);
    },
    showDiscardModal(values) {
      updateModalValues("Discard Envelopes", "This will discard these envelopes", "Continue", () => discardHandler(values), "Cancel", () => modalProps.close);
    }
  }

  const showMessage = (text) => {
    setAlertValues({visible:true, text:text, color:'primary'});
    messageTimeOut();
  };

  const showErrorMessage = (text) => {
    setAlertValues({visible:true, text:text, color:'danger'})
    messageTimeOut();
  }

  const messageTimeOut = () => {
    setTimeout(() => {
      setAlertValues({visible:false, text:'', color:'primary'});
    }, UtilsData.MESSAGE_TIMEOUT);
  }

  const sendRequest = (url,method,body,path) => {
    const options = {
      method: method,
      headers: {
      'Content-Type': path? 'multipart/form-data' :'application/json',
      },
      body: path ? body : JSON.stringify(body),
    };
    return dl.fetch(url, options)
  }

  async function harvestHandler(values) {
    let errors = [];
    values = !Array.isArray(values) ? [values] : values;
    let rBody = {
      "countryVersion": values.map(v => ({ "CountryCode": v.country, "VersionId": v.version })),
      "toStatus": "Harvested"
    }
    sendRequest(ConfigData.HARVESTING_CHANGE_STATUS,"POST",rBody)
    .then(response => response.json())
    .then(data => {
      if(!data?.Success) {
        errors.push(data.Message);
        console.log("Error: " + data.Message);
      }
      if(errors.length === 0) {
        showMessage("Envelope successfully harvested");
        setRefreshEnvelopes(true);
      } else {
        showErrorMessage("Something went wrong");
      }
      setUpdatingData(state => ({
        ...state,
        updating: false,
        harvesting: false,
      }));
    })
    setUpdatingData(state => ({
      ...state,
      updating: true,
      harvesting: true,
    }));
  }

  async function discardHandler(values) {
    let errors = [];
    values = !Array.isArray(values) ? [values] : values;
    let rBody = {
      "countryVersion": values.map(v => ({ "CountryCode": v.country, "VersionId": v.version })),
      "toStatus": "Discarded"
    }
    let countryVersion = [];
    const signalR_connection = new HubConnectionBuilder()
    .withUrl(ConfigData.SERVER_API_ENDPOINT + "ws/", {
      withCredentials: false
    })                        
    .build();
    let start = async() => {
      try {
        await signalR_connection.start();
        sendRequest(ConfigData.HARVESTING_CHANGE_STATUS,"POST",rBody)
        .then(response => response.json())
        .then(data => {
          if(!data?.Success) {
            errors.push(data.Message);
            console.log("Error: " + data.Message);
            showErrorMessage("Something went wrong");
            setUpdatingData(state => ({
              ...state,
              updating: false,
              discarding: false,
            }));
            signalR_connection.stop();
          }
        });
        setUpdatingData(state => ({
          ...state,
          updating: true,
          discarding: true,
        }));
      } catch (error) {
        console.log(error);
        showErrorMessage("Something went wrong");
        signalR_connection.stop();
      }
    };
    signalR_connection.on("ToProcessing", (message) => {
      message = JSON.parse(message);
      if(rBody.countryVersion.some(a => a.CountryCode === message.CountryCode && a.VersionId === message.VersionId)) {
        countryVersion.push(message);
      }
      if(rBody.countryVersion.sort().toString() === countryVersion.sort().toString()) {
        showMessage("Envelope successfully discarded, next submission will be ‘Ready to use’ soon");
        setRefreshEnvelopes(true);
        setUpdatingData(state => ({
          ...state,
          updating: false,
          discarding: false,
        }));
        signalR_connection.stop();
      }
    });
    start();
  }

  const page = UtilsData.SIDEBAR["harvesting"].find(a => a.option === "ready");

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="harvesting"/>
      <div className="content--wrapper">
        <AppSidebar
          title="Harvesting"
          options={UtilsData.SIDEBAR["harvesting"]}
          active={page.option}
        />
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">{page.name}</h1>
                {page.description &&
                  <div className="page-description">{page.description}</div>
                }
              </div>
              <div>
                <ul className="btn--list">
                  <li>
                    <CButton color="secondary" disabled={disabledBtn || updatingData.updating} onClick={() => modalProps.showDiscardModal(selectedCodes)}>
                      {updatingData.discarding && <CSpinner size="sm"/>}
                      {updatingData.discarding ? " Discarding" : "Discard"}
                    </CButton>
                  </li>
                  <li>
                    <CButton color="primary" disabled={disabledBtn || updatingData.updating} onClick={() => modalProps.showHarvestModal(selectedCodes)}>
                      {updatingData.harvesting && <CSpinner size="sm"/>}
                      {updatingData.harvesting ? " Harvesting" : "Harvest"}
                    </CButton>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center mb-4">
              <ReactLogo className="harvesting-chart" id="ready_chart"/>
            </div>
            <CRow>
              <CCol md={12} lg={12}>
                <CAlert color={alertValues.color} dismissible visible={alertValues.visible} onClose={() => setAlertValues({visible: false, text: '', color: 'primary'})}>{alertValues.text}</CAlert>
                <TableEnvelops
                  getRefresh={()=>getRefreshEnvelopes()}
                  setRefresh={setRefreshEnvelopes}
                  setSelected={setSelectedCodes}
                  modalProps={modalProps}
                  tableType="ready"
                  status="PreHarvested"
                />
                <ConfirmationModal modalValues={modalValues}/>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Harvesting
