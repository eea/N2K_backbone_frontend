import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// const Harvesting = React.lazy(() => import('./views/pages/harvesting/Harvesting'))
// const Sitechanges = React.lazy(() => import('./views/pages/sitechanges/Sitechanges'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  // { path: '/pages/harvesting', name: 'Harvesting', component: Harvesting },
  // { path: '/pages/sitechanges', name: 'Sitechanges', component: Sitechanges },

]

export default routes
