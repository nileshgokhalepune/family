import React, { Component } from 'react';
import { Security } from '../../service/Security';
class Login extends Component {
  parms={
  };
  loggedIn = false;


  login(event) {
    event.preventDefault();
    Security.login(this.parms).then(data => {
      this.loggedIn = true;
      this.props.handler();
    });
  }

  onFieldChange(event) {
    this.parms[event.target.name] = event.target.value;
  // this.setState({
  //   [event.target.name]: event.target.value
  // });
  }

  stateChanged(event) {}

  render() {
    return (
      <form onChange={(event) => this.onFieldChange(event)}>
        <div className="form-group">
            <label>User name:
                <input className="form-control" name="userName"  type="text" id="userName"/>
            </label>
            <label>Password:
                <input className="form-control" name="password" type="password" id="password"/>
            </label>
            <button className="btn btn-primary" onClick={(event) => this.login(event)}>Login</button> 
        </div>
      </form>
    )
  }
}

export default Login;