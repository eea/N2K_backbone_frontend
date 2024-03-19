import React from 'react'

const Home = React.lazy(() => import('./views/other/home'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const HarvestingIncoming = React.lazy(() => import('./views/pages/harvesting/incoming'))
const HarvestingReady = React.lazy(() => import('./views/pages/harvesting/ready'))
const HarvestingReadProgress = React.lazy(() => import('./views/pages/harvesting/progress'))
const HarvestingReadPocessed = React.lazy(() => import('./views/pages/harvesting/processed'))
const HarvestingReadAll = React.lazy(() => import('./views/pages/harvesting/all'))
const SiteChanges = React.lazy(() => import('./views/pages/sitechanges/changes'))
const NoChanges = React.lazy(() => import('./views/pages/sitechanges/nochanges'))
const ReportsReleases = React.lazy(() => import('./views/pages/reports/releases'))
const ReportsSites = React.lazy(() => import('./views/pages/reports/sites'))
const ReportsStatus = React.lazy(() => import('./views/pages/reports/status'))
const ReportsManual = React.lazy(() => import('./views/pages/reports/manual'))
const ReportsUnion = React.lazy(() => import('./views/pages/reports/unionlists'))
const ReleasesManagement = React.lazy(() => import('./views/pages/releases/management'))
const ReleasesDocumentation = React.lazy(() => import('./views/pages/releases/documentation'))
const ReleasesComparer = React.lazy(() => import('./views/pages/releases/comparer'))
const UnionLists = React.lazy(() => import('./views/pages/releases/unionlists'))
const SiteEditionOverview = React.lazy(() => import('./views/pages/releases/siteeditionoverview'))
const SiteEdition = React.lazy(() => import('./views/pages/releases/siteedition'))
const LineageOverview = React.lazy(() => import('./views/pages/sitelineage/overview'))
const LineageManagement = React.lazy(() => import('./views/pages/sitelineage/management'))
const LineageHistory = React.lazy(() => import('./views/pages/sitelineage/history'))
const ShareSite = React.lazy(() => import('./views/pages/sitechanges/sharesite'))
const ReportingPeriod = React.lazy(() => import('./views/pages/reportingperiod/reportingperiod'))
const SDF = React.lazy(() => import('./views/pages/sdf/sdf'))
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
  { path: '/sitechanges/changes', exact: true, name: 'Sitechanges', component: SiteChanges },
  { path: '/sitechanges/nochanges', exact: true, name: 'Nochanges', component: NoChanges },
  { path: '/reports/releases', exact: true, name: 'Reports', component: ReportsReleases },
  { path: '/reports/sites', exact: true, name: 'Reports', component: ReportsSites },
  { path: '/reports/status', exact: true, name: 'Reports', component: ReportsStatus },
  { path: '/reports/manual', exact: true, name: 'Reports', component: ReportsManual },
  { path: '/reports/unionlists', exact: true, name: 'Reports', component: ReportsUnion },
  { path: '/releases/management', exact: true, name: 'Releases', component: ReleasesManagement },
  { path: '/releases/documentation', exact: true, name: 'Releases', component: ReleasesDocumentation },
  { path: '/releases/comparer', exact: true, name: 'Releases', component: ReleasesComparer },
  { path: '/releases/unionlists', exact: true, name: 'Releases', component: UnionLists },
  { path: '/releases/siteeditionoverview', exact: true, name: 'Releases', component: SiteEditionOverview },
  { path: '/releases/siteedition', exact: true, name: 'Releases', component: SiteEdition },
  { path: '/sitelineage/overview', exact: true, name: 'SiteLineage', component: LineageOverview },
  { path: '/sitelineage/management', exact: true, name: 'SiteLineage', component: LineageManagement },
  { path: '/sitelineage/history', exact: true, name: 'SiteLineage', component: LineageHistory },
  { path: '/sharesite', exact: true, name: 'Share', component: ShareSite },
  { path: '/reportingperiod', exact: true, name: 'ReportingPeriod', component: ReportingPeriod },
  { path: '/sdf', exact: true, name: 'SDF', component: SDF},
  { path: '/*', name: 'Not Found', component: NotFound },
]

export default routes
