import React, { Component } from 'react';

class Register extends Component {

  parms = {
  };
  onFieldChange(event) {
    this.parms[event.target.name] = event.target.value;
  }


  render() {
    return (
      <form>
          <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" />
          </div>
      </form>
    )
  }
}

export default Register;