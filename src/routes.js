import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Sitechanges = React.lazy(() => import('./views/pages/sitechanges/sitechanges'))
const Siteedition = React.lazy(() => import('./views/pages/siteedition/siteedition'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/pages/sitechanges', name: 'Sitechanges', component: Sitechanges },
  { path: '/pages/siteedition', name: 'siteedition', component: Siteedition },
]

export default routes
