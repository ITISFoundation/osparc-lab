import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { styleChanged } from '../actions';

class StyleSwitch extends Component {

  onChange(e) {
    const checked = e.target.value;
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
        <div onChange={this.onChange.bind(this)}>
          Day
          <input type="radio" value="0" name="day-night"/>
          <input type="radio" value="1" name="day-night"/>
          Night
        </div>
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
