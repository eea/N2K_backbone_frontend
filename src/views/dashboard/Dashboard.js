import React, { lazy } from 'react'

import {
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CFormLabel,
  CCol,
  CFormSelect,
  CContainer,
  CRow,
  CCardTitle
} from '@coreui/react'

import {
  CChartBar,
  CChartLine,
  CChartPie,  
} from '@coreui/react-chartjs'

import MapImg from './../../assets/images/map.jpg'
import moreicon from './../../assets/images/three-dots.svg'

import justificationrequired from './../../assets/images/exclamation.svg'
import justificationprovided from './../../assets/images/file-text.svg'
import trash from './../../assets/images/trash.svg'
import flag from './../../assets/images/flag.svg'

import albania from './../../../src/assets/images/flags/albania.png'
import austria from './../../../src/assets/images/flags/austria.png'
import belgium from './../../../src/assets/images/flags/belgium.png'
import bulgaria from './../../../src/assets/images/flags/bulgaria.png'

import croatia from './../../../src/assets/images/flags/croatia.png'
import cyprus from './../../../src/assets/images/flags/cyprus.png'
import czech from './../../../src/assets/images/flags/czech.png'
import denmark from './../../../src/assets/images/flags/denmark.png'

import estonia from './../../../src/assets/images/flags/estonia.png'
import finland from './../../../src/assets/images/flags/finland.png'
import france from './../../../src/assets/images/flags/france.png'
import germany from './../../../src/assets/images/flags/germany.png'

import greece from './../../../src/assets/images/flags/greece.png'
import hungary from './../../../src/assets/images/flags/hungary.png'
import iceland from './../../../src/assets/images/flags/iceland.png'

import ireland from './../../../src/assets/images/flags/ireland.png'
import italy from './../../../src/assets/images/flags/italy.png'
import latvia from './../../../src/assets/images/flags/latvia.png'
import liechtenstein from './../../../src/assets/images/flags/liechtenstein.png'

import lithuania from './../../../src/assets/images/flags/lithuania.png'
import luxembourg from './../../../src/assets/images/flags/luxembourg.png'
import macedonia from './../../../src/assets/images/flags/macedonia.png'
import malta from './../../../src/assets/images/flags/malta.png'

import montenegro from './../../../src/assets/images/flags/montenegro.png'
import netherlands from './../../../src/assets/images/flags/netherlands.png'
import norway from './../../../src/assets/images/flags/norway.png'
import poland from './../../../src/assets/images/flags/poland.png'

import portugal from './../../../src/assets/images/flags/portugal.png'
import romania from './../../../src/assets/images/flags/romania.png'
import serbia from './../../../src/assets/images/flags/serbia.png'
import slovakia from './../../../src/assets/images/flags/slovakia.png'

import slovenia from './../../../src/assets/images/flags/slovenia.png'
import spain from './../../../src/assets/images/flags/spain.png'
import sweden from './../../../src/assets/images/flags/sweden.png'
import switzerland from './../../../src/assets/images/flags/switzerland.png'

