import React, { Component } from 'react';
import SwitchButton from 'react-switch-button';
import 'react-switch-button/dist/react-switch-button.css';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { styleChanged } from '../actions';

class StyleSwitch extends Component {

  onChange(e) {
    const checked = e.currentTarget.checked;
    this.props.styleChanged(checked);
  }

  render() {
    return (
      <div className="StyleSwitch"
        style = {{
          color: this.props.color,
          backgroundColor: this.props.backgroundColor
        }}
      >
        <SwitchButton name="day-night-switch" mode="select"
          labelRight="Night" label="Day"
          onChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
};

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    styleChanged: styleChanged
  }, dispatch);
}

export default connect(null, matchDispatchToProps)(StyleSwitch);
