import React, { Component } from 'react';
import Rnd from 'react-rnd';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { computeServiceOutput } from '../actions/index';

class ServiceSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 'visible',
      width: 320,
      height: 400,
      x: 20,
      y: 20
    };
  }

  handleChange(name, new_value) {
    for (let i = 0; i < this.props.selectedServiceSettings[0].settings.length; i++) {
      if (this.props.selectedServiceSettings[0].settings[i].name === name) {
        this.props.selectedServiceSettings[0].settings[i].value = new_value.target.value;
        this.forceUpdate();
        break;
      }
    }
  }

  createSettingsFormUI() {
    let settings = [];
    if (this.props.selectedServiceSettings.length>0) {
      for (let i = 0; i < this.props.selectedServiceSettings[0].settings.length; i++) {
        let setting = this.props.selectedServiceSettings[0].settings[i];
        settings.push(
          <div key={i}>
            {setting.text}:
            <input type={setting.type} name={setting.name} value={setting.value}
              onChange={this.handleChange.bind(this, setting.name)}
            />
          </div>
        );
      }
    }
    return settings || null;
  }

  createFormUI() {
    let form;
    let sets = this.createSettingsFormUI();
    if (sets.length>0) {
      form =
        <form onSubmit={this.handleSubmit.bind(this)}>
          {sets}
          <input type="submit" value="Submit" />
        </form>
    }
    return form || null;
  }

  handleSubmit(event) {
    event.preventDefault();
    const submitThis = this.props.selectedServiceSettings[0];
    console.log(submitThis);
    this.props.computeServiceOutput(submitThis);
  }

  render() {
    return (
      <div className="ServiceSettings">
        <Rnd
          style = {{
            color: this.props.color,
            backgroundColor: this.props.backgroundColor
          }}
          visibility = {this.state.visible}
          size = {{ width: this.state.width,  height: this.state.height }}
          position = {{ x: this.state.x, y: this.state.y }}
          onDragStop = {(e, d) => { this.setState({ x: d.x, y: d.y }) }}
          onResize = {(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              ...position,
            });
          }}
        >
          <h4>Service Settings</h4>
          {this.createFormUI()}
        </Rnd>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    selectedServiceSettings: state.selectedServiceReducer,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    computeServiceOutput: computeServiceOutput
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ServiceSettings);
