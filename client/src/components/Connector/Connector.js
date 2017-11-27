import React, { Component } from 'react';

export class Connector extends Component {
  path;
  componentDidMount() {
    var startEle = this.props.member;
    var endEle = this.props.relative;
    if (startEle.offsetTop > endEle.offsetTop) {
      var temp = startEle;
      startEle = endEle;
      endEle = temp;
    }
    var svgTop = this.refs[this.props.member.id + this.props.relative.id].getBoundingClientRect().top;
    var svgLeft = this.refs[this.props.member.id + this.props.relative.id].getBoundingClientRect().left;
    var startCoord = {
      top: startEle.offsetTop,
      left: startEle.offsetLeft
    }
    var endCoord = {
      top: endEle.offsetTop,
      left: endEle.offsetLeft
    }
    var startX = startCoord.left + 0.5 * startEle.scrollWidth + svgLeft;
    var startY = startCoord.top - svgTop;

    var endX = endCoord.left + 0.5 * endEle.scrollWidth - svgLeft;
    var endY = endCoord.top - svgTop;
    this.drawPath(startX, startY, endX, endY);
  }

  drawPath(startX, startY, endX, endY) {
    var svg = this.refs[this.props.member.id + this.props.relative.id];
    var stroke = 10;
    if (svg.height.baseVal.value < endY) {
      svg.setAttribute("height", endY);
    }
    if (svg.width.baseVal.value < (startX + stroke)) svg.setAttribute("width", (startX + stroke));
    if (svg.width.baseVal.value < (endX + stroke)) svg.setAttribute("width", (endX + stroke));

    var deltaX = (endX - startX) * 0.15;
    var deltaY = (endY - startY) * 0.15;

    var delta = deltaY < this.absolute(deltaX) ? deltaY : this.absolute(deltaX);
    var arc1 = 0;
    var arc2 = 1;
    if (startX > endX) {
      arc1 = 1;
      arc2 = 0;
    }
    this.path = "d", "M" + startX + " " + startY +
    " V " + (startY + delta) +
    " A " + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + delta * this.signum(deltaX)) + " " + (startY + 2 * delta) +
    " H " + (endX - delta * this.signum(deltaX)) +
    " A " + delta + " " + delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3 * delta) +
    " V " + endY;

    this.setState({
      path: this.path
    })
  }

  render() {
    if (!this.props.member || !this.props.relative) {
      return null;
    }
    var actualPAth = "";
    if (this.state && this.state.path) {
      actualPAth = this.state.path;
    }
    return (
      <svg ref={this.props.member.id + this.props.relative.id}>
          <path d={actualPAth}/>
      </svg>
    )
  }
}