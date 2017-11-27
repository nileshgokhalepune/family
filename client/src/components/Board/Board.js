import React, { Component } from 'react';
import { Member } from '../Member/Member';
import { Security } from '../../service/Security';
import { Connector } from '../Connector/Connector';
import './Board.css';

export class Board extends Component {
  connectors;
  currentElement;
  compCount=0;
  memberLoaded(ele) {
    this.currentElement = ele;
  }

  componentDidMount() {
    // this.setState({
    //   connectors: this.connectors
    // })
  }
  peersLoaded(ele) {
    this.loadConnectors();
    this.connectors.push(<Connector relative={ele} key={ele.id}  member={this.currentElement}/>);
  }

  parentsLoaded(ele) {
    this.loadConnectors();
    this.connectors.push(<Connector relative={ele} key={ele.id}  member={this.currentElement} />);
  }

  childrenLoaded(ele) {
    this.loadConnectors();
    this.connectors.push(<Connector relative={ele} key={ele.id} member={this.currentElement}/>)
  }

  loadConnectors() {
    this.compCount--;
    if (this.compCount == 0) {
      this.setState({
        connectors: this.connectors
      })
    }
  }

  componentWillMount() {
    this.connectors = [];
    Security.validate().then(data => {
      if (data.valid) {
        Security.getData().then(data => {
          this.setState({
            user: data.member,
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
    return <Member value={state} {...this.props} id="you" img={Security.get()} didLoad={this.memberLoaded.bind(this)} />
  }

  render() {
    var peers = [];
    var subordinates = [];
    var parents = [];

    if (this.state && this.state.user) {
      let family = this.state.user.family;
      family.forEach((f, i) => {
        if (f.type === this.peer) {
          peers.push(<Member value={f} key={i} id={"peer" + i} img={Security.get()} callbackPosts={(id) => alert('called' + i) } didLoad={this.peersLoaded.bind(this)}/>);
        }
        if (f.type === this.children) {
          subordinates.push(<Member value={f} key={i} id={"child" + i} img={Security.get()}  callbackPosts={(id) => alert('called' + i) } didLoad={this.childrenLoaded.bind(this)}/>);
        }
        if (f.type === this.parents) {
          parents.push(<Member value={f} key={i} id={"parent" + i} img={Security.get()}  callbackPosts={(id) => alert('called' + i) } didLoad={this.parentsLoaded.bind(this)}/>);
        }
      });
      // peers = family.map((f, i) => {
      //   var peer = f.type === this.peer ? <Member value={f} key={i} id={"peer" + i} img={Security.get()} callbackPosts={(id) => alert('called' + i) } didLoad={this.peersLoaded.bind(this)}/> : '';
      //   //this.connectors.push(<Connector relative={"peer" + i} member={"you"} key={"peer" + i}/>)
      //   return peer;
      // });
      // subordinates = family.map((f, i) => {
      //   //this.connectors.push(<Connector relative={"child" + i} member={"you"}  key={"child" + i}/>)        
      //   return f.type === this.children ? <Member value={f} key={i} id={"child" + i} img={Security.get()}  callbackPosts={(id) => alert('called' + i) } didLoad={this.childrenLoaded.bind(this)}/> : '';
      // });
      // parents = family.map((f, i) => {
      //   //this.connectors.push(<Connector relative={"parent" + i} member={"you"}  key={"parent" + i}/>)        
      //   return f.type === this.parents ? <Member value={f} key={i} id={"parent" + i} img={Security.get()}  callbackPosts={(id) => alert('called' + i) } didLoad={this.parentsLoaded.bind(this)}/> : '';
      // });
      this.compCount = peers.length + subordinates.length + parents.length;
      return (
        <div className="App">
        <div className="you">
            {this.renderMember(this.state.user)}
            {parents}
            {peers}
            {subordinates}
            {this.state.connectors}
        </div>
      </div>
      )

    } else {
      return null
    }
  }
}

