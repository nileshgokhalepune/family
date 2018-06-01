import React, { Component } from 'react';
import { Member } from '../Member/Member';
import { Security } from '../../service/Security';
import { Connector } from '../Connector/Connector';
import { ThreeContainer } from '../three/ThreeContainer';
import './Board.css';

export class Board extends Component {
  connectors;
  currentElement;
  compCount = 0;
  positions;

  memberLoaded(ele) {
    this.currentElement = ele;
  }

  componentDidMount() {
    this.positions = this.generatePositionArray(600, 600, 200, 10);
    // this.setState({
    //   connectors: this.connectors
    // })
  }
  peersLoaded(ele) {
    this.loadConnectors();
    this.connectors.push(<Connector relative={ele} key={ele.id} member={this.currentElement} />);
  }

  parentsLoaded(ele) {
    this.loadConnectors();
    this.connectors.push(<Connector relative={ele} key={ele.id} member={this.currentElement} />);
  }

  childrenLoaded(ele) {
    this.loadConnectors();
    this.connectors.push(<Connector relative={ele} key={ele.id} member={this.currentElement} />)
  }

  loadConnectors() {
    this.compCount--;
    if (this.compCount === 0) {
      this.setState({
        connectors: this.connectors
      })
    }
  }

  componentWillMount() {
    if (this.props.userId) {

    } else {
      this.connectors = [];
      Security.validate().then(data => {
        if (data.valid) {
          Security.getData().then(data => {
            this.setState({
              user: data.member,
            });
            Security.setCurrent(data.member);
          })
        }
      }).catch(err => {
        alert('Invalid session');
        this.props.history.push('/login');
      });
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  generatePositionArray(maxX, maxY, safeRadius, irregularity) {
    var positionsArray = [];
    var r,
      c;
    var rows;
    var columns;
    rows = Math.floor(maxY / safeRadius);
    columns = Math.floor(maxX / safeRadius);
    for (r = 1; r <= rows; r += 1) {
      for (c = 1; c <= columns; c += 1) {
        positionsArray.push({
          x: Math.round(maxX * c / columns) + this.getRandomInt(irregularity * -1, irregularity),
          y: Math.round(maxY * r / rows) + this.getRandomInt(irregularity * -1, irregularity)
        })
      }
    }
    return positionsArray;
  }

  getRandomPositions(array, removeTaken) {
    var randomIndex;
    var coordinates;
    randomIndex = this.getRandomInt(0, array.length - 1);
    coordinates = array[randomIndex];
    if (removeTaken) {
      array.splice(randomIndex, 1);
    }
    return coordinates;
  }

  constructor(props) {
    super(props);
    this.peer = 'peer';
    this.children = 'child';
    this.parents = 'parent';
  }

  renderMember(state) {
    return <Member value={state} {...this.props} id="you" img={Security.get()} key={"you"} didLoad={this.memberLoaded.bind(this)} />
  }

  render() {
    var peers = [];
    var subordinates = [];
    var parents = [];
    var coords;
    if (this.state && this.state.user) {
      let family = this.state.user.family;
      family.forEach((f, i) => {
        if (f.type === this.peer) {
          coords = this.getRandomPositions(this.positions, true);
          peers.push(<Member value={f} key={i} id={"peer" + i} img={Security.get()} callbackPosts={(id) => alert('called' + i)} didLoad={this.peersLoaded.bind(this)} />);
        }
        if (f.type === this.children) {
          coords = this.getRandomPositions(this.positions, true);
          subordinates.push(<Member value={f} key={i} id={"child" + i} img={Security.get()} callbackPosts={(id) => alert('called' + i)} didLoad={this.childrenLoaded.bind(this)} />);
        }
        if (f.type === this.parents) {
          coords = this.getRandomPositions(this.positions, true);
          parents.push(<Member value={f} key={i} id={"parent" + i} img={Security.get()} callbackPosts={(id) => alert('called' + i)} didLoad={this.parentsLoaded.bind(this)} />);
        }
      });
      this.compCount = peers.length + subordinates.length + parents.length;
      return (
        <div className="App">
          <ThreeContainer user={this.state.user} />
          <div className="you">
            {this.renderMember(this.state.user)}
            <div className="parents">
              {parents}
            </div>
            <div className="peers">
              {peers}
            </div>
            <div className="children">
              {subordinates}
            </div>
          </div>
          {this.state.connectors}
        </div>
      )

    } else {
      return null
    }
  }
}

