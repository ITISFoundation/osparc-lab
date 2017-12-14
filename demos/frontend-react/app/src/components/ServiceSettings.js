import React, { Component } from 'react';
import Rnd from 'react-rnd';

import { socket } from '../socket2Server';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { computeOutputData } from '../actions/index';

class ServiceSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 'visible',
      width: 400,
      height: 400,
      x: 20,
      y: 20
    };
  }

  handleChange(name, new_value) {
    for (let i = 0; i < this.props.workbench.selected[0].service.settings.length; i++) {
      if (this.props.workbench.selected[0].service.settings[i].name === name) {
        this.props.workbench.selected[0].service.settings[i].value = new_value.target.value;
        this.forceUpdate();
        break;
      }
    }
  }

  createTitle() {
    let title = [];
    if (this.props.workbench.selected.length > 0 && this.props.workbench.selected[0]) {
      title =
        <h5>
          {this.props.workbench.selected[0].uniqueName}
        </h5>
    }
    return title || null;
  }

  createSettingsFormUI() {
    let settings = [];
    if (this.props.workbench.selected.length > 0 && this.props.workbench.selected[0]) {
      for (let i = 0; i < this.props.workbench.selected[0].service.settings.length; i++) {
        let setting = this.props.workbench.selected[0].service.settings[i];
        if (setting.type === 'select') {
          let items = [];
          for (let j = 0; j < setting.options.length; j++) {
            items.push(<option key={j} value={j}>{setting.options[j]}</option>);
          }
          settings.push(
            <div key={i}>
              {setting.text}:
              <select name={setting.name} value={setting.value}
                onChange={this.handleChange.bind(this, setting.name)}>
                {items}
              </select>
            </div>
          );
        } else {
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
    }
    return settings || null;
  }

  createFormUI() {
    let form;
    let sets = this.createSettingsFormUI();
    if (sets.length > 0) {
      form =
        <form onSubmit={this.handleSubmit.bind(this)} style={{textAlign: 'left'}}>
          {sets}
          <br />
          <input type="submit" value="Submit" style={{color: 'black'}}/>
        </form>
    }
    return form || null;
  }

  handleSubmit(event) {
    event.preventDefault();
    const submitThis = this.props.workbench.selected[0].service;
    const uniqueName = this.props.workbench.selected[0].uniqueName;

    socket.emit('computeOutputData', submitThis, uniqueName);
  }

  render() {
    return (
      <div className="ServiceSettings">
        <Rnd
          style = {{
            color: this.props.color,
            backgroundColor: this.props.backgroundColor,
            borderStyle: 'solid',
            opacity: .85
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
          <h4 style={{textAlign: 'center'}}>Service Settings</h4>
          <hr style={{marginTop: '0px', marginBottom: '0px'}} />
          {this.createTitle()}
          {this.createFormUI()}
        </Rnd>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workbench: state.workbenchServiceReducer,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    computeOutputData: computeOutputData
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ServiceSettings);