const Dashboard = () => {  

  return (
    <>
      <CContainer fluid>  
        <div className="select--right">
          <CRow >
            <CFormLabel htmlFor="exampleFormControlInput1" className='form-label col-md-4 col-form-label'>Country</CFormLabel>
            <CCol>
              <CFormSelect aria-label="Default select example">
                <option>All</option>
                <option value="1">Austria</option>
                <option value="2">Belgium</option>
                <option value="3">Bulgaria</option>
                <option value="3">...</option>
              </CFormSelect></CCol>
          </CRow>
        </div>
        <h1 className="h1-main">Dashboard</h1>
     
      <CRow>
        <CCol xs={12} md={8} lg={12}>
          <div className="container-card-dashboard">
            <div className="d-flex gap-3 p-4 justify-content-between">
              <CCard className='card-dashboard-new'>
                <CCardBody>
                  <div className="card-icon-new">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                    </svg>
                  </div>
                  <CCardText className='card-text-new'>
                    <span className='card__number'>
                      32
                    </span>
                    PENDING SUBMISSIONS
                  </CCardText>
                </CCardBody>
              </CCard>
              <CCard className='card-dashboard-new'>
                  <div className="card-icon-new">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                      <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z" />
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z" />
                    </svg>
                  </div>
                  <CCardText className='card-text-new'>
                    <span className='card__number'>
                      32
                    </span>
                    PENDING CHANGES
                  </CCardText>                
              </CCard>
              <CCard className='card-dashboard-new'>
                <CCardBody>
                <div className="card-icon-new">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                      <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z" />
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z" />
                    </svg>
                  </div>
                  <CCardText className='card-text-new'>
                    RELEASES & UNION LIST
                  </CCardText>
                </CCardBody>
              </CCard>
              <CCard className='card-dashboard-new'>
                <CCardBody>
                  <div className="card-icon-new">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-clipboard-data-fill" viewBox="0 0 16 16">
                      <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z" />
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1ZM10 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8Zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm4-3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" />
                    </svg>
                  </div>
                  <CCardText className='card-text-new'>
                    NEW REPORTS
                  </CCardText>
                </CCardBody>
              </CCard>
            </div>
          </div>
          <h1 className='h1-main'>Countries</h1>
          <div className="p-4 bg-white rounded-2 mb-5">
            <div className="d-flex gap-3 justify-content-between">
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={albania} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Austria</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>2 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={austria} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Albania</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>2 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={belgium} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Belgium</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>1 Critical</span>
                        <span className='badge color--warning'>1 Medium</span>
                        <span className='badge color--success'>1 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={bulgaria} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Bulgary</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>3 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
             </div>
             <div className="d-flex my-4 gap-3 justify-content-between">
             <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={croatia} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Albania</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>2 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={cyprus} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Austria</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>2 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={czech} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Belgium</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>1 Critical</span>
                        <span className='badge color--warning'>1 Medium</span>
                        <span className='badge color--success'>1 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={denmark} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Bulgaria</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>3 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
             </div>
             <div className="d-flex my-4 gap-3 justify-content-between">
             <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={estonia} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Estonia</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>2 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={finland} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Finland</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>2 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={france} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>France</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>1 Critical</span>
                        <span className='badge color--warning'>1 Medium</span>
                        <span className='badge color--success'>1 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                <CRow>
                  <CCol xs={2} md={2} lg={2}>
                    <CCardImage className="p-1 card-img--flag" src={germany} width="32px" />
                  </CCol>
                  <CCol xs={8} md={8} lg={8} className="p-0">
                    <h2 className='p-2'>Germany</h2>
                    <CCardBody className='px-2'>
                      <CCardText>
                        <span className='badge color--critical'>3 Critical</span>
                        <span className='badge color--warning'>7 Medium</span>
                        <span className='badge color--success'>2 Warning</span>
                      </CCardText>                  
                    </CCardBody>
                  </CCol>
                  <CCol xs={2} md={2} lg={2}>
                  </CCol>
                </CRow>
              </CCard>      
             </div>
             <div className="d-flex my-4 gap-3 justify-content-between">
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={greece} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Greece</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={hungary} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Hungary</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={iceland} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Ireland</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>1 Critical</span>
                          <span className='badge color--warning'>1 Medium</span>
                          <span className='badge color--success'>1 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={ireland} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Iceland</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>3 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
             </div>
             <div className="d-flex my-4 gap-3 justify-content-between">
             <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={italy} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Liechtenstein</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={latvia} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Lithuania</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={liechtenstein} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Luxembourg</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>1 Critical</span>
                          <span className='badge color--warning'>1 Medium</span>
                          <span className='badge color--success'>1 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={lithuania} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Latvia</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>3 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
             </div>
             <div className="d-flex my-4 gap-3 justify-content-between">
             <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={luxembourg} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Montenegro</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={macedonia} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>North Macedonia</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={malta} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Monaco</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>1 Critical</span>
                          <span className='badge color--warning'>1 Medium</span>
                          <span className='badge color--success'>1 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={montenegro} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Netherlands</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>3 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
             </div>
             <div className="d-flex my-4 gap-3 justify-content-between">
             <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={netherlands} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Norway</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={norway} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Poland</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={poland} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Portugal</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>1 Critical</span>
                          <span className='badge color--warning'>1 Medium</span>
                          <span className='badge color--success'>1 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={portugal} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Portugal</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>3 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
             </div>
             <div className="d-flex my-4 gap-3 justify-content-between">
             <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={romania} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Romania</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={serbia} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Serbia</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={slovakia} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Slovakia</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>1 Critical</span>
                          <span className='badge color--warning'>1 Medium</span>
                          <span className='badge color--success'>1 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag"  src={slovenia} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Slovenia</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>1 Critical</span>
                          <span className='badge color--warning'>1 Medium</span>
                          <span className='badge color--success'>1 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
             </div>
             <div className="d-flex my-4 gap-3 justify-content-between">
             <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={spain} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Spain</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={sweden} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Sweden</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>2 Critical</span>
                          <span className='badge color--warning'>7 Medium</span>
                          <span className='badge color--success'>2 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag" src={switzerland} width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'>Switzerland</h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>1 Critical</span>
                          <span className='badge color--warning'>1 Medium</span>
                          <span className='badge color--success'>1 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
              <CCard className='m-0 py-1 country-card h-100'>
                  <CRow>
                    <CCol xs={2} md={2} lg={2}>
                      <CCardImage className="p-1 card-img--flag"  width="32px" />
                    </CCol>
                    <CCol xs={8} md={8} lg={8} className="p-0">
                      <h2 className='p-2'></h2>
                      <CCardBody className='px-2'>
                        <CCardText>
                          <span className='badge color--critical'>1 Critical</span>
                          <span className='badge color--warning'>1 Medium</span>
                          <span className='badge color--success'>1 Warning</span>
                        </CCardText>                  
                      </CCardBody>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                    </CCol>
                  </CRow>
              </CCard>
             </div>
          </div>

          <h1 className='h1-main'>Pending Changes</h1>
          <div className="p-2 bg-white rounded-4 mb-5">
            <div className="d-flex gap-3 justify-content-between">
              <CCard className='country-card'>
                <CCardTitle className='contry-title'>
                  <h2>25645 | Spain</h2> 
                </CCardTitle>
                <CCardBody>
                <CCardText>
                  <span className='badge color--critical'>2 Critical</span>
                  <span className='badge color--warning'>7 Medium</span>
                  <span className='badge color--success'>2 Warning</span>
                </CCardText>
                  <p>Review Changes</p>
                </CCardBody>
              </CCard>
              <CCard className='country-card'>     
                <CCardTitle>
                  <h2>13502 | Malta</h2> 
                </CCardTitle>
                <CCardBody>
                <CCardText>
                  <span className='badge color--critical'>1 Critical</span>
                  <span className='badge color--warning'>6 Medium</span>
                </CCardText>
                  <p>Review Changes</p>
                </CCardBody>
              </CCard>
              <CCard className='country-card'>     
                <CCardTitle>
                  <h2>90877 | Italy</h2> 
                </CCardTitle>
                <CCardBody>
                <CCardText>
                  <span className='badge color--success'>1 Warning</span>
                </CCardText>
                  <p>Review Changes</p>
                </CCardBody>
              </CCard>
              <CCard className='country-card'>
                     
                <CCardTitle>
                  <h2>90877 | France</h2> 
                </CCardTitle>
                <CCardBody>
                <CCardText>
                  <span className='badge color--success'>1 Warning</span>
                </CCardText>
                  <p>Review Changes</p>
                </CCardBody>
              </CCard>
            </div>     
          </div>
          
          <h1 className='h1-main'>Summary</h1>
          <div className="shadow p-4 bg-white rounded-2 mb-5">
            <div className="d-flex gap-3 justify-content-between">
            <CCol xs={12} md={4} lg={3} className='bg-white'>        
              <div className='p-4 bg-white rounded-2 mb-4'>
                <div className='p-4 border rounded-2 mb-4'>
                  <h2>Activity (accepted/rejected changes)</h2>
                  <CChartBar
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          backgroundColor: '#1F4E79',
                          data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                        },
                      ],
                    }}
                    labels="months"
                  />
            </div>
          </div>
            </CCol>
            <CCol xs={12} md={4} lg={3} className='bg-white'>
              <div className='p-4 border bg-white rounded-2 mb-4'>
                    <h2>Recent site changes per country</h2>
                    <CChartPie
                      data={{
                        labels: ['Spain', 'Italy', 'France', 'Poland'],
                        datasets: [
                          { 
                            data: [100, 300, 50, 100],
                            backgroundColor: ['#D0E3F4', '#ADCDF1', '#418BCF', '#1F4E79'],
                          },
                        ],
                      }}
                      labels="Percentage"
                    />
                  </div>
            </CCol>
            <CCol xs={12} md={4} lg={3} className='bg-white'>
              <div className='p-4 border rounded-2 bg-white mb-'>
                    <h2>Submissions received and pending</h2>
                    <CChartLine
                      data={{
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        datasets: [
                          {
                            label: 'My First dataset',
                            backgroundColor: '#1F4E79',
                            borderColor: 'rgba(220, 220, 220, 1)',
                            pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                            pointBorderColor: '#fff',
                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                          },
                          {
                            label: 'My Second dataset',
                            backgroundColor: 'rgba(151, 187, 205, 0.2)',
                            borderColor: 'rgba(151, 187, 205, 1)',
                            pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                            pointBorderColor: '#fff',
                            data: [50, 12, 28, 29, 7, 25, 12, 70, 60],
                          },
                        ],
                      }}
                    />
                  </div>
            </CCol>
            </div>
          </div>
        </CCol>        
      </CRow>
      </CContainer>  
    </>
  )
}

export default Dashboard
