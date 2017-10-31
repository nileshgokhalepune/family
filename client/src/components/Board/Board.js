import React, { Component } from 'react';
import { Member } from '../Member/Member';

export class Board extends Component {
  state = {
    users: []
  };
  componentWillMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({
        users
      }));
  }

  constructor(props) {
    super(props);
    this.peer = 'peer';
    this.children = 'child';
    this.parents = 'parent';
  }

  renderMember(state) {
    return <Member value={state} />
  }

  render() {
    var peers = null;
    var subordinates = null;
    var parents = null;
    if (this.state) {
      let family = this.state.family;
      peers = family.map((f, i) => {
        return f.type === this.peer ? <Member value={f} key={i} callbackPosts={(id) => alert('called' + id) }/> : '';
      });
      subordinates = family.map((f, i) => {
        return f.type === this.children ? <Member value={f} key={i} callbackPosts={(id) => alert('called' + id) }/> : '';
      });
      parents = family.map((f, i) => {
        return f.type === this.parents ? <Member value={f} key={i} callbackPosts={(id) => alert('called' + id) }/> : '';
      });
    }
    return (
      <div className="family-container">
        <div className="you">
            {this.renderMember(this.state)}
        </div>
        <div className="family">
            <div className="parents">
                <div className="family-header">
                    Your Elders
                </div>
                {parents}
            </div>
            <div className="peers">
                <div className="family-header">
                    Your Peers
                </div>
                {peers}
            </div> 
            <div className="children">
                <div className="family-header">
                    Your dependants
                </div>
                {subordinates}
            </div>
        </div>
        <div className="posts">
            Here we show all the posts
        </div>
      </div>
    )
  }
}

