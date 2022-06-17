import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      {/* <AppSidebar /> */}
      <div className="wrapper d-flex flex-column min-vh-100 bg-white">
        <AppHeader />
        <AppContent />
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
