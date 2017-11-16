import React, { Component } from 'react';
import Rnd from 'react-rnd';

import AvailableServices from './AvailableServices';
import IListenToSocket from './IListenToSocket';

class ResultsViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 'visible',
      width: 600,
      height: 600,
      x: 1200,
      y: 20
    };
  }

  render() {
    return (
      <div className="ResultsViewer">
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
          <h4 style={{textAlign: 'center'}}>Results Viewer</h4>
          <hr style={{marginTop: '0px', marginBottom: '0px'}} />
          <div style={{backgroundColor: this.props.backgroundColor}}>
          </div>
        </Rnd>
      </div>
    )
  }
}

export default ResultsViewer;
