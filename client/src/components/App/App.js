import React, { Component } from 'react';
import './App.css';
import Header from '../Header';
import Main from './Main';
import { withRouter } from 'react-router-dom';

class App extends Component {
  state = {
    hash: '',
    store: ''
  }

  componentWillMount() {
    fetch('/users/hash')
      .then(res => res.json())
      .then(hash => {
        this.setState({
          hash: hash
        });
        var store = localStorage.getItem(hash);
        this.setState({
          store: store
        })
      });
  }

  render() {
    if (this.state.store) {
      fetch('/users/valid', {
        method: 'POST',
        data: this.state.store
      });
    } else {
      if (this.props.history && this.props.history.location.pathname !== '/login')
        this.props.history.push('/login');
    }
    return (
      <div className="App">
        <Header />
       <h1>
         <Main />
      </h1>
      </div>
      );
  }
}

const AppWithRouter = withRouter(App);
export default AppWithRouter;
