import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import TableManagement from './TableManagement';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import {DataLoader} from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CForm,
  CFormInput,
  CButton,
  CAlert,
  CSpinner
} from '@coreui/react'

import { ModalRelease } from './ModalRelease';
import { ConfirmationModal } from './components/ConfirmationModal';

const Releases = () => {
  const [refresh,setRefresh] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorRequest, setErrorRequest]  = useState(false);
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
    }, UtilsData.MESSAGE_TIMEOUT);
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

  let openModal = () => {
    setModalVisible(true);
  }

  let closeModal = (refresh) => {
    setModalVisible(false);
    if(refresh) {
      forceRefreshData();
    }
  }

  let forceRefreshData = () => {
    //setSitecodes([])
    setRefresh(true);
  };

  const deleteReport = (id) => {
    let body = id;
    setModalValues((prevState) => ({
      ...prevState,
      primaryButton:{
        text: <><CSpinner size="sm"/> Deleting</>
      },
    }));
    sendRequest(ConfigData.UNIONLIST_DELETE,"DELETE",body)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        modalValues.close();
        setRefresh(true);
      }
      else {
        modalValues.close();
        setErrorRequest(true);
        setTimeout(() => setErrorRequest(false), UtilsData.MESSAGE_TIMEOUT);
      }
    })
  }

  const editReport = (id) => {
    let body = Object.fromEntries(new FormData(document.getElementById("release_form")));
    body.Id = id;
    body.Final = body.Final ? true : false;
    if(!body.Name) {
      showMessage("Add a release name");
      document.querySelector("#release_form input").classList.add('invalidField');
    }
    else {
      sendRequest(ConfigData.UNIONLIST_UPDATE,"PUT",body)
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          modalValues.close();
          setRefresh(true);
        }
        else {
          modalValues.close();
          setErrorRequest(true);
          setTimeout(() => setErrorRequest(false), UtilsData.MESSAGE_TIMEOUT);
        }
      })
    }
  }

  let modalProps = {
    showDeleteModal(id) {
      updateModalValues("Delete Release", "This will delete this Release", "Continue", ()=>deleteReport(id), "Cancel", ()=>{}, true);
    },
    showEditModal(id, name, final) {
      updateModalValues("Release Edition", renderReleaseForm(name, final), "Continue", ()=>editReport(id), "Cancel", ()=>{}, true);
    },
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

  const renderReleaseForm = (name, final) => {
    const onChangeField = (e) => {
      if(e.target.classList.contains('invalidField')) {
        e.target.classList.remove('invalidField');
      }
    }
    return (
      <div>
        <CForm id="release_form">
          <CRow>
            <CCol xs={12}>
              <label className="mb-3">Release Name</label><span className="mandatory">*</span>
              <CFormInput
                className="mb-2"
                name="Name"
                type="text"
                maxLength={254}
                defaultValue={name}
                placeholder="Release Name"
                autoComplete="off"
                onChange={(e) => onChangeField(e)}
              />
              <div className="checkbox">
                <input type="checkbox" className="input-checkbox" id="modal_check_final" name="Final" defaultChecked={final}/>
                <label htmlFor="modal_check_final" className="input-label">Mark as Official</label>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </div>
    );
  }

  const page = UtilsData.SIDEBAR["releases"].find(a => a.option === "management");

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="releases"/>
      <div className="content--wrapper">
        <AppSidebar
          title="Releases"
          options={UtilsData.SIDEBAR["releases"]}
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
                    <CButton color="primary" onClick={()=>openModal()}>
                      Create Release
                    </CButton>
                  </li>
                </ul>
              </div>
            </div>
            {errorRequest && 
              <CAlert color="danger">Something went wrong with your request</CAlert>
            }
            <CRow>
              <CCol>
                <TableManagement
                  updateModalValues={updateModalValues}
                  modalProps={modalProps}
                  refresh = {refresh}
                  setRefresh = {(v)=>{setRefresh(v)}}
                />
              </CCol>
            </CRow>
          </CContainer>
          <ModalRelease
            visible={modalVisible}
            close={closeModal}
            updateModalValues={updateModalValues}
            renderReleaseForm={renderReleaseForm}
          />
          <ConfirmationModal modalValues={modalValues}/>
        </div>
      </div>
    </div>
  )
}

export default Releases
