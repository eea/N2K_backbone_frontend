import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import TableManagement from './TableManagement';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CForm,
  CFormInput,
  CButton,
  CAlert
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';

const Reports = () => {
  const [modalValues, setModalValues] = useState({
    visibility: false,
    message: false,
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

  const showMessage = () => {
    setModalValues((prevState) => ({
      ...prevState,
      message: true,
    }));
    setTimeout(() => {
      setModalValues((prevState) => ({
        ...prevState,
        message: false,
      }));
    }, 4000);
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
      message: false,
    });
  }

  const createUnionList = () => {
    let body = Object.fromEntries(new FormData(document.getElementById("unionlist_form")));
    body.unionListFinal = body.unionListFinal ? true : false;
    if(!body.unionListName) {
      showMessage();
    }
    else {
      // sendRequest(ConfigData.UNIONLIST_CREATE,"POST","")
      // .then(response => response.json())
      // .then(data => {
      //   if(data.Success) {
      //     modalValues.close();
      //     refresh
      //   }
      //   else {
      //     errors.push(data.Message);
      //     console.log("Error: " + data.Message);
      //   }
      // })
    }
  }

  const deleteUnionList = (id) => {
    // sendRequest(ConfigData.UNIONLIST_DELETE,"POST","")
    // .then(response => response.json())
    // .then(data => {
    //   if(data.Success) {
    //     modalValues.close();
    //     //refresh
    //   }
    //   else {
    //     errors.push(data.Message);
    //     console.log("Error: " + data.Message);
    //   }
    // })
  }

  const editUnionList = (id, name, final) => {
    let body = Object.fromEntries(new FormData(document.getElementById("unionlist_form")));
    body.unionListFinal = body.unionListFinal ? true : false;
    if(!body.unionListName) {
      showMessage();
    }
    else {
      // sendRequest(ConfigData.UNIONLIST_EDIT,"POST","")
      // .then(response => response.json())
      // .then(data => {
      //   if(data.Success) {
      //     modalValues.close();
      //     //refresh
      //   }
      //   else {
      //     errors.push(data.Message);
      //     console.log("Error: " + data.Message);
      //   }
      // })
    }
  }

  let modalProps = {
    showDeleteModal(id) {
      updateModalValues("Delete Union List", "This will delete this Union List", "Continue", ()=>deleteUnionList(id), "Cancel", ()=>{});
    },
    showEditModal(id, name, final) {
      updateModalValues("Edit Union List", unionListForm(name, final), "Continue", ()=>editUnionList(id, name, final), "Cancel", ()=>{});
    },
    downloadUnionList(id) {
      console.log("Download "+id);
    }
  }

  const sendRequest = (url,method,body,path) => {
    const options = {
      method: method,
      headers: {
      'Content-Type': path? 'multipart/form-data' :'application/json',
      },
      body: path ? body : JSON.stringify(body),
    };
    return fetch(url, options)
  }

  const unionListForm = (name, final) => {
    return (
      <div>
        <CForm id="unionlist_form">
          <CRow>
            <CCol xs={12}>
              <label className="mb-3">Union List Name</label>
              <CFormInput
                className="mb-2"
                name="unionListName"
                type="text"
                defaultValue={name}
                placeholder="Union List Name"
                autoComplete="off"
              />
              <div className="checkbox">
                <input type="checkbox" className="input-checkbox" id="modal_check_final" name="unionListFinal" defaultChecked={final}/>
                <label htmlFor="modal_check_final" className="input-label">Mark as final</label>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </div>
    );
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="reports"/>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Reports</li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/reports/management">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists Management
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/comparer">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists Comparer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/added">
                <i className="fa-solid fa-bookmark"></i>
                Sites Added
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/deleted">
                <i className="fa-solid fa-bookmark"></i>
                Sites Deleted
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/reports/changes">
                <i className="fa-solid fa-bookmark"></i>
                Changes
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Union Lists Management</h1>
              </div>
              <div>
                  <ul className="btn--list">
                    <li>
                      <CButton color="primary" onClick={()=>updateModalValues("Create Union List", unionListForm(), "Create", ()=>createUnionList(), "Cancel", ()=>{})}>
                        Create Union List
                      </CButton>
                    </li>
                  </ul>
              </div>
            </div>
            <CRow>
              <CCol>
                <TableManagement
                  updateModalValues={updateModalValues}
                  modalProps={modalProps}
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

export default Reports
