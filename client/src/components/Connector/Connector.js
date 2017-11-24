import React, { Component } from 'react';

export class Connector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var startEle = document.getElementById(this.props.member);
    var endEle = document.getElementById(this.props.relative);

    return (
      <svg>
          <path />
      </svg>
    )
  }
}