import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { newServiceRequested } from '../actions';

import './AvailableServices.css';

class AvailableServices extends Component {

  onServiceClicked(service_id) {
    for (var i = 0; i < this.props.availableServices.length; i++) {
      if (service_id === this.props.availableServices[i].id) {
        this.props.newServiceRequested(this.props.availableServices[i]);
        return;
      }
    }
  }

  checkInputConnections(checkThisService) {
    if (this.props.workbench.selected.length > 0 && this.props.workbench.selected[0]) {
      return (this.props.workbench.selected[0].service.output === checkThisService.input);
    } else {
      return (checkThisService.input === 'none');
    }
  }

  createButtons() {
    let filteredServices = [];
    if (this.props.availableServices) {
      for (let i = 0; i < this.props.availableServices.length; i++) {
        if (this.checkInputConnections(this.props.availableServices[i])) {
            filteredServices.push(this.props.availableServices[i]);
        }
      }
    }

    let buttons = [];
    if (filteredServices) {
      for (let i = 0; i < filteredServices.length; i++) {
        if (this.checkInputConnections(filteredServices[i]))
        {
          buttons.push(
            <Button key={i} bsStyle="primary"
              onClick={this.onServiceClicked.bind(this, filteredServices[i].id)}>
              {filteredServices[i].text}
            </Button>
          );
        }
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

function mapStateToProps(state) {
  return {
    workbench: state.workbenchServiceReducer,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    newServiceRequested: newServiceRequested
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AvailableServices);
