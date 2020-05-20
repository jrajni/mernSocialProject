import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './Components/layouts/Navbar'
import Landing from './Components/layouts/Landing'
import Register from './Components/auth/register'
import Login from './Components/auth/login'
import { store, persistor } from './store'
import Alert from './Components/layouts/alert'
import { Provider } from 'react-redux'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'
import Dashboard from './Components/dashboard/dashboard'
import CreateProfile from './Components/profile-forms/createProfile'
import AddExperience from './Components/profile-forms/addExperience'
import AddEducation from './Components/profile-forms/addEducation'

import EditProfile from './Components/profile-forms/editProfile'

import { PersistGate } from "redux-persist/lib/integration/react";

import PrivateRoute from './Components/routing/PrivateRoute'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Fragment>
            <Navbar />
            <Route exact path="/" component={Landing} />
            <section className="container">
              <Alert />
              <switch >
                <Route exact path="/register" component={Register}></Route>
                <Route exact path="/login" component={Login}></Route>
                <PrivateRoute exact path="/dashboard" component={Dashboard}></PrivateRoute>
                <PrivateRoute exact path="/create-profile" component={CreateProfile}></PrivateRoute>
                <PrivateRoute exact path="/edit-profile" component={EditProfile}></PrivateRoute>
                <PrivateRoute exact path="/add-experience" component={AddExperience}></PrivateRoute>
                <PrivateRoute exact path="/add-education" component={AddEducation}></PrivateRoute>

              </switch>
            </section>
          </Fragment>
        </Router>
      </PersistGate>
    </Provider>);
}

export default App;
