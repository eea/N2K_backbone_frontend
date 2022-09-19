import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// const Template = React.lazy(() => import('./views/pages/template/Template'))
//const Harvesting = React.lazy(() => import('./views/pages/harvesting/harvesting'))
const HarvestingIncoming = React.lazy(() => import('./views/pages/harvesting/incoming'))
const HarvestingReady = React.lazy(() => import('./views/pages/harvesting/ready'))
const HarvestingReadProgress = React.lazy(() => import('./views/pages/harvesting/progress'))
const HarvestingReadPocessed = React.lazy(() => import('./views/pages/harvesting/processed'))
const HarvestingReadAll = React.lazy(() => import('./views/pages/harvesting/all'))
const SiteChanges = React.lazy(() => import('./views/pages/sitechanges/sitechanges'))
const SiteEdition = React.lazy(() => import('./views/pages/siteedition/siteedition'))
const ReportsAdded = React.lazy(() => import('./views/pages/reports/added'))
const ReportsDeleted = React.lazy(() => import('./views/pages/reports/deleted'))
const ReportsChanges = React.lazy(() => import('./views/pages/reports/changes'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            {/* <Route exact path="/template" name="Template Page" render={(props) => <Template {...props} />}/> */}
            <Route exact path="/harvesting/incoming" name="Harvesting" render={(props) => <HarvestingIncoming {...props} />}/>
            <Route exact path="/harvesting/ready" name="Harvesting" render={(props) => <HarvestingReady {...props} />}/>
            <Route exact path="/harvesting/progress" name="Harvesting" render={(props) => <HarvestingReadProgress {...props} />}/>
            <Route exact path="/harvesting/processed" name="Harvesting" render={(props) => <HarvestingReadPocessed {...props} />}/>
            <Route exact path="/harvesting/all" name="Harvesting" render={(props) => <HarvestingReadAll {...props} />}/>
            <Route exact path="/sitechanges" name="Sitechanges" render={(props) => <SiteChanges {...props} />}/>
            <Route exact path="/siteedition" name="Siteedition" render={(props) => <SiteEdition {...props} />}/>
            <Route exact path="/reports/added" name="Reports" render={(props) => <ReportsAdded {...props} />}/>
            <Route exact path="/reports/deleted" name="Reports" render={(props) => <ReportsDeleted {...props} />}/>
            <Route exact path="/reports/changes" name="Reports" render={(props) => <ReportsChanges {...props} />}/>
            <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default App
