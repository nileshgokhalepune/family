import React from 'react';
import logo from '../logo.svg';
import { Security } from '../service/Security';

function logout(props) {
  Security.logout();
  window.location.reload();
}

const Header = (props) => (
<header className="App-header">
    <div>
    </div>
</header>);

export default Header;