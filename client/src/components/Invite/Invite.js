import React, { Component } from 'react';

class Invite extends Component {
  parms= {};
  navigateToBoard(event) {
    this.props.history.push('/');
  }

  onFieldChange(event) {
    this.parms[event.target.name] = event.target.value;
  }

  render() {
    return (
      <form onChange={(event) => this.onFieldChange(event)}>
            <div style={{
        textAlign: 'left',
        margin: '10px'
      }}>
                <div className="form-group">
                    <label htmlFor="memberName"> Name:
                        <input className="form-control" type="text" name="memberName" id="memberName" />
                    </label>
                </div>
                <div className="form-group">
                <label htmlFor="memberEmail">Email:
                    <input className="form-control"  type="email" name="memberEmail" />
                </label>
                </div>
                <label>Relation:
                    <select className="form-control"  name="memberrelation">
                        <option>Mother</option>
                        <option>Father</option>
                        <option>Daughter</option>
                        <option>Son</option>
                        <option>Sister</option>                 
                        <option>Brother</option>
                        <option>Aunt</option>
                        <option>Uncle</option>
                        <option>Wife</option>
                        <option>Husband</option>
                    </select>
                </label>
                <div>
                    <button className="btn btn-primary" onClick={this.navigateToBoard.bind(this)}>Send Invite</button>
                </div>
            </div>
        </form>
      );
  }
}

export default Invite;