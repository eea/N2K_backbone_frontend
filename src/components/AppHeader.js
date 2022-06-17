import React from 'react'
import {
  CRow,
  CCol,
  CButton,
  CHeader,
  CAvatar
} from '@coreui/react'

import '@fortawesome/fontawesome-free/css/all.min.css';

const AppHeader = (props) => {
  return (
    <CHeader className='header--custom'>
      <CRow className='align-items-center'>
        <CCol className="header__title">
          <div>Natura Change Manager</div>
        </CCol>
        <CCol className='header__links'>
          <ul className="btn--list justify-content-between">
            <li className={!props.page && 'header-active'}>
              <CButton color="link" className='btn-link--bold' href='/#/dashboard'>Dashboard</CButton>
            </li>
            <li className={props.page === 'harvesting' && 'header-active'}>
              <CButton color="link" className='btn-link--bold' href='/#/harvesting'>Harvesting</CButton>
            </li>
            <li className={props.page === 'sitechanges' && 'header-active'}>
              <CButton color="link" className='btn-link--bold' href='/#/sitechanges'>Site Changes</CButton>
            </li>
            <li className={props.page === 'sitelineage' && 'header-active'}>
              <CButton color="link" className='btn-link--bold'>Site Lineage</CButton>
            </li>
            <li className={props.page === 'reports' && 'header-active'}>
              <CButton color="link" className='btn-link--bold'>Reports</CButton>
            </li>
            <li className={props.page === 'refdataset' && 'header-active'}>
              <CButton color="link" className='btn-link--bold'>Reference Dataset</CButton>
            </li>
            <li className={props.page === 'user' && 'header-active'}>
              <CAvatar>
                <i className="fa-solid fa-circle-user"></i>
              </CAvatar>
              <CButton color="link" className='btn-link--bold'>Username</CButton>
            </li>
          </ul>
        </CCol>
      </CRow>
    </CHeader>
  )
}

export default AppHeader
