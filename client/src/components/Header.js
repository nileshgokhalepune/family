import React from 'react';
import logo from '../logo.svg';

const Header = (props) => (
  <header className="App-header">
    <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="#"><img className="App-logo" src={logo} width="50" height="50" alt="logo" />Family</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="#"  onClick={() => props.history.push('/')}>Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"   onClick={() => props.history.push('/')}>Logout</a>
                </li>
            </ul>
        </div>
    </nav>
    
</header>);

export default Header;