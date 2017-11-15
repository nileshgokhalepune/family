import React, { Component } from 'react';
import { Security } from '../../service/Security';
import { Loading } from '../Loading';

class Invite extends Component {
  parms= {};
  navigateToBoard(event) {
    event.preventDefault();
    this.setState({
      loading: true
    });
    Security.invite(this.parms, Security.get()).then(data => {
      if (data && data.message) console.log(`Message:${data.message}`);
      this.props.history.push('/');
    }).catch(err => {
      alert(err);
      this.props.history.push('/');
    });
  }

  onFieldChange(event) {
    this.parms[event.target.name] = event.target.value;
  }

  render() {
    var showLoading = null;
    if (this.state && this.state.loading)
      showLoading = <Loading />

      return (
        <div>
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
        {showLoading}
        </div>
        );
  }
}

export default Invite;
