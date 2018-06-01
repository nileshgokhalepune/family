import React from 'react';
import { Security } from '../service/Security';
import './header.css';
import mylogo from '../mylogo.svg';
import { Redirect } from 'react-router-dom';
function logout(props) {
  Security.logout();
  window.location.reload();
}

function navigateHome(history) {
  history.push('/');
}
var avatar = (store, hash) => {
  var temp = null;
  if (store && hash) {
    temp = (
      <div className="avatar">
        <img src={"/users/avatar/" + hash} alt={store.name} />
        <div>
          <span>{store.name}</span>
        </div>
      </div>)
  }
  return (
    temp
  );
}


var logoutButton = (store) => {
  if (store) {
    return (
      <div className="logout">
        <a href="" onClick={() => logout()}>Logout</a>
      </div>)
  }
  return null;
}

const Header = (props, store) => (
  <header className="App-header">
    <div className="bluebar">
      <div style={{ cursor: "pointer" }} className="header-logo">
        <a onClick={() => navigateHome(props.history)}>
          <img src={mylogo} alt="logo" />
        </a>
      </div>
      <div className="userDiv">
        {avatar(props.storedata, props.hash)}
      </div>
      {logoutButton(props.storedata)}
    </div>
  </header>);

export default Header;