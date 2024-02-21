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
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';

const ReportingPeriod = () => {
  const [refresh,setRefresh] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [isCurrent, setIsCurrent] = useState(true);
  const [errorMessage, setErrorMessage]  = useState("");
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

  let openModal = (type, start, end) => {
    if(type === "close") {
      updateModalValues("Close Reporting Period", renderModalContent(type), "Continue", ()=>closePeriod(), "Cancel", ()=>{}, true);
    }
    else if(type === "create") {
      updateModalValues("Create Reporting Period", renderModalContent(type, start, end), "Continue", ()=>createPeriod(), "Cancel", ()=>{}, true);
    }
  }

  let modalProps = {
    showEditModal(id, start, end) {
      updateModalValues("Edit Reporting Period", renderModalContent("edit", formatDate(start), formatDate(end)), "Continue", ()=>editPeriod(id), "Cancel", ()=>{}, true);
    },
  }

  const closePeriod = () => {
    sendRequest(ConfigData.REPORTING_PERIOD_CLOSE,"POST")
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        setRefresh(true);
        setIsCurrent(false);
      }
      else {
        showErrorMessage(data.Message);
      }
      modalValues.close();
    })
  }

  const createPeriod = () => {
    let body = Object.fromEntries(new FormData(document.getElementById("create_form")));
    if(!body.periodStart || !body.periodEnd) {
      if(!body.periodStart && !body.periodEnd) {
        showMessage("Select a period");
      }
      else {
        if(!body.periodStart) {
          showMessage("Add period start date");
        }
        else {
          showMessage("Add period end date");
        }
      }
    }
    else {
      body = {
        InitDate: new Date(body.periodStart.split("/").reverse().join("-")).toISOString(),
        EndDate: new Date(body.periodEnd.split("/").reverse().join("-")).toISOString(),
      }
      sendRequest(ConfigData.REPORTING_PERIOD_CREATE,"POST",body)
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          setRefresh(true);
          setIsCurrent(false);
        }
        else {
          showErrorMessage(data.Message);
        }
        modalValues.close();
      })
    }
  }

  const editPeriod = (id) => {
    let body = Object.fromEntries(new FormData(document.getElementById("edit_form")));
    if(!body.periodEnd) {
      showMessage("Add period end date");
    }
    else {
      body = {
        EndDate: new Date(body.periodEnd.split("/").reverse().join("-")).toISOString(),
        Id: id
      }
      sendRequest(ConfigData.REPORTING_PERIOD_EDIT,"PUT", body)
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          setRefresh(true);
        }
        else {
          showErrorMessage(data.Message);
        }
        modalValues.close();
      })
    }
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

  const formatDate = (date) => {
    date = new Date(date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    date = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    return date;
  };

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
                  <input type="date" name="periodStart" placeholder="dd/mm/yyyy" defaultValue={start} max={end} onChange={(e)=>{openModal("create", e.currentTarget.value, end)}}/>
                </div>
              </CCol>
              <CCol xs={12} md={6} className="mb-2">
                <label className="mb-3">End Date</label>
                <div className="input-date">
                  <input type="date" name="periodEnd" placeholder="dd/mm/yyyy" defaultValue={end} min={start} onChange={(e)=>{openModal("create", start, e.currentTarget.value)}}/>
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
                    <input type="date" name="periodStart" placeholder="dd/mm/yyyy" disabled="disabled" defaultValue={start}/>
                  </div>
                </CCol>
                <CCol xs={12} md={6}>
                  <label className="mb-3">End Date</label>
                  <div className="input-date">
                    <input type="date" name="periodEnd" placeholder="dd/mm/yyyy" defaultValue={end} min={start}/>
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
                    <CButton color="secondary" onClick={()=>openModal("close")} disabled={isLoading || (!isLoading && !isCurrent)}>
                      Close Current Reporting Period
                    </CButton>
                  </li>
                  <li>
                    <CButton color="primary" onClick={()=>openModal("create")} disabled={isLoading || (!isLoading && isCurrent)}>
                      Create Reporting Period
                    </CButton>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <CAlert color="danger" visible={errorMessage.length > 0}>{errorMessage}</CAlert>
            </div>
            <CRow>
              <CCol>
                <TablePeriod
                  updateModalValues={updateModalValues}
                  modalProps={modalProps}
                  refresh = {refresh}
                  setRefresh = {(v)=>{setRefresh(v)}}
                  setIsloading = {(v)=>setIsloading(v)}
                  setIsCurrent = {setIsCurrent}
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
