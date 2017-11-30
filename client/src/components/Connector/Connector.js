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
    var svgTop = this.refs[this.props.member.id + this.props.relative.id].offsetTop; //.getBoundingClientRect().top;
    var svgLeft = this.refs[this.props.member.id + this.props.relative.id].offsetLeft; //.getBoundingClientRect().left;
    var startCoord = this.getSourceCoordinates(startEle, endEle);
    // {
    //   top: startEle.offsetTop == endEle.offsetTop ? startEle.offsetTop + 50 : startEle.offsetTop,
    //   left: startEle.offsetLeft > endEle.offsetLeft ? endEle.offsetLeft + 100 : startEle.offsetLeft + 100
    // }
    var endCoord = this.getTargetCoordinates(startEle, endEle);
    // {
    //   top: startEle.offsetTop == endEle.offsetTop ? endEle.offsetTop + 50 : endEle.offsetTop,
    //   left: startEle.offsetLeft > endEle.offsetLeft ? endEle.offsetLeft : startEle.offsetLeft
    // }
    var startX = startCoord.left; //+ 0.5 * startEle.scrollWidth + svgLeft;
    var startY = startCoord.top;// < endCoord.top ? startCoord.top + 0.5 * startEle.scrollHeight : startCoord.top - svgTop;

    var endX = endCoord.left;// + 0.5 * endEle.scrollWidth - svgLeft;
    var endY = endCoord.top;// - svgTop;
    this.drawPath(startX, startY, endX, endY);
  }

  getSourceCoordinates(sourceElement, targetElement) {
    var startPos = {};
    //This means the source element is below target so we definitely want to start the line from bottom of target element.
    startPos.left = sourceElement.offsetTop > targetElement.offsetTop ? targetElement.offsetLeft + targetElement.offsetWidth / 2 : sourceElement.offsetLeft + sourceElement.offsetWidth / 2; //Start from offsetleft of target and move to middle of the element.
    startPos.top = sourceElement.offsetTop > targetElement.offsetTop ? targetElement.offsetTop + targetElement.offsetHeight : sourceElement.offsetTop + sourceElement.offsetHeight;

    if (sourceElement.offsetTop === targetElement.offsetTop) { //This means both the elememts are at same level. we need to figure out which one is the left and which is right.
      //This means source element is to the right of the target so we take target elements right middle position.
      startPos.top = sourceElement.offsetTop + sourceElement.offsetHeight / 2;

    }
    if (sourceElement.offsetLeft === targetElement.offsetLeft) {
      startPos.left = sourceElement.offsetLeft + sourceElement.offsetWidth / 2;
    }
    return startPos;
  }

  getTargetCoordinates(sourceElement, targetElement) {
    var endPos = {};
    endPos.left = targetElement.offsetLeft > sourceElement.offsetLeft ? targetElement.offsetLeft + targetElement.offsetWidth / 2 : sourceElement.offsetLeft + sourceElement.offsetWidth / 2;
    endPos.top = targetElement.offsetTop > sourceElement.offsetTop ? targetElement.offsetTop : sourceElement.offsetTop;
    if (targetElement.offsetTop === sourceElement.offsetTop) {
      endPos.top = targetElement.offsetTop + targetElement.offsetWidth / 2;
    }
    
    if (sourceElement.offsetLeft === targetElement.offsetLeft) {
      endPos.left = targetElement.offsetLeft + targetElement.offsetWidth / 2;
    }
    return endPos;
  }

  signum(x) {
    return (x < 0) ? -1 : 1;
  }

  absolute(x) {
    return (x < 0) ? -x : x;
  }

  drawPath(startX, startY, endX, endY) {
    var svg = this.refs["svg" + this.props.member.id + this.props.relative.id];
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
    this.path = "M " + startX + " " + startY +
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
    var actualPath = "";
    if (this.state && this.state.path) {
      actualPath = this.state.path;
    }
    return (
      <div  ref={this.props.member.id + this.props.relative.id}  style={{
        position: 'absolute',
        top: 0,
        left: 0
      }}>
        <svg  ref={"svg" + this.props.member.id + this.props.relative.id} xmlns="http://www.w3.org/2000/svg"> 
            <path d={actualPath} stroke="green" fill="none" stokewidth="1"/> 
        </svg>
      </div>
    )
  }
}