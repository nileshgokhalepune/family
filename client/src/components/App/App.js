import React, { Component } from 'react';
import './App.css';
import Header from '../Header';
import Main from './Main';
import { withRouter } from 'react-router-dom';
import { Security } from '../../service/Security';
import { Status } from '../../service/Enums';
import { Loading } from '../Loading';
import Login from '../Login/Login';
class App extends Component {

  constructor(props) {
    super(props);
    this.loggedin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    Security.getHash().then(data => {
      this.setState({
        loggedIn: true,
        store: data
      })
    });
  }
  state = {
    store: '',
    status: Status.Loading
  }

  componentWillMount() {
    Security.getHash().then(value => {
      this.setState({
        store: value
      });
      if (this.state.store) {
        Security.validate(this.state.store).then(data => {
          this.status = Status.Loaded;
          this.setState({
            status: Status.Loaded,
            loggedIn: true
          });
        });
      } else {
        this.setState({
          status: Status.Loaded
        });
      }
    });
  }

  render() {
    var loader;
    var component;
    if (this.state && this.state.status === Status.Loading) {
      loader = <Loading />
      component = null;
    } else if (!this.state.store && this.state.status === Status.Loaded) {
      loader = null;
      component = <Login handler={this.loggedin}/>
    } else if (this.state.status === Status.Loaded && this.state.loggedIn) {
      loader = null;
      component = <Main />
    }

    return (
      <div className="App">
      <Header />
     <h1>    
       {loader}
       {component}
    </h1>
    </div>
      );

  }
}

const AppWithRouter = withRouter(App);
export default AppWithRouter;
