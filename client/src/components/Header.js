import React from 'react';
import logo from '../logo.svg';
import { Security } from '../service/Security';
import './header.css';
import mylogo from '../mylogo.svg';

function logout(props) {
  Security.logout();
  window.location.reload();
}

function avatar() {
  Security.avatar().then(res => {
    return (
      <img src="{res.src}" />
    )
  });
}

var avatar = (store) => {
  var temp = null;
  if (store) {
    temp = <img className="user" src={"/users/avatar/" + store}/>
  }
  return (
    temp
    );
}

const Header = (props, store) => (
  <header className="App-header">
    <div className="bluebar">
      <div className="header-logo">
        <img src={mylogo} alt="logo" />
        <div className="userDiv">
          {avatar(props.storedata)}
        </div>
      </div>
    </div>
</header>);

export default Header;