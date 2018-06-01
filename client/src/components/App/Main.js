import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Board } from '../Board/Board';
import Invite from '../Invite/Invite';
import Register from '../Register/Register';
import Login from '../Login/Login';
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Board} />
      <Route exact path="/invite" component={Invite} />
      <Route exact path="/register/:r" component={Register} />
      <Route exact path="/login/:r" component={Login} />
    </Switch>
  </main>
)

export default Main;