import React, { Component } from 'react'
import { HashRouter, Route, Switch , Redirect } from 'react-router-dom'
import routes from '../src/routes'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={(props) => (
                    <>
                      <route.component {...props} />
                    </>
                  )}
                  />
                )
              })
            }
            {/* {!this.props.isLoggedIn &&
              <Redirect to="/notauthorized" />
            } */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default App
