import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './Member.css'; 

export class Member extends Component {
  showPosts(event) {
    if (this.props.callbackPosts)
      this.props.callbackPosts(this.props.value.id);
  }

  componentDidMount() {
    this.props.didLoad(document.getElementById(this.props.id));
  }

  showLikes(event) {}
  getImage() {
    return ( <img className="image" src={"/users/avatar/" + this.props.img} alt={this.props.value.name}/>);
  }
  navigateToInvite() {
    this.props.history.push('/invite');
  }

  render() {
    let display = '';
    let type = this.props.value.type;
    if (type === 'self') {
      display = 'You'
    } else {
      display = this.props.value.relation;
    }
    let showPeeks = type === 'self' ? null : (
      <div>
              <i title="Posts" className="fa fa-list" onClick={(event) => this.showPosts(event)}></i>
          </div>
      );
    var x = 10,
      y = 10;
    if (this.props.coords) {
      x = this.props.coords.x;
      y = this.props.coords.y;
    }
    let inviteLink = type === 'self' ?
      <div>
            <i className="fa fa-plus-circle" title="Add member" onClick={this.navigateToInvite.bind(this) }></i>
      </div>
      : null;
    return (
      <div  type="member" className="member" id={this.props.id} style={{
        top: x,
        left: y
      }}>
        <div>
          <div>
              {this.getImage()}
            <div className="name">{this.props.value.name}</div>
              {display}
            <div className="shortMenu">
              {showPeeks} 
              {inviteLink}
            </div>
          </div>
        </div>   
      </div>
    )
  }
}

const MemberWithRouter = withRouter(Member);
export default MemberWithRouter;