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
  Security.avatar().then(res => {return(
    <img src="{res}" />
  )});
}
const Header = (props) => (
  <header className="App-header">
    <div className="bluebar">
      <div className="header-logo">
        <img src={mylogo} alt="logo" />
        <div className="user">
        {
          avatar()
        }
        </div>
      </div>
    </div>
</header>);

export default Header;