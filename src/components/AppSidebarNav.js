import React from 'react'

export const AppSidebarNav = () => {
    
  return (
    <div>
      <CSidebar className='sidebar--light'>
          <CSidebarNav>
            <li className="nav-title">Site changes</li>
            <li className="nav-item">
              <a href="" className="nav-link active"> <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg>Changes management</a>
            </li>
            <li className="nav-item">
              <a href="" className="nav-link"> <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg>No Changes</a>
            </li>
            <li className="nav-item">
              <a href="" className="nav-link"> <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#696E70" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg>Changes History</a>
            </li>
          </CSidebarNav>          
        </CSidebar>
    </div>
  )
}
