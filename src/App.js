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
const Template = React.lazy(() => import('./views/pages/template/Template'))
const Harvesting = React.lazy(() => import('./views/pages/harvesting/harvesting'))
const Sitechanges = React.lazy(() => import('./views/pages/sitechanges/sitechanges'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/template" name="Template Page" render={(props) => <Template {...props} />}/>
            <Route exact path="/harvesting" name="Harvesting" render={(props) => <Harvesting {...props} />}/>
            <Route exact path="/sitechanges" name="Sitechanges" render={(props) => <Sitechanges {...props} />}/>
            <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default App
