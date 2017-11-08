import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectedServiceChanged } from '../actions';

import './AvailableServices.css';

class AvailableServices extends Component {

  onServiceClicked(service_id) {
    for (var i = 0; i < this.props.availableServices.length; i++) {
      if (service_id === this.props.availableServices[i].uuid) {
        this.props.selectedServiceChanged(this.props.availableServices[i]);
        return;
      }
    }
  }

  createButtons() {
    var buttons = [];
    if (this.props.availableServices) {
      for (var i = 0; i < this.props.availableServices.length; i++) {
        buttons.push(
          <Button key={i} bsStyle="primary"
            onClick={this.onServiceClicked.bind(this, this.props.availableServices[i].uuid)}>
            {this.props.availableServices[i].text}
          </Button>
        );
      }
    }
    return <ButtonGroup>{buttons}</ButtonGroup>;
  }

  render() {
    return (
      <div className="AvailableServices"
        style = {{
          color: this.props.color,
          backgroundColor: this.props.backgroundColor
        }}>
        <h4>Available Services:
        {this.createButtons()}
        </h4>
      </div>
    );
  }
};

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    selectedServiceChanged: selectedServiceChanged
  }, dispatch);
}

export default connect(null, matchDispatchToProps)(AvailableServices);
