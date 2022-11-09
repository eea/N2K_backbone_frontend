import React, { lazy, useState } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import TableEnvelops from './TableEnvelops';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {ReactComponent as ReactLogo} from './../../../assets/images/harvesting.svg';
import {DataLoader} from '../../../components/DataLoader';

import {
  CButton,
  CSidebar,
  CSidebarNav,
  CCol,
  CContainer,
  CRow,
  CAlert,
  CSpinner
} from '@coreui/react'

import ConfigData from '../../../config.json';

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
    setAlertValues({visible:true, text:text});
    setTimeout(() => {
      setAlertValues({visible:false, text:''});
    }, 4000);
  };

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
    let promises = [];
    let errors = [];
    values = !Array.isArray(values) ? [values] : values;
    for (let i in values) {
      let code = values[i];
      promises.push(
        sendRequest(ConfigData.HARVESTING_CHANGE_STATUS+"?country="+code.country+"&version="+code.version+"&toStatus=Harvested","POST","")
        .then(response => response.json())
        .then(data => {
          if(!data.Success) {
            errors.push(data.Message);
            console.log("Error: " + data.Message);
          }
        })
      )
      Promise.all(promises).then(v=>{
        if(errors.length === 0) {
          showMessage("Envelope successfully harvested");
          setRefreshEnvelopes(true);
        } else {
          showMessage("Something went wrong");
        }
        setUpdatingData(state => ({
          ...state,
          updating: false,
          harvesting: false,
        }));
      });
    }
    setUpdatingData(state => ({
      ...state,
      updating: true,
      harvesting: true,
    }));
  }

  async function discardHandler(values) {
    let promises = [];
    let errors = [];
    values = !Array.isArray(values) ? [values] : values;
    for (let i in values) {
      let code = values[i];
      promises.push(
        sendRequest(ConfigData.HARVESTING_CHANGE_STATUS+"?country="+code.country+"&version="+code.version+"&toStatus=Discarded","POST","")
        .then(response => response.json())
        .then(data => {
          if(!data.Success) {
            errors.push(data.Message);
            console.log("Error: " + data.Message);
          }
        })
      )
      Promise.all(promises).then(v=>{
        if(errors.length === 0) {
          showMessage("Envelope successfully discarded");
          setRefreshEnvelopes(true);
        } else {
          showMessage("Something went wrong");
        }
        setUpdatingData(state => ({
          ...state,
          updating: false,
          discarding: false,
        }));
      });
    }
    setUpdatingData(state => ({
      ...state,
      updating: true,
      discarding: true,
    }));
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="harvesting"/>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Harvesting</li>
            <li className="nav-item">
              <a className="nav-link" href="/#/harvesting/incoming">
                <i className="fa-solid fa-bookmark"></i>
                Incoming
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/harvesting/ready">
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
                <h1 className="h1">Ready to Use</h1>
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
                <CAlert color="primary" dismissible visible={alertValues.visible} onClose={() => setAlertValues({visible:false})}>{alertValues.text}</CAlert>
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
