import React, { lazy } from 'react'
import { AppSidebar, AppFooter, AppHeader } from './../../../components/index'
import { FetchEnvelops } from './FetchEnvelops';
import TableEnvelops from './TableEnvelops';
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  CButton,
  CAvatar,
  CHeader,
  CSidebar,
  CSidebarNav,
  CCol,
  CContainer,
  CRow,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormLabel,
  CFormSelect,  
  CPagination,
  CPaginationItem,   
} from '@coreui/react'

import moreicon from './../../../assets/images/three-dots.svg'
import user from './../../../assets/images/avatars/user.png'

const Harvesting = () => {
  return (
    <div className="container--main min-vh-100">
      <CHeader className="header--custom">
        <CRow className="align-items-center">
          <CCol className="header__title">
            <div>Natura Change Manager</div>
          </CCol>
          <CCol className="header__links">
            <ul className="btn--list justify-content-between">
              <li><CButton color="link" className="btn-link--bold" href="/#/dashboard">Dashboard</CButton></li>
              <li className="header-active"><CButton color="link" className="btn-link--bold" href="/#/harvesting">Harvesting</CButton></li>
              <li><CButton color="link" className="btn-link--bold" href="/#/sitechanges">Site Changes</CButton></li>
              <li><CButton color="link" className="btn-link--bold">Site Lineage</CButton></li>
              <li><CButton color="link" className="btn-link--bold">Reports</CButton></li>
              <li><CButton color="link" className="btn-link--bold">Reference Dataset</CButton></li>
              <li><CAvatar src={user} /><CButton color="link" className="btn-link--bold">Username</CButton></li>
            </ul>
          </CCol>
        </CRow>
      </CHeader>
      <CContainer fluid>
        
      </CContainer>
      <div className="content--wrapper">
        <CSidebar className="sidebar--light">
          <CSidebarNav>
            <li className="nav-title">Harvesting</li>
            <li className="nav-item">
              <a className="nav-link active">
                <i className="fa-solid fa-bookmark"></i>
                New Envelops
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">
                <i className="fa-solid fa-bookmark"></i>
                Harvested Envelopes History
              </a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>        
            <div className="d-flex justify-content-between py-3">
              <div className="page-title">
                <h1 className="h1">New Envelops</h1>
              </div>
            </div>
          <div className="d-flex justify-content-between">
            <div>
              <CDropdown>
                <CDropdownToggle color="link--dropdown" className="me-5">Filters</CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem >Action</CDropdownItem>
                    <CDropdownItem >Another action</CDropdownItem>
                    <CDropdownItem >Something else here</CDropdownItem>
                </CDropdownMenu>
                </CDropdown>
                <CDropdown>
                <CDropdownToggle color="link--dropdown" className="me-5">Options</CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem >Action</CDropdownItem>
                    <CDropdownItem >Another action</CDropdownItem>
                    <CDropdownItem >Something else here</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className="select--right">
              <CFormLabel htmlFor="exampleFormControlInput1" className="form-label form-label-reporting col-md-4 col-form-label">Reporting date</CFormLabel>
              <CFormSelect aria-label="Default select example" className="form-select-reporting">
                <option></option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </CFormSelect>
            </div>
          </div>
        {/* table */}
        <CRow>
        <CCol md={10} lg={10}>
        <FetchEnvelops />
        <TableEnvelops />
        {/* <CTable className="mt-5"> 
        <CTableHead>
            <CTableRow>
            <CTableHeaderCell scope="col"> <CFormCheck /></CTableHeaderCell>
            <CTableHeaderCell scope="col">Envelope ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Country</CTableHeaderCell>
            <CTableHeaderCell scope="col">Pending changes</CTableHeaderCell>
            <CTableHeaderCell scope="col">Submission date</CTableHeaderCell>            
            <CTableHeaderCell scope="col">&nbsp;</CTableHeaderCell>            
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow className="align-middle">
            <CTableDataCell><CFormCheck /></CTableDataCell>
            <CTableDataCell> 25654</CTableDataCell>
            <CTableDataCell>Spain</CTableDataCell>
            <CTableDataCell>11</CTableDataCell>
            <CTableDataCell>07/05/2021</CTableDataCell>
            
            <CTableDataCell>
                <CDropdown >
                <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                    <CImage src={moreicon} className="ico--md "></CImage>
                </CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem >Harvest info form submission/s</CDropdownItem>
                </CDropdownMenu>
                </CDropdown>
            </CTableDataCell>
            </CTableRow>
            <CTableRow className="align-middle">
            <CTableDataCell><CFormCheck /></CTableDataCell>            
            <CTableDataCell> 25654</CTableDataCell>
            <CTableDataCell>Spain</CTableDataCell>
            <CTableDataCell>11</CTableDataCell>
            <CTableDataCell>07/05/2021</CTableDataCell>
            <CTableDataCell>   
                <CDropdown >
                <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm" >
                <CImage src={moreicon} className="ico--md "></CImage>
                </CDropdownToggle>
                <CDropdownMenu>
                <CDropdownItem >Harvest info form submission/s</CDropdownItem>
                </CDropdownMenu>
            </CDropdown></CTableDataCell>
            </CTableRow>
            <CTableRow className="align-middle">
            <CTableDataCell><CFormCheck /></CTableDataCell>
            <CTableDataCell> 25654</CTableDataCell>
            <CTableDataCell>Spain</CTableDataCell>
            <CTableDataCell>11</CTableDataCell>
            <CTableDataCell>07/05/2021</CTableDataCell>
            <CTableDataCell>
                <CDropdown >
                <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                    <CImage src={moreicon} className="ico--md "></CImage>
                </CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem >Harvest info form submission/s</CDropdownItem>
                </CDropdownMenu>
                </CDropdown>
            </CTableDataCell>
            </CTableRow>
        </CTableBody>

        </CTable>*/}
        </CCol>
        <CCol md={2} lg={2} >
            <CRow className="p-4">
            </CRow>     
            <CRow lg={{cols: 1}} className="p-3">
              <CButton color="primary">Harvest Selected</CButton>
            </CRow>       
            
            <CRow lg={{cols: 1}} className="p-3">
                <CButton color="primary">Harvest all</CButton>  
            </CRow>            
        </CCol>
        
        </CRow>       
                       
          </CContainer>
        </div>
      </div>
    </div>
    
  )
}


export default Harvesting