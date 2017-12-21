import React, { Component } from 'react';

import StyleSwitch from './components/StyleSwitch';
import ThreeDView from './components/3DView';
import WorkbenchView from './components/WorkbenchView';
import AvailableServices from './components/AvailableServices';
import ServiceSettings from './components/ServiceSettings';
import ResultsFolder from './components/ResultsFolder';
import ResultsViewer from './components/ResultsViewer';
import ToolBar from './components/ToolBar';
import { socket } from './socket2Server';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { radiusChanged } from './actions';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nightSelected: 0,
      baseColor: 235,
      styleItalia: 'rgb(255,0,0)',
      availableServices: []
    }
  }

  componentDidMount() {

    socket.emit('requestAvailableServices')
    socket.on('availableServices', (val) => {
      if (val.type === 'availableServices') {
        this.setState({ availableServices: val.value })
      }
    });

    socket.on('userConnected', (val) => {
      if (val.type === 'result') {
        var result = Number(val.value[0]);
        console.log('userConnected', result);
      }
    });

    socket.on('radiusChangedByServer', (val) => {
      if (val.type === 'randomizer') {
        this.props.radiusChanged(Number(val.value))
      }
    });

    socket.on('whatInItalia', (val) => {
      if (val.type === 'result' && val.value) {
        var result = Number(val.value[0]);
        if (result === 1) {
          this.setState({
            styleItalia: 'rgb(249,200,203)'
          })
        } else {
          this.setState({
            styleItalia: 'rgb(255,0,0)'
          })
        }
      }
    });
  }

  getStyle1() {
    let baseColor = this.props.baseColor + 0
    baseColor = baseColor + 0
    let textColor = 255 - baseColor
    return {
      backgroundColor: 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
      color: 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
    }
  }

  getStyle2() {
    let baseColor = this.props.baseColor + 10
    baseColor = baseColor + 0
    let textColor = 255 - baseColor
    return {
      backgroundColor: 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
      color: 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
    }
  }

  getStyle3() {
    let baseColor = this.props.baseColor + 20
    baseColor = baseColor + 0
    let textColor = 255 - baseColor
    return {
      backgroundColor: 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
      color: 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
    }
  }

  render() {
    return (
      <div className="App">
        <div style={behind}>
          <ThreeDView
            backgroundColor={this.getStyle3().backgroundColor}
            color={this.getStyle3().color}
            sphereColor={this.state.styleItalia}
          />
        </div>
        <div style={onTop}>
          <div style={{width: '100%', overflow: 'hidden'}}>
            <div style={{width: '90%', float: 'left'}}>
              <AvailableServices
                availableServices={this.state.availableServices}
                backgroundColor={this.getStyle1().backgroundColor}
                color={this.getStyle1().color}
              />
            </div>
            <div style={{marginLeft: '10px', marginTop: '10px'}}>
              <StyleSwitch
                backgroundColor={this.getStyle1().backgroundColor}
                color={this.getStyle1().color}
              />
            </div>
          </div>
          <ServiceSettings
            backgroundColor={this.getStyle2().backgroundColor}
            color={this.getStyle2().color}
          />
          <ResultsFolder
            backgroundColor={this.getStyle2().backgroundColor}
            activeColor={this.getStyle1().backgroundColor}
            color={this.getStyle2().color}
          />
          <ResultsViewer
            backgroundColor={this.getStyle2().backgroundColor}
            color={this.getStyle2().color}
          />
          <WorkbenchView />
          <ToolBar />
        </div>
      </div>
    );
  }
}

const behind = {
  zIndex: '-1',
  position: 'absolute',
  top: '0px',
  left: '0px',
  textAlign: 'center'
};

const onTop = {
  zIndex: '0',
  position: 'absolute',
  top: '0px',
  left: '0px',
  textAlign: 'center'
};

function mapStateToProps(state){
  return {
    baseColor: state.styleChangedReducer.baseColor
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    radiusChanged: radiusChanged
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
