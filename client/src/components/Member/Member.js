import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './Member.css';

export class Member extends Component {
  showPosts(event) {
    if (this.props.callbackPosts)
      this.props.callbackPosts(this.props.value.id);
  }

  showLikes(event) {}
  getImage() {
    return ( <img className="image" src={"/users/avatar" + this.props.img} alt={this.props.value.name}/>);
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
      display = 'Your ' + this.props.value.relation;
    }
    let showPeeks = type === 'self' ? null : (
      <div className="peeks">
            <i title="Posts" className="fa fa-list" onClick={(event) => this.showPosts(event)}></i>
        </div>);

    let inviteLink = type === 'self' ?
      <div>
          <i className="fa fa-plus-circle" title="Add member" onClick={this.navigateToInvite.bind(this) }></i>
    </div> : null;
    return (
      <div  type="member" className="member" id={this.props.id}>
        <div>
            {this.getImage()}
            <div className="name">{this.props.value.name}</div>
            {display}
        </div>
          {showPeeks} 
          {inviteLink}
        </div>
    )
  }
}

const MemberWithRouter = withRouter(Member);
export default MemberWithRouter;