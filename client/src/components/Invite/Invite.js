import React, { Component } from 'react';
import { Security } from '../../service/Security';
import { Loading } from '../Loading';
import './invite.css';
import RCG from 'react-captcha-generator';

const Captcha = require('react-captcha');

const ExistingMember = (props) => {

  if (props) {
    return (
      <li className="list-group-item">
        <div className="card">
          <a href="#" onClick={props.click} title="Invite">
            <span className="badge badge-primary">{props.member.name}</span>
          </a>
        </div>
      </li>
    );
  } else {
    return null;
  }
}

class Invite extends Component {
  parms = {};

  constructor(props) {
    super(props);
    this.state = {
      captcha: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.result = this.result.bind(this);
    this.check = this.check.bind(this);
  }
  navigateAway() {
    this.props.history.push('/');
  }

  componentWillMount() {
    var current = Security.getCurrent();
    if (!current) {
      this.navigateAway();
      return;
    }
    Security.getPossibleRelations()
      .then(data => {
        this.setState({
          potentials: data
        })
      })
    window.addEventListener('keydown', function (event) {
      if (event.keyCode === 116) event.preventDefault();
    });
    this.setState({
      loading: true,
      lockFields: false
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

  inviteExisting(data, event) {
    debugger;
  }

  navigateToBoard(event) {
    event.preventDefault();
    if (!this.parms.memberrelation || !this.parms.memberName || !this.parms.memberEmail) {
      alert('All fields are mandatory, to continue with the invitation');
      return;
    }

    if (!this.captchaEnter.value) {
      alert('The text you entered does not match the text in the image');
      return;
    }

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

  findByName(obj) {
    debugger;
    if (!obj.target.value) {
      return;
    } else {
      Security.findByName(obj.target.value)
        .then(data => {
          if (data) {
            this.setState({
              existing: data
            });
          }
        }).catch(err => console.log(err));
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

    relations = [];
    if (this.state.potentials) {
      this.state.potentials.map((rel, i) => relations.push(<ExistingMember member={rel} click={this.inviteExisting.bind(this, rel)} key={rel.id} email={rel.email} />));
    }
    if (this.parms)
      return (
        <div>
          <div className="existingRelation">
            <div className="well">
              Suggestions
            </div>
            {relations}
          </div>
          <div>
            <h4>Can't find your family member, try inviting them!!</h4>
          </div>
          <div className="inviteForm container">
            <form onChange={(event) => this.onFieldChange(event)}>
              <div style={{
                textAlign: 'left',
                margin: '10px'
              }}>
                <div className="form-group">

                  <label>Relation:
                          <select className="form-control" name="memberrelation" onChange={this.findRelation.bind(this)}>
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
                            <input className="form-control" type="text" name="memberName" id="memberName" readOnly={this.state.lockFields} onBlur={this.findByName.bind(this)} />
                    </label>
                  </div>
                  <div className="form-group">
                    <label htmlFor="memberEmail">Email:
                          <input className="form-control" type="email" name="memberEmail" readOnly={this.state.lockFields} />
                    </label>
                    <div className="row">
                      <input className="d-none" type="text" className="form-control" ref={ref => this.captchaEnter = ref} />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={this.navigateToBoard.bind(this)}>Send Invite</button>
                  <button className="btn btn-default" onClick={this.navigateAway.bind(this)}>Cancel</button>
                </div>
              </div>
            </form>
            <div className="card">
              <Captcha
                sitekey='6Lf-Pk4UAAAAAHaw0HlDd_n9kpVSt3E7MZzp0Fd3'
                lang='en'
                theme='light'
                type='image'
                callback={(value) => this.confirm(this)} />
            </div>
          </div>
          {showLoading}
        </div>
      );
  }

  confirm(value) {
    this.captchaEnter.value = Math.random();
  }

  handleClick(e) {
    e.preventDefault();
    this.check();
  }

  result(text) {
    this.setState({
      captcha: text
    });
  }

  check() {
    console.log(this.state.captcha, this.captchaEnter.value, this.state.captcha === this.captchaEnter.value)
  }

}

export default Invite;
