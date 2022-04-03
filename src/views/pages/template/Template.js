import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCol,
  CContainer,
  CFormInput,
  CRow,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNav,
  CNavItem,
  CNavLink,
  CHeader,
  CAvatar,
  CSidebar,
  CSidebarNav,
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
  CPaginationItem, CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle


} from '@coreui/react'

import MapImg from './../../../assets/images/map.jpg'
import moreicon from './../../../assets/images/three-dots.svg'
import justificationrequired from './../../../assets/images/exclamation.svg'
import justificationprovided from './../../../assets/images/file-text.svg'
import trash from './../../../assets/images/trash.svg'

import flag from './../../../assets/images/flag.svg'
const Template = () => {
  return (
    <div className='container--main min-vh-100'>
      <CHeader className='header--custom'>
        <div className="header__title">Natura Change Manager</div>
      </CHeader>
      <CContainer fluid>
        <CRow className='p-2'>

          <CCol >
            <ul className="btn--list justify-content-end">
              <li><CButton color="link" className='btn-link--bold'>Sites changes</CButton></li>
              <li><CButton color="link" className='btn-link--bold'>Sites lineage</CButton></li>
              <li> <CButton color="link" className='btn-link--bold'>Report</CButton></li>
              <li><CButton color="link" className='btn-link--bold'>Reference Dataset</CButton></li>
            </ul>
          </CCol>
        </CRow>
      </CContainer>
      <div className="content--wrapper">
        <CSidebar className='sidebar--light'>
          <CSidebarNav>

            <li className="nav-title">Site changes</li>
            <li className="nav-item">
              <a href="" className="nav-link active"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg> Changes management</a>
            </li>
            <li className="nav-item">
              <a href="" className="nav-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg> Changes history</a>
            </li>
            <li className="nav-item">
              <a href="" className="nav-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg> Submissions harveseting</a>
            </li>


          </CSidebarNav>
          <div className='legend'>
            <p className='legend__title'>Status Legend</p>
            <ul className='legend__list'>
              <li className="legend__item"> <CImage src={justificationrequired} className="ico--md "></CImage>
                <span className="legend__text">Justification required</span>
              </li>
              <li className="legend__item"> <CImage src={justificationprovided} className="ico--md "></CImage>
                <span className="legend__text">Justification provided (pending to review)</span>
              </li>
            </ul>
          </div>
        </CSidebar>
        <div className="main-content">
          <CContainer fluid>
            <div className='d-flex  justify-content-between'>
              <div>
                <CDropdown>
                  <CDropdownToggle color="primary" variant="ghost" size="lg">Filters</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="#">Action</CDropdownItem>
                    <CDropdownItem href="#">Another action</CDropdownItem>
                    <CDropdownItem href="#">Something else here</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                <CDropdown>
                  <CDropdownToggle color="primary" variant="ghost" size="lg">Options</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="#">Action</CDropdownItem>
                    <CDropdownItem href="#">Another action</CDropdownItem>
                    <CDropdownItem href="#">Something else here</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
              <div>
                <ul className="btn--list">
                  <li><CButton color="primary">View all</CButton></li>
                  <li><CButton color="primary">Apply saved query</CButton></li>
                </ul>
              </div>
            </div>
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

            {/*   tabs */}
            <CNav variant="tabs" className='mt-5'>
              <CNavItem>
                <CNavLink href="#" active>
                  Pending
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">Accepted</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">Rejected</CNavLink>
              </CNavItem>

            </CNav>
            <h1 className="h1">Sites overview</h1>
            {/* table */}
            <CTable className='mt-5'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col"> <CFormCheck /></CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sitecode</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Level</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Change Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Change type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Country</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tags</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow className='align-middle'>
                  <CTableDataCell><CFormCheck /></CTableDataCell>
                  <CTableDataCell> <span className='badge badge--light'>25654</span></CTableDataCell>
                  <CTableDataCell><span className='badge badge--critical'>Critical</span></CTableDataCell>
                  <CTableDataCell>Network General Structure</CTableDataCell>
                  <CTableDataCell>Sites added
                    <span className='radio--warning'> <CFormCheck type="radio" name="radioNoLabel" id="radioNoLabel" value="" aria-label="..." /></span>
                    <span className='radio--danger'> <CFormCheck type="radio" name="radioNoLabel" id="radioNoLabel" value="" aria-label="..." /></span>

                    <span className='radio--success'> <CFormCheck type="radio" name="radioNoLabel" id="radioNoLabel" value="" aria-label="..." /></span>

                  </CTableDataCell>
                  <CTableDataCell>Spain</CTableDataCell>
                  <CTableDataCell><span className='badge badge--default'>My_tag</span></CTableDataCell>
                  <CTableDataCell>
                    <CImage src={justificationrequired} className="ico--md "></CImage>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CDropdown >
                      <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                        <CImage src={moreicon} className="ico--md "></CImage>
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Action</CDropdownItem>
                        <CDropdownItem href="#">Another action</CDropdownItem>
                        <CDropdownItem href="#">Something else here</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow className='align-middle'>
                  <CTableDataCell><CFormCheck /></CTableDataCell>
                  <CTableDataCell>25654</CTableDataCell>
                  <CTableDataCell> <span className='badge badge--medium'>Medium</span> </CTableDataCell>
                  <CTableDataCell>Network General Structure</CTableDataCell>
                  <CTableDataCell>Sites added</CTableDataCell>
                  <CTableDataCell>Spain</CTableDataCell>
                  <CTableDataCell><span className='badge badge--default'>My_tag</span></CTableDataCell>
                  <CTableDataCell>    <CImage src={justificationprovided} className="ico--md "></CImage></CTableDataCell>
                  <CTableDataCell>   <CDropdown >
                    <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm" >

                      <CImage src={moreicon} className="ico--md "></CImage>
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown></CTableDataCell>
                </CTableRow>
                <CTableRow className='align-middle'>
                  <CTableDataCell><CFormCheck /></CTableDataCell>
                  <CTableDataCell>25654</CTableDataCell>
                  <CTableDataCell><span className='badge badge--warning'>Warning</span></CTableDataCell>
                  <CTableDataCell>Network General Structure</CTableDataCell>
                  <CTableDataCell>Sites added</CTableDataCell>
                  <CTableDataCell>Spain</CTableDataCell>
                  <CTableDataCell><span className='badge badge--default'>My_tag</span></CTableDataCell>
                  <CTableDataCell>Status</CTableDataCell>
                  <CTableDataCell>
                    <CDropdown >
                      <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">

                        <CImage src={moreicon} className="ico--md "></CImage>
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Action</CDropdownItem>
                        <CDropdownItem href="#">Another action</CDropdownItem>
                        <CDropdownItem href="#">Something else here</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            {/* table small*/}
            <CTable className='mt-5 table-sm'>
              <CTableHead>
                <CTableRow>

                  <CTableHeaderCell scope="col">Sitecode</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Level</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Change Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Change type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Country</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tags</CTableHeaderCell>


                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow className='align-middle'>
                  <CTableDataCell> 25654</CTableDataCell>
                  <CTableDataCell>Critical</CTableDataCell>
                  <CTableDataCell>Network General Structure</CTableDataCell>
                  <CTableDataCell>Sites added </CTableDataCell>
                  <CTableDataCell>Spain</CTableDataCell>
                  <CTableDataCell>My_tag</CTableDataCell>
                </CTableRow>
                <CTableRow className='align-middle'>
                  <CTableDataCell> 25654</CTableDataCell>
                  <CTableDataCell>Critical</CTableDataCell>
                  <CTableDataCell>Network General Structure</CTableDataCell>
                  <CTableDataCell>Sites added </CTableDataCell>
                  <CTableDataCell>Spain</CTableDataCell>
                  <CTableDataCell>My_tag</CTableDataCell>
                </CTableRow><CTableRow className='align-middle'>
                  <CTableDataCell> 25654</CTableDataCell>
                  <CTableDataCell>Critical</CTableDataCell>
                  <CTableDataCell>Network General Structure</CTableDataCell>
                  <CTableDataCell>Sites added </CTableDataCell>
                  <CTableDataCell>Spain</CTableDataCell>
                  <CTableDataCell>My_tag</CTableDataCell>
                </CTableRow>

              </CTableBody>
            </CTable>
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
            {/*    modales */}
            <CModal
              className="show d-block position-static"
              backdrop={false}
              keyboard={false}
              portal={false}
              visible
              size="lg"
            >
              <CModalHeader>
                <CModalTitle>Site 70001 - Torbiera La Goia</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <h6>Change Information</h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className='badge badge--critical'>Critical</span>
                  <p className='mb-0'> Change of area/Geo Info</p>
                  <p className='mb-0'> <strong>Area decrease</strong></p>
                  <CButton color="link" className='btn-link--dark '>View detail</CButton>
                </div>




                <hr className='dashed-line' />
                <h6>Attached documents</h6>
                <CTable className='table--light table--noheader'>
                  <CTableHead>
                    <CTableRow>

                      <CTableHeaderCell scope="col">Document</CTableHeaderCell>
                      <CTableHeaderCell scope="col">File</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      <CTableHeaderCell scope="col">More</CTableHeaderCell>

                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow className='align-middle'>

                      <CTableDataCell><CImage src={justificationprovided} className="ico--md "></CImage></CTableDataCell>
                      <CTableDataCell>File name</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="link" className='btn-link--dark '>View</CButton>
                        <CImage src={trash} className="ico--md "></CImage>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CDropdown >
                          <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                            <CImage src={moreicon} className="ico--md "></CImage>
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem href="#">Action</CDropdownItem>
                            <CDropdownItem href="#">Another action</CDropdownItem>
                            <CDropdownItem href="#">Something else here</CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown></CTableDataCell>

                    </CTableRow>
                    <CTableRow className='align-middle'>

                      <CTableDataCell><CImage src={justificationprovided} className="ico--md "></CImage></CTableDataCell>
                      <CTableDataCell>File name</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="link" className='btn-link--dark '>View</CButton>
                        <CImage src={trash} className="ico--md "></CImage>
                      </CTableDataCell>
                      <CTableDataCell>       <CDropdown >
                        <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                          <CImage src={moreicon} className="ico--md "></CImage>
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem href="#">Action</CDropdownItem>
                          <CDropdownItem href="#">Another action</CDropdownItem>
                          <CDropdownItem href="#">Something else here</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown></CTableDataCell>

                    </CTableRow>

                  </CTableBody>
                </CTable>
                <p><CButton color="link" className='btn-link--dark '>Add document</CButton></p>
                <hr className='dashed-line' />
                <h6>Comments</h6>
                <ul className='comments__list'>
                  <li className='comments__item'>
                    <div className='comments__text'><del>New to upload supporting emails</del></div>
                    <CImage src={trash} className="ico--md "></CImage>
                    <CDropdown >
                      <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                        <CImage src={moreicon} className="ico--md "></CImage>
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Action</CDropdownItem>
                        <CDropdownItem href="#">Another action</CDropdownItem>
                        <CDropdownItem href="#">Something else here</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </li>

                  <li className='comments__item'>
                    <div className='comments__text'>Spatial file needed to approve change</div>
                    <CImage src={trash} className="ico--md "></CImage>
                    <CDropdown >
                      <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                        <CImage src={moreicon} className="ico--md "></CImage>
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Action</CDropdownItem>
                        <CDropdownItem href="#">Another action</CDropdownItem>
                        <CDropdownItem href="#">Something else here</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </li>
                </ul>
                <p><CButton color="link" className='btn-link--dark '>Add comment</CButton></p>
              </CModalBody>
              <CModalFooter>
                <div className="d-flex w-100 justify-content-between">
                  <CButton color="primary">Save </CButton>
                  <CButton color="secondary">Approve change</CButton>

                </div>

              </CModalFooter>
            </CModal>
            <CModal
              className="show d-block position-static"
              backdrop={false}
              keyboard={false}
              portal={false}
              visible
              size="lg"
            >
              <CModalHeader>
                <CModalTitle>UNKNOWN CHANGE</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CTable className='table--light'>
                  <CTableHead>
                    <CTableRow>

                      <CTableHeaderCell scope="col">Affected sites</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status change</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Area change</CTableHeaderCell>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>

                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow className='align-middle'>

                      <CTableDataCell>BE3100000</CTableDataCell>
                      <CTableDataCell>Active</CTableDataCell>
                      <CTableDataCell>Network General Structure</CTableDataCell>
                      <CTableDataCell>    <CButton color="link" className='btn-link--dark '>See spatial changes</CButton></CTableDataCell>

                    </CTableRow>
                    <CTableRow className='align-middle'>

                      <CTableDataCell> BE3100000</CTableDataCell>
                      <CTableDataCell>Active</CTableDataCell>
                      <CTableDataCell>Network General Structure</CTableDataCell>
                      <CTableDataCell> <CButton color="link" className='btn-link--dark '>See spatial changes</CButton></CTableDataCell>

                    </CTableRow>
                  </CTableBody>
                </CTable>
                <h6>Changes to be applied</h6>
                <CTable >
                  <CTableHead>
                    <CTableRow>

                      <CTableHeaderCell scope="col">Site</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Change type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Predecesors</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Sucessors</CTableHeaderCell>

                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow className='align-middle'>

                      <CTableDataCell>
                        <CFormInput type="text" id="exampleFormControlInput1" className='input--light  input--sm' />
                      </CTableDataCell>
                      <CTableDataCell><CFormInput type="text" id="exampleFormControlInput1" className='input--light  input--sm' /></CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex">
                          <CFormInput type="text" id="exampleFormControlInput1" className='input--light input--sm' /> <CButton color="link" className='btn-link--dark '>Add site</CButton>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex">
                          <CFormInput type="text" id="exampleFormControlInput1" className='input--light input--sm' />   <CButton color="link" className='btn-link--dark '>Add site</CButton>
                        </div>


                      </CTableDataCell>

                    </CTableRow>
                    <CTableRow className='align-middle'>

                      <CTableDataCell>
                        <CFormInput type="text" id="exampleFormControlInput1" className='input--light  input--sm' />
                      </CTableDataCell>
                      <CTableDataCell><CFormInput type="text" id="exampleFormControlInput1" className='input--light  input--sm' /></CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex">
                          <CFormInput type="text" id="exampleFormControlInput1" className='input--light input--sm' /> <CButton color="link" className='btn-link--dark '>Add site</CButton>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex">
                          <CFormInput type="text" id="exampleFormControlInput1" className='input--light input--sm' />   <CButton color="link" className='btn-link--dark '>Add site</CButton>
                        </div>


                      </CTableDataCell>

                    </CTableRow>

                  </CTableBody>
                </CTable>
                <CButton color="link" className='btn-link--dark '>Add change</CButton>
              </CModalBody>

              <CModalFooter>

                <CButton color="primary">Apply changes</CButton>
              </CModalFooter>
            </CModal>
            {/* modal form */}
            <CModal
              className="show d-block position-static"
              backdrop={false}
              keyboard={false}
              portal={false}
              visible
              size="lg"
            >

              <CModalBody>
                <h4 className='mb-3'>Site general information</h4>
                <div className='ms-4'>
                  <CRow className='mb-3'>
                    <CCol xs={12} md={4} lg={3}>
                      <CFormLabel className='col-form-label'>
                        Sitecode
                      </CFormLabel>
                    </CCol>
                    <CCol>
                      <CFormInput type="text" className='input--light ' />
                    </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                    <CCol xs={12} md={4} lg={3}>
                      <CFormLabel className='col-form-label'>
                        Sitename
                      </CFormLabel>
                    </CCol>
                    <CCol>
                      <CFormInput type="text" className='input--light ' />
                    </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                    <CCol xs={12} md={4} lg={3}>
                      <CFormLabel className='col-form-label'>
                        Bigeographical region
                      </CFormLabel>
                    </CCol>
                    <CCol className='d-flex'>
                      <CFormInput type="text" className='input--light ' /><CImage src={flag} className="ms-3"></CImage>
                    </CCol>
                  </CRow>

                </div>

              </CModalBody>

              <CModalFooter>

                <CButton color="primary">Save</CButton>
              </CModalFooter>
            </CModal>
            {/*   card */}
            <CCard className='card--site' >

              <CCardBody>
                <div className="d-flex justify-content-between align-items-start">

                  <CCardText>

                    <span className='card-tag'>SITE INFO</span>
                    <h3 className='card-title'>32056 | <span className='color--warning'> State: Inactive</span></h3>
                    <ul className='list-unstyled'>
                      <li>State date: 05/08/2018</li>
                      <li>Country: Malta</li>
                      <li>Succesors: 38001,38002</li>
                    </ul>
                    <ul className="btn--list">
                      <li> <CButton color="link" className='btn-link--bold'>View History</CButton></li>
                      <li> <CButton color="link" className='btn-link--bold'>Lifecicle Report</CButton></li>
                    </ul>

                  </CCardText>
                  <CCardImage src={MapImg} width="180px" />
                </div>

              </CCardBody>
            </CCard>

            {/* differences */}
            <div className='border border-primary rounded-2 mt-5 p-2'>
              <CTable className='table-sm'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Sitecode</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Sitename</CTableHeaderCell>
                    <CTableHeaderCell scope="col" >Area</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className='td-separator'></CTableHeaderCell>
                    <CTableHeaderCell scope="col">Sitecode</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Sitename</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Area</CTableHeaderCell>
                    <CTableHeaderCell scope="col">ACtions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow className='align-middle'>
                    <CTableDataCell> BE3025654</CTableDataCell>
                    <CTableDataCell>Vallee du Train</CTableDataCell>
                    <CTableDataCell className=''>3,10000</CTableDataCell>
                    <CTableDataCell className='td-separator'></CTableDataCell>
                    <CTableDataCell> BE3025654</CTableDataCell>
                    <CTableDataCell>Vallee du Train</CTableDataCell>
                    <CTableDataCell>3,10000</CTableDataCell>
                    <CTableDataCell>None</CTableDataCell>
                  </CTableRow>
                  <CTableRow className='align-middle'>
                    <CTableDataCell> BE3025654</CTableDataCell>
                    <CTableDataCell>Vallee du Train</CTableDataCell>
                    <CTableDataCell className=''>3,10000</CTableDataCell>
                    <CTableDataCell className='td-separator'></CTableDataCell>
                    <CTableDataCell className='bg-danger bg-opacity-50'><del>BE3025654</del> </CTableDataCell>
                    <CTableDataCell className='bg-danger bg-opacity-50'><del>Vallee du Train</del> </CTableDataCell>
                    <CTableDataCell className='bg-danger bg-opacity-50'><del>3,10000</del> </CTableDataCell>
                    <CTableDataCell className='bg-danger bg-opacity-50'><strong>Deleted</strong>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow className='align-middle ' >
                    <CTableDataCell className='bg-light'> BE3025654</CTableDataCell>
                    <CTableDataCell className='bg-light'>Vallee du Train</CTableDataCell>
                    <CTableDataCell className='bg-light'>3,10000</CTableDataCell>
                    <CTableDataCell className='td-separator'></CTableDataCell>
                    <CTableDataCell className='bg-light'> BE3025654</CTableDataCell>
                    <CTableDataCell className='bg-light'>Vallee du Train</CTableDataCell>
                    <CTableDataCell className='bg-light'><strong className='color--secondary'>3,10000</strong> </CTableDataCell>
                    <CTableDataCell className='bg-light'><strong className='color--secondary'>Area</strong> </CTableDataCell>
                  </CTableRow>
                  <CTableRow className='align-middle'>
                    <CTableDataCell> BE3025654</CTableDataCell>
                    <CTableDataCell>Vallee du Train</CTableDataCell>
                    <CTableDataCell className=''>3,10000</CTableDataCell>
                    <CTableDataCell className='td-separator'></CTableDataCell>
                    <CTableDataCell> BE3025654</CTableDataCell>
                    <CTableDataCell>Vallee du Train</CTableDataCell>
                    <CTableDataCell>3,10000</CTableDataCell>
                    <CTableDataCell>None</CTableDataCell>
                  </CTableRow>
                  <CTableRow className='align-middle '>
                    <CTableDataCell className='bg-light'> BE3025654</CTableDataCell>
                    <CTableDataCell className='bg-light'>Vallee du Train</CTableDataCell>
                    <CTableDataCell className='bg-light'>3,10000</CTableDataCell>
                    <CTableDataCell className='td-separator'></CTableDataCell>
                    <CTableDataCell className='bg-light'><strong className='color--secondary'> BE3025655</strong></CTableDataCell>
                    <CTableDataCell className='bg-light'>Vallee du Train</CTableDataCell>
                    <CTableDataCell className='bg-light'>3,10000</CTableDataCell>
                    <CTableDataCell className='bg-light' s><strong className='color--secondary'>Recoded</strong></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>

            {/*  union list */}
            <CRow className='mt-4'>
              <CCol xs={12} md={4} lg={3} className="dashed-border--right">
                <h1>Biographical region changes</h1>
                <ul className='secondary-list '>
                  <li className="secondary-list__item">
                    <a href="" className='secondary-list__link'> Alpine</a>
                  </li>
                  <li className="secondary-list__item"><a href="" className='secondary-list__link active'>Atlantic <span className="badge badge--light badge--sm">13</span></a>  </li>
                  <li className="secondary-list__item"><a href="" className='secondary-list__link'>Black Sea</a> </li>
                  <li className="secondary-list__item"><a href="" className='secondary-list__link'>Boreal</a> </li>
                </ul>
              </CCol>
              <CCol xs={12} md={8} lg={9}>
                <h2>Union List Preview</h2>
                <CTable className='mt-5 table-sm'>
                  <CTableHead>
                    <CTableRow>

                      <CTableHeaderCell scope="col">Sitecode</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Level</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Change Category</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Change type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Country</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Tags</CTableHeaderCell>


                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow className='align-middle'>
                      <CTableDataCell><span className='badge badge-fill--warning badge--rounded'>25654</span> </CTableDataCell>
                      <CTableDataCell>Critical</CTableDataCell>
                      <CTableDataCell>Network General Structure</CTableDataCell>
                      <CTableDataCell>Sites added </CTableDataCell>
                      <CTableDataCell>Spain</CTableDataCell>
                      <CTableDataCell>My_tag</CTableDataCell>
                    </CTableRow>
                    <CTableRow className='align-middle'>
                      <CTableDataCell> <span className='badge badge-fill--default badge--rounded'>25654</span> </CTableDataCell>
                      <CTableDataCell>Critical</CTableDataCell>
                      <CTableDataCell>Network General Structure</CTableDataCell>
                      <CTableDataCell>Sites added </CTableDataCell>
                      <CTableDataCell>Spain</CTableDataCell>
                      <CTableDataCell>  <CImage src={flag} ></CImage></CTableDataCell>
                    </CTableRow><CTableRow className='align-middle'>
                      <CTableDataCell> 25654</CTableDataCell>
                      <CTableDataCell>Critical</CTableDataCell>
                      <CTableDataCell>Network General Structure</CTableDataCell>
                      <CTableDataCell>Sites added </CTableDataCell>
                      <CTableDataCell>Spain</CTableDataCell>
                      <CTableDataCell>My_tag</CTableDataCell>
                    </CTableRow>

                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>

          </CContainer>

        </div>
      </div>
    </div>
  )
}

export default Template
