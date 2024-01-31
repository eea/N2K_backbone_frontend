import React, { useState, useRef, useEffect } from 'react'
import { AppFooter, AppHeader } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';

import {
  CCol,
  CContainer,
  CRow,
  CSidebar,
  CSidebarNav,
  CButton,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from '@coreui/react'

const Releases = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState()

  let dl = new DataLoader()

  // useEffect(() => {
  //   loadData()
  // }, [])

  const loadData = () => {
    dl.fetch()
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="releases"/>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
        <CSidebarNav>
            <li className="nav-title">Releases</li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/management">
                <i className="fa-solid fa-bookmark"></i>
                Release Management
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/#/releases/documentation">
                <i className="fa-solid fa-bookmark"></i>
                Release Documentation
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/comparer">
                <i className="fa-solid fa-bookmark"></i>
                Release Comparer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/siteedition">
                <i className="fa-solid fa-bookmark"></i>
                Site Edition
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/releases/unionlists">
                <i className="fa-solid fa-bookmark"></i>
                Union Lists
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">Release Documentation</h1>
              </div>
            </div>
          </CContainer>
        </div>
      </div>
    </div>
  )
}

export default Releases
