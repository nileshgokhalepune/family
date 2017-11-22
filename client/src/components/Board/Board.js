import React, { Component } from 'react';
import { Member } from '../Member/Member';
import { Security } from '../../service/Security';
import './Board.css';

export class Board extends Component {
  state = {
    user: null
  };
  componentWillMount() {
    Security.validate().then(data => {
      if (data.valid) {
        Security.getData().then(data => {
          this.setState({
            user: data.member
          });
        })
      }
    }).catch(err => {
      alert('Invalid session');
      this.props.history.push('/login');
    })
  }

  constructor(props) {
    super(props);
    this.peer = 'peer';
    this.children = 'child';
    this.parents = 'parent';
  }

  renderMember(state) {
    return <Member value={state} {...this.props} />
  }

  render() {
    var peers = null;
    var subordinates = null;
    var parents = null;
    if (this.state && this.state.user) {
      let family = this.state.user.family;
      peers = family.map((f, i) => {
        return f.type === this.peer ? <Member value={f} key={i} callbackPosts={(id) => alert('called' + id) }/> : '';
      });
      subordinates = family.map((f, i) => {
        return f.type === this.children ? <Member value={f} key={i} callbackPosts={(id) => alert('called' + id) }/> : '';
      });
      parents = family.map((f, i) => {
        return f.type === this.parents ? <Member value={f} key={i} callbackPosts={(id) => alert('called' + id) }/> : '';
      });
      return (
        <div className="App">
        <div className="you">
            {this.renderMember(this.state.user)}
            {parents}
            {peers}
            {subordinates}
        </div>
      </div>
      )

    } else {
      return null
    }
  }
}

