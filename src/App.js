import React, { Component } from 'react'
import { HashRouter, Route, Switch , Redirect } from 'react-router-dom'
import routes from '../src/routes'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const Home = React.lazy(() => import('./views/other/home'))

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            {!this.props.isLoggedIn ?
              <Route path="/" name="Home" render={(props) => <Home {...props} isLoggedIn={this.props.isLoggedIn} />} />
              : routes.map((route, idx) => {
                  return (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props) => ( this.props.isLoggedIn && (route.path !== "/" ?
                        <route.component {...props} isLoggedIn={this.props.isLoggedIn}/>
                        : <Redirect from="/" to='/dashboard' />)
                      )}
                    />
                  )
                })
            }
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default App
