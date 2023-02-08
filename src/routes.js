import React from 'react'

const Home = React.lazy(() => import('./views/other/home'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const HarvestingIncoming = React.lazy(() => import('./views/pages/harvesting/incoming'))
const HarvestingReady = React.lazy(() => import('./views/pages/harvesting/ready'))
const HarvestingReadProgress = React.lazy(() => import('./views/pages/harvesting/progress'))
const HarvestingReadPocessed = React.lazy(() => import('./views/pages/harvesting/processed'))
const HarvestingReadAll = React.lazy(() => import('./views/pages/harvesting/all'))
const SiteChanges = React.lazy(() => import('./views/pages/sitechanges/sitechanges'))
const ReportsAdded = React.lazy(() => import('./views/pages/reports/added'))
const ReportsDeleted = React.lazy(() => import('./views/pages/reports/deleted'))
const ReportsChanges = React.lazy(() => import('./views/pages/reports/changes'))
const ReleasesManagement = React.lazy(() => import('./views/pages/releases/management'))
const ReleasesComparer = React.lazy(() => import('./views/pages/releases/comparer'))
const UnionLists = React.lazy(() => import('./views/pages/releases/unionlists'))
const SiteEdition = React.lazy(() => import('./views/pages/releases/siteedition'))
const SiteLineage = React.lazy(() => import('./views/pages/sitelineage/sitelineage'))
const ShareSite = React.lazy(() => import('./views/pages/sitechanges/sharesite'))
const NotFound = React.lazy(() => import('./views/other/notfound'))
//const NotAuthorized = React.lazy(() => import('./views/other/notauthorized'))

const routes = [
  { path: '/', exact: true, name:'Home', component: Home },
  { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/harvesting/incoming', exact: true, name: 'Harvesting', component: HarvestingIncoming },
  { path: '/harvesting/ready', exact: true, name: 'Harvesting', component: HarvestingReady },
  { path: '/harvesting/progress', exact: true, name: 'Harvesting', component: HarvestingReadProgress },
  { path: '/harvesting/processed', exact: true, name: 'Harvesting', component: HarvestingReadPocessed },
  { path: '/harvesting/all', exact: true, name: 'Harvesting', component: HarvestingReadAll },
  { path: '/sitechanges', exact: true, name: 'Sitechanges', component: SiteChanges },
  { path: '/sitelineage', exact: true, name: 'SiteLineage', component: SiteLineage },
  { path: '/reports/added', exact: true, name: 'Reports', component: ReportsAdded },
  { path: '/reports/deleted', exact: true, name: 'Reports', component: ReportsDeleted },
  { path: '/reports/changes', exact: true, name: 'Reports', component: ReportsChanges },
  { path: '/releases/management', exact: true, name: 'Releases', component: ReleasesManagement },
  { path: '/releases/comparer', exact: true, name: 'Releases', component: ReleasesComparer },
  { path: '/releases/unionlists', exact: true, name: 'Releases', component: UnionLists },
  { path: '/releases/siteedition', exact: true, name: 'Releases', component: SiteEdition },
  { path: '/sharesite', exact: true, name: 'Share', component: ShareSite },
  { path: '/*', name: 'Not Found', component: NotFound },
]

export default routes
