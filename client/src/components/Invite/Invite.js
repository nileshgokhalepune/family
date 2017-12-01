import React, { Component } from 'react';
import { Security } from '../../service/Security';
import { Loading } from '../Loading';

class Invite extends Component {
  parms= {};

  navigateAway() {
    this.props.history.push('/');
  }

  componentWillMount() {
    this.setState({
      member: {},
      lockFields:true
    })
  }

  findRelation(obj) {
    this.setState({
      loading: true
    });
    Security.findRelation(obj.target.value)
      .then(data => {
        var member = {
          email: data.email,
          memberName: data.memberName
        }
        this.setState({
          member: member
        })
      })
      .catch(err => alert(err));
  }
  navigateToBoard(event) {
    event.preventDefault();
    this.setState({
      loading: true
    });
    Security.invite(this.parms, window.location.host, Security.get()).then(data => {
      if (data && data.message) console.log(`Message:${data.message}`);
      this.navigateAway()
    }).catch(err => {
      alert(err);
      this.navigateAway()
    });
  }

  onFieldChange(event) {
    this.parms[event.target.name] = event.target.value;
  }

  render() {
    var showLoading = null;
    if (this.state && this.state.loading)
      showLoading = <Loading />

    if(this.parms)
    return (
      <div>
      <form onChange={(event) => this.onFieldChange(event)}>
          <div style={{
              textAlign: 'left',
              margin: '10px'
            }}>
                <div className="form-group">
                
                  <label>Relation:
                      <select className="form-control"  name="memberrelation" onChange={this.findRelation.bind(this)}>
                          <option></option>
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
                    <label htmlFor="memberName"> Name:
                        <input className="form-control" type="text" name="memberName" id="memberName" defaultValue={this.state.member.memberName} readOnly={this.state.lockFields}/>
                    </label>
                  </div>
                  <div className="form-group">
                  <label htmlFor="memberEmail">Email:
                      <input className="form-control"  type="email" name="memberEmail" defaultValue={this.state.member.email}  readOnly={this.state.lockFields}/>
                  </label>
                  </div>
                    <button className="btn btn-primary" onClick={this.navigateToBoard.bind(this)}>Send Invite</button>
                    <button className="btn btn-default" onClick={this.navigateAway.bind(this)}>Cancel</button>
                </div>
            </div>
        </form>
        {showLoading}
        </div>
      );
  }
}

export default Invite;
