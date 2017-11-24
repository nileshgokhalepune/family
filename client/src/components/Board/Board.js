import React, { Component } from 'react';
import { Member } from '../Member/Member';
import { Security } from '../../service/Security';
import { Connector } from '../Connector/Connector';
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
    return <Member value={state} {...this.props} id="you" img={Security.get()} />
  }

  render() {
    var peers = null;
    var subordinates = null;
    var parents = null;
    var connectors = [];
    if (this.state && this.state.user) {
      let family = this.state.user.family;
      peers = family.map((f, i) => {
        var peer = f.type === this.peer ? <Member value={f} key={i} id={"peer" + i} img={Security.get()} callbackPosts={(id) => alert('called' + i) }/> : '';
        connectors.push(<Connector relative={"peer" + i} member={"you"} key={"peer" + i}/>)
        return peer;
      });
      subordinates = family.map((f, i) => {
        connectors.push(<Connector relative={"child" + i} member={"you"}  key={"child" + i}/>)
        return f.type === this.children ? <Member value={f} key={i} id={"child" + i} img={Security.get()}  callbackPosts={(id) => alert('called' + i) }/> : '';
      });
      parents = family.map((f, i) => {
        connectors.push(<Connector relative={"parent" + i} member={"you"}  key={"parent" + i}/>)
        return f.type === this.parents ? <Member value={f} key={i} id={"parent" + i} img={Security.get()}  callbackPosts={(id) => alert('called' + i) }/> : '';
      });
      return (
        <div className="App">
        <div className="you">
            {this.renderMember(this.state.user)}
            {parents}
            {peers}
            {subordinates}
            {connectors}
        </div>
      </div>
      )

    } else {
      return null
    }
  }
}

