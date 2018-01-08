import React, { Component } from 'react';
import { Security } from '../../service/Security';
import { Loading } from '../Loading';
import './invite.css';

class Invite extends Component {
  parms= {};

  navigateAway() {
    this.props.history.push('/');
  }

  componentWillMount() {
    var current = Security.getCurrent();
    if (!current) {
      this.navigateAway();
      return;
    }
    window.addEventListener('keydown', function(event) {
      if (event.keyCode === 116) event.preventDefault();
    });
    this.setState({
      loading: true,
      lockFields: true
    });

    this.setState({
      member: current,
      loading: false
    });
  }

  findRelation(obj) {
    if (!obj.target.value) {
      alert('You must select the relation, to continue inviting your relative');
      return;
    }
  }
  navigateToBoard(event) {
    event.preventDefault();

    if (!this.parms.memberrelation || !this.parms.memberName || !this.parms.memberEmail) {
      alert('All fields are mandatory, to continue with the invitation');
      return;
    } else {
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
  }

  onFieldChange(event) {
    this.parms[event.target.name] = event.target.value;
  }

  render() {
    var showLoading = null;
    var relations = [];
    relations.push(<div key="default">We cannot find any family members that we can relate to you.</div>);
    if (this.state && this.state.loading)
      showLoading = <Loading />

    if (this.state.member.family && this.state.member.family.length > 0) {
      relations = [];
      this.state.member.family.filter(data => {
        if (data.depth === 1) {
          relations.push(<div key={data.name}>{data.name}</div>)
        }
      })
    }


    if (this.parms)
      return (
        <div>
        <div className="existingRelation">
          {relations}
        </div>
        <div>
          <h4>Can't find your family member, try inviting them!!</h4>
        </div>
        <div className="inviteForm">
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
                            <input className="form-control" type="text" name="memberName" id="memberName"  readOnly={this.state.lockFields}/>
                        </label>
                      </div>
                      <div className="form-group">
                      <label htmlFor="memberEmail">Email:
                          <input className="form-control"  type="email" name="memberEmail" readOnly={this.state.lockFields}/>
                      </label>
                      </div>
                        <button className="btn btn-primary" onClick={this.navigateToBoard.bind(this)}>Send Invite</button>
                        <button className="btn btn-default" onClick={this.navigateAway.bind(this)}>Cancel</button>
                    </div>
                </div>
            </form>
          </div>
          {showLoading}
        </div>
        );
  }
}

export default Invite;
