import React from 'react'
import {
  CRow,
  CCol,
  CButton,
  CHeader,
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownItemPlain,
  CDropdownDivider,
} from '@coreui/react'

import '@fortawesome/fontawesome-free/css/all.min.css';

const AppHeader = (props) => {
  let isLoggedIn = true;
  return (
    <CHeader className='header--custom'>
      <CRow className='align-items-center'>
        <CCol className="header__title">
          <a href='/#/'>Natura Change Manager</a>
        </CCol>
        <CCol className='header__links'>
          <ul className="btn--list justify-content-between">
            {!isLoggedIn ?
              <li className="header__button ms-auto">
                <CButton color="white" className='btn-link' href='/#/'>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>Log In
                </CButton>
              </li>
              :
              <>
                <li className={props.page === 'dashboard' ? 'header-active' : ''}>
                  <CButton color="link" className='btn-link--bold' href='/#/dashboard'>Dashboard</CButton>
                </li>
                <li className={props.page && props.page.includes('harvesting') ? 'header-active' : ''}>
                  <CButton color="link" className='btn-link--bold' href='/#/harvesting/incoming'>Harvesting</CButton>
                </li>
                <li className={props.page && props.page.includes('sitechanges') ? 'header-active' : ''}>
                  <CButton color="link" className='btn-link--bold' href='/#/sitechanges'>Site Changes</CButton>
                </li>
                <li className={props.page === 'sitelineage' ? 'header-active' : ''}>
                  <CButton color="link" className='btn-link--bold' href='/#/sitelineage'>Site Lineage</CButton>
                </li>
                <li className={props.page === 'releases' ? 'header-active' : ''}>
                  <CButton color="link" className='btn-link--bold' href='/#/releases/management'>Releases</CButton>
                </li>
                <li className={props.page && props.page.includes('reports') ? 'header-active' : ''}>
                  <CButton color="link" className='btn-link--bold' href='/#/reports/added'>Reports</CButton>
                </li>
                <CDropdown variant="nav-item" alignment="end" className={props.page === 'user' ? 'header-active' : ''}>
                  <CDropdownToggle color="secondary">
                    <CAvatar>
                      <i className="fa-solid fa-circle-user"></i>
                    </CAvatar>
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItemPlain><i className="fa-solid fa-user"></i>example@email.com</CDropdownItemPlain>
                    <CDropdownDivider />
                    <CDropdownItem href="/#/"><i className="fa-solid fa-gear"></i>Settings</CDropdownItem>
                    <CDropdownItem href="/#/"><i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </>
            }
          </ul>
        </CCol>
      </CRow>
    </CHeader>
  )
}

export default AppHeader
