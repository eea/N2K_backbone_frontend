import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <>
      <Suspense>
        <Switch>
          {routes.map((route, idx) => {
            return (
              route.component && (
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
            )
          })}
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </Suspense>
    </>
  )
}

export default React.memo(AppContent)
