import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Board } from '../Board/Board'; 
import Invite from '../Invite/Invite';

const Main = () => (
  <main>
      <Switch>
        <Route exact path='/' component={Board} />
        <Route exact path="/invite" component={Invite} /> 
      </Switch>
    </main>
)

export default Main;