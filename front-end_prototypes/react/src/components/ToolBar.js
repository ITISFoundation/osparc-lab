import React, { Component } from 'react';
import { Button, ToggleButton, ButtonToolbar, ButtonGroup, ToggleButtonGroup } from 'react-bootstrap';

import './ToolBar.css';

class ToolBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leftArray: ['O', 'P', 'Z', 'F', 'C'],
      centerArray: ['S', 'M', 'E'],
      rightArray: ['M', 'P', 'S', 'F'],
      panelVisible: true
    };

    // This binding is necessary to make `this` work in the callback
    this.togglePanelVisibility = this.togglePanelVisibility.bind(this);
  }


  togglePanelVisibility() {
    this.setState(prevState => ({ panelVisible: !prevState.panelVisible }))
    console.log('panelVisible', this.state.panelVisible);
  }

  createButtonsLeft() {
      var buttons = [];
      for (var i = 0; i < this.state.leftArray.length; i++) {
        buttons.push(
          <ToggleButton key={i} value={i} bsStyle="primary" bsSize="large" onChange={this.togglePanelVisibility}>
            {this.state.leftArray[i]}
          </ToggleButton>);
      }
      return <ToggleButtonGroup type="checkbox">{buttons}</ToggleButtonGroup>;
  }

  createButtonsCenter() {
      var buttons = [];
      for (var i = 0; i < this.state.centerArray.length; i++) {
        buttons.push(<Button key={i} bsStyle="primary" bsSize="large">{this.state.centerArray[i]}</Button>);
      }
      return <ButtonGroup>{buttons}</ButtonGroup>;
  }

  createButtonsRight() {
      var buttons = [];
      for (var i = 0; i < this.state.rightArray.length; i++) {
        buttons.push(<Button key={i} bsStyle="primary" bsSize="large">{this.state.rightArray[i]}</Button>);
      }
      return <ButtonGroup>{buttons}</ButtonGroup>;
  }

  render() {
    return (
      <div className="ToolBar">
        <ButtonToolbar>
          {this.createButtonsLeft()}
          {this.createButtonsCenter()}
          {this.createButtonsRight()}
        </ButtonToolbar>
      </div>
    );
  }
};

export default ToolBar;
