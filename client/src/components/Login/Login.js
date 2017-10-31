import React, { Component } from 'react';

class Login extends Component {
  login(event) {
    event.preventDefault();
    fetch('/users/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state),
    }).then(res => res.json())
      .then(obj => {
        this.setState(obj)
        this.props.history.push('/');
      });
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
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