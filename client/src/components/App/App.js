import React, { Component } from 'react';
import './App.css';
import Header from '../Header';
import Main from './Main';
import { withRouter } from 'react-router-dom';
import { Security } from '../../service/Security';
import { Status } from '../../service/Enums';
import { Loading } from '../Loading';
import Login from '../Login/Login';
import '../../../node_modules/font-awesome/css/font-awesome.css';
import logo from '../../logo.svg';

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
      });
    });
  }
  state = {
    store: '',
    status: Status.Loading
  }

  logout(props) {
    Security.logout();
    window.location.reload();
  }


  componentWillMount() {
    Security.getHash().then(value => {
      this.setState({
        store: value
      });
      if (this.state.store) {
        Security.validate().then(data => {
          if (data.valid) {
            this.status = Status.Loaded;
            this.setState({
              status: Status.Loaded,
              loggedIn: true
            });
          } else {
            this.setState({
              store: null,
              status: Status.Loaded
            });
          }
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
    var store = Security.get('user');
    if (this.props.location.pathname.indexOf('register') !== -1 && this.state.loggedIn) {
      Security.logout();
    }
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
      <div>
        <Header {...this.props} storedata={store} hash={this.state.store} /> 
        <div className=""> 
        {loader}
        {component} 
        </div>
    </div>
      );

  }
}

const AppWithRouter = withRouter(App);
export default AppWithRouter;
