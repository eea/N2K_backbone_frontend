import React from 'react'
import { NavLink } from "react-router-dom";
import {
  CRow,
  CCol,
  CHeader,
  CHeaderBrand,
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownItemPlain,
  CDropdownDivider,
} from '@coreui/react'

import '@fortawesome/fontawesome-free/css/all.min.css';
import { EULogin } from './EULogin';

const AppHeader = (props) => {

  if(EULogin.userIsLoaded()){
    let url;
    if(url = sessionStorage.getItem("sharedUrl")){
      sessionStorage.removeItem("sharedUrl");
      location.href = url;
    }
  }
    

  const logout = (e) => {
    e.preventDefault();
    EULogin.logout();
  }
  const getUser = () => EULogin.getUserName();

  return (
    <CHeader className='header--custom'>
      <CRow className='align-items-center'>
        <CCol className="header__title">
          <CHeaderBrand href="#" target={props.page === 'share' ? "_blank" : "_self"}>Natura Change Manager</CHeaderBrand>
        </CCol>
        <CCol className='header__links'>
          <ul className="btn--list justify-content-between">
            {props.isLoggedIn !== false &&
              <>
                {props.page !== "share" &&
                  <>
                    <li className="header__item">
                      <NavLink to="/dashboard" activeClassName='header-active' exact={true}>
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="header__item">
                      <NavLink to="/harvesting/ready" activeClassName='header-active'isActive={()=>{return props.page.includes('harvesting')?true:false}}>
                        Harvesting
                      </NavLink>
                    </li>
                    <li className="header__item">
                      <NavLink to="/sitechanges/sitechanges" activeClassName='header-active' isActive={()=>{return props.page.includes('sitechanges')?true:false}}>
                        Site Changes
                      </NavLink>
                    </li>
                    <li className="header__item">
                      <NavLink to="/sitelineage/overview" activeClassName='header-active' isActive={()=>{return props.page.includes('sitelineage')?true:false}}>
                        Site Lineage
                      </NavLink>
                    </li>
                    <li className="header__item">
                      <NavLink to="/releases/management" activeClassName='header-active' isActive={()=>{return props.page.includes('releases')?true:false}}>
                        Releases
                      </NavLink>
                    </li>
                    <li className="header__item">
                      <NavLink to="/reports/releases" activeClassName='header-active' isActive={()=>{return props.page.includes('reports')?true:false}}>
                        Reports
                      </NavLink>
                    </li>
                  </>
                }
                <CDropdown variant="nav-item" alignment="end" className={"header__item" + (props.page === 'share' ? ' ms-auto' : '')}>
                  <CDropdownToggle color="secondary">
                    <CAvatar>
                      <i className="fa-solid fa-circle-user"></i>
                    </CAvatar>
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItemPlain><i className="fa-solid fa-user"></i>{getUser()}</CDropdownItemPlain>
                    {/* <CDropdownItem href="/#/reportingperiod"><i className="fa-regular fa-calendar-days"></i>Reporting Period</CDropdownItem> */}
                    <CDropdownItem href="/#/" onClick={(e)=>logout(e)}><i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out</CDropdownItem>
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
