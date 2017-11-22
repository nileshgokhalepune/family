import React from 'react';
import logo from '../logo.svg';
import { Security } from '../service/Security';
import './header.css';
import mylogo from '../mylogo.svg';

function logout(props) {
  Security.logout();
  window.location.reload();
}
 
var avatar = (store, hash) => {
  var temp = null;
  if (store && hash) {
    temp = (
      <div className="avatar">
        <img src={"/users/avatar/" + hash} alt={store.name}/>
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
      <div className="header-logo">
        <img src={mylogo} alt="logo" />
      </div>
      <div className="userDiv">
          {avatar(props.storedata, props.hash)}
      </div>
      {logoutButton(props.storedata)}
    </div>
</header>);

export default Header;