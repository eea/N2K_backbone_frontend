import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import TablePeriod from './TablePeriod';
import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CButton,
  CForm,
  CAlert,
  CSpinner
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';

const ReportingPeriod = () => {
  const [refresh,setRefresh] = useState(false);
  const [periods,setPeriods] = useState(["current", "passed"]);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage]  = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalValues, setModalValues] = useState({
    visibility: false,
    message: {
      text: null,
    },
    close: () => {
      setModalValues((prevState) => ({
        ...prevState,
        visibility: false,
      }));
    },
    closeMessage: () => {
      setModalValues((prevState) => ({
        ...prevState,
        message: false,
      }));
    }
  });
  let dl = new(DataLoader);

  const showMessage = (text) => {
    setModalValues((prevState) => ({
      ...prevState,
      message: {
        text: text,
        type: "danger",
        canClose: false,
      }
    }));
    setTimeout(() => {
      setModalValues((prevState) => ({
        ...prevState,
        message: {
          text: null,
        }
      }));
    }, ConfigData.MessageTimeout);
  };

  let changePeriod = (period) => {
    let values;
    if(periods.includes(period)){
      values = periods.filter((a)=>a !== period);
    }
    else {
      values = periods.concat(period);
    }
    setPeriods(period);
    forceRefreshData();
  }

  function updateModalValues(title, text, primaryButtonText, primaryButtonFunction, secondaryButtonText, secondaryButtonFunction, keepOpen) {
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
      message: false,
      keepOpen: keepOpen ? true : false,
      close: () => {
        setModalValues((prevState) => ({
          ...prevState,
          visibility: false,
        }));
      },
    });
  }

  let openModal = (type) => {
    if(type === "close") {
      updateModalValues("Close Reporting Period", renderModalContent(type), "Continue", ()=>closePeriod(), "Cancel", ()=>{}, true);
    }
    else if(type === "create") {
      updateModalValues("Create Reporting Period", renderModalContent(type), "Continue", ()=>createPeriod(), "Cancel", ()=>{}, true);
    }
  }

  let modalProps = {
    showEditModal(id, start, end) {
      updateModalValues("Edit Reporting Period", renderModalContent("edit", start, end), "Continue", ()=>editPeriod(id, start, end), "Cancel", ()=>{}, true);
    },
  }

  let forceRefreshData = () => {
    setRefresh(true);
  };

  const closePeriod = () => {
    // let body = id;
    // setModalValues((prevState) => ({
    //   ...prevState,
    //   primaryButton:{
    //     text: <><CSpinner size="sm"/> Closing</>
    //   },
    // }));
    // sendRequest(ConfigData.UNIONLIST_DELETE,"POST",body)
    // .then(response => response.json())
    // .then(data => {
    //   if(data?.Success) {
    //     setRefresh(true);
    //   }
    //   else {
    //     showErrorMessage(data.Message);
    //   }
    //   modalValues.close();
    // })
  }

  const createPeriod = () => {
    // let body = Object.fromEntries(new FormData(document.getElementById("create_form")));
    // if(!body.periodStart || !body.periodEnd) {
    //   if(!body.periodStart && !body.periodEnd) {
    //     showMessage("Select a period");
    //   }
    //   else {
    //     if(!body.periodStart) {
    //       showMessage("Add period start date");
    //     }
    //     else {
    //       showMessage("Add period end date");
    //     }
    //   }
    // }
    // else {
    //   sendRequest(ConfigData.UNIONLIST_UPDATE,"POST",body)
    //   .then(response => response.json())
    //   .then(data => {
    //     if(data?.Success) {
    //       setRefresh(true);
    //     }
    //     else {
    //       showErrorMessage(data.Message);
    //     }
    //     modalValues.close();
    //   })
    // }
  }

  const editPeriod = (id) => {
    // let body = Object.fromEntries(new FormData(document.getElementById("edit_form")));
    // body.Id = id;
    // if(!body.periodEnd) {
    //   showMessage("Add period end date");
    // }
    // else {
    //   sendRequest(ConfigData.UNIONLIST_UPDATE,"PUT",body)
    //   .then(response => response.json())
    //   .then(data => {
    //     if(data?.Success) {
    //       setRefresh(true);
    //     }
    //     else {
    //       showErrorMessage(data.Message);
    //     }
    //     modalValues.close();
    //   })
    // }
  }

  const showErrorMessage = (message) => {
    setErrorMessage("Something went wrong: " + message);
    setTimeout(() => {setErrorMessage('')}, ConfigData.MessageTimeout);
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

  const renderModalContent = (type, start, end) => {
    if(type === "close") {
      return (
        <div>
          <div>This will close the current reporting period</div>
        </div>
      );
    }
    else if(type === "create") {
      return (
        <div>
          <CForm id="create_form">
            <CRow>
              <CCol xs={12} md={6} className="mb-2">
                <label className="mb-3">Start Date</label>
                <div className="input-date">
                  <input type="date" name="periodStart" placeholder="dd/mm/yyyy"/>
                </div>
              </CCol>
              <CCol xs={12} md={6} className="mb-2">
                <label className="mb-3">End Date</label>
                <div className="input-date">
                  <input type="date" name="periodEnd" placeholder="dd/mm/yyyy"/>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </div>
      );
    }
    else if(type === "edit") {
      return (
        <div>
          <CForm id="edit_form">
              <CRow>
                <CCol xs={12} md={6} className="mb-2">
                  <label className="mb-3">Start Date</label>
                  <div className="input-date">
                    <input type="date" name="periodStart" placeholder="dd/mm/yyyy" value={start} disabled="disabled"/>
                  </div>
                </CCol>
                <CCol xs={12} md={6}>
                  <label className="mb-3">End Date</label>
                  <div className="input-date">
                    <input type="date" name="periodEnd" placeholder="dd/mm/yyyy" value={end}/>
                  </div>
                </CCol>
              </CRow>
            </CForm>
        </div>
      );
    }
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="reportingperiod"/>
      <div className="content--wrapper">
      <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Reporting Period</h1>
              </div>
              <div>
                <ul className="btn--list">
                  <li>
                    <CButton color="secondary" onClick={()=>openModal("close")}>
                      Close Current Reporting Period
                    </CButton>
                  </li>
                  <li>
                    <CButton color="primary" onClick={()=>openModal("create")}>
                      Create Reporting Period
                    </CButton>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <CAlert color="danger" visible={errorMessage.length > 0}>{errorMessage}</CAlert>
            </div>
            <div className="d-flex flex-start align-items-center p-3 card-site-level">
              <div className="me-5"><h2 className="card-site-level-title">Period</h2></div>
              <div>
                <ul className="btn--list">
                  <li>
                    <div className="checkbox">
                      <input type="checkbox" className="input-checkbox" id="period_check_current" checked={periods.includes("current")} onClick={()=>changePeriod("Current")} readOnly/>
                      <label htmlFor="period_check_current" className="input-label badge color--default">Current</label>
                    </div>
                  </li>
                  <li>
                    <div className="checkbox">
                      <input type="checkbox" className="input-checkbox" id="period_check_passed" checked={periods.includes("passed")} onClick={()=>changePeriod("Passed")} readOnly/>
                      <label htmlFor="period_check_passed" className="input-label badge color--default">Passed</label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <CRow>
              <CCol>
                <TablePeriod
                  updateModalValues={updateModalValues}
                  modalProps={modalProps}
                  refresh = {refresh}
                  setRefresh = {(v)=>{setRefresh(v)}}
                />
              </CCol>
            </CRow>
          </CContainer>
          <ConfirmationModal modalValues={modalValues}/>
        </div>
      </div>
    </div>
  )
}

export default ReportingPeriod
