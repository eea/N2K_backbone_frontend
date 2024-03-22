import React from 'react'
import { CSidebar, CSidebarNav } from '@coreui/react'
import 'simplebar/dist/simplebar.min.css'

const AppSidebar = (props) => {

  return (
    <CSidebar className="sidebar--light">
      <CSidebarNav>
        <li className="nav-title">{props.title}</li>
        {props.options.map(item => 
          <li className="nav-item" key={item}>
            <a className={"nav-link" + (item.active ? " active" : "")} href={item.path}>
              <i className="fa-solid fa-bookmark"></i>
              {item.name}
            </a>
          </li>
        )}
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
