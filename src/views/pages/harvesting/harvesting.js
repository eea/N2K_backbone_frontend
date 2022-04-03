import React, { lazy } from 'react'
import { AppSidebar, AppFooter, AppHeader } from './../../../components/index'

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
  CTable,
  CTableBody,  
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CImage,
  CPagination,
  CPaginationItem,   
} from '@coreui/react'

import moreicon from './../../../assets/images/three-dots.svg'
import user from './../../../assets/images/avatars/user.png'

const Harvesting = () => {
  return (
    <div className='container--main min-vh-100'>
      <CHeader className='header--custom'>
        <CRow className='p-2 header__title'>
          <CCol>
            <div className="header__title justify-content-end">Natura Change Manager</div>
          </CCol>
          <CCol className='header__title'>
            <ul className="btn--list justify-center">
              <li><CButton color="link" className='btn-link--bold' href='/#/dashboard'>Dashboard11</CButton></li>
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
      <CContainer fluid>
        
      </CContainer>
      <div className="content--wrapper">
        <CSidebar className='sidebar--light'>
          <CSidebarNav>
            <li className="nav-title">Harvesting</li>
            <li className="nav-item">
              <a className="nav-link active"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg>New envelops</a>
            </li>
            <li className="nav-item">
              <a className="nav-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg>Harvested Envelopes History</a>
            </li>
          </CSidebarNav>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>        
            <div className="select--right">
              <CRow >
                <CFormLabel htmlFor="exampleFormControlInput1" className='form-label col-md-4 col-form-label'>Reporting date</CFormLabel>
                <CCol>
                  <CFormSelect aria-label="Default select example">
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </CFormSelect></CCol>
              </CRow>
            </div>

          <h1 className="h1">New Envelops</h1>
          <div className='d-flex  justify-content-between'>
                <div>
                    <CDropdown>
                    <CDropdownToggle color="primary" variant="ghost" size="lg">Filters</CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem >Action</CDropdownItem>
                        <CDropdownItem >Another action</CDropdownItem>
                        <CDropdownItem >Something else here</CDropdownItem>
                    </CDropdownMenu>
                    </CDropdown>
                    <CDropdown>
                    <CDropdownToggle color="primary" variant="ghost" size="lg">Options</CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem >Action</CDropdownItem>
                        <CDropdownItem >Another action</CDropdownItem>
                        <CDropdownItem >Something else here</CDropdownItem>
                    </CDropdownMenu>
                    </CDropdown>
                </div>
        </div>
        <div className="select--right">             
        </div>
        {/* table */}
        <CRow>
        <CCol md={10} lg={10}>
        <CTable className='mt-5'>
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
            <CTableRow className='align-middle'>
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
            <CTableRow className='align-middle'>
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
            <CTableRow className='align-middle'>
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

        </CTable>
        </CCol>
        <CCol md={2} lg={2} >
            <CRow className='p-4'>
            </CRow>     
            <CRow lg={{cols: 1}} className='p-3'>
              <CButton color="primary">Export to Excel</CButton>
            </CRow>       
            
            <CRow lg={{cols: 1}} className='p-3'>
                <CButton color="primary">Harvest all</CButton>  
            </CRow>            
        </CCol>
        
        </CRow>
       
        {/*   pagination */}
        <CPagination aria-label="Page navigation example">
          <CPaginationItem aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          <CPaginationItem>1</CPaginationItem>
          <CPaginationItem>2</CPaginationItem>
          <CPaginationItem>3</CPaginationItem>
          <CPaginationItem aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
                       
          </CContainer>
        </div>
      </div>
    </div>
    
  )
}


export default Harvesting