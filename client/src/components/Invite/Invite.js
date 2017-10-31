import React, { Component } from 'react';

class Invite extends Component {
    render(){
        return(
            <form onChange={(event) => this.onFieldChange(event)}>
            <div>
                <div className="form-group">
                    <label for="memberName"> Name:
                        <input className="form-control" type="text" name="memberName" id="memberName" />
                    </label>
                </div>
                <div className="form-group">
                <label>Email:
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
                    </select>
                </label>
                <button onClick={this.navigateToBoard.bind(this)}>Send Invite</button>
            </div>
        </form>
        );
    }
}

export default Invite;