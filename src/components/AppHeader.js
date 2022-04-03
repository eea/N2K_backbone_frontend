import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CRow,
  CCol,
  CButton,
  CHeader,
  CAvatar
} from '@coreui/react'

import user from './../assets/images/avatars/user.png'
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader className='header--custom'>
        <CRow className='p-2 header__title'>
          <CCol>
            <div className="header__title justify-content-end">Natura Change Manager</div>
          </CCol>
          <CCol className='header__title'>
            <ul className="btn--list justify-center">
              <li><CButton color="link" className='btn-link--bold' href='/#/dashboard'>Dashboard</CButton></li>
              <li><CButton color="link" className='btn-link--bold' href='/#/harvesting'>Harvesting</CButton></li>
              <li> <CButton color="link" className='btn-link--bold' href='/#/sitechanges'>Site Changes</CButton></li>
              <li><CButton color="link" className='btn-link--bold'>Site Lineage</CButton></li>
              <li><CButton color="link" className='btn-link--bold'>Reports</CButton></li>
              <li><CButton color="link" className='btn-link--bold'>Reference Dataset</CButton></li>
              <li><CAvatar src={user} size="md" /><CButton color="link" className='btn-link--bold'>Username</CButton></li>
            </ul>
          </CCol>
        </CRow>
      </CHeader>    
  )
}

export default AppHeader
