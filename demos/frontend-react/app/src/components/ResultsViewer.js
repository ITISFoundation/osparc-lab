import React, { Component } from 'react';
import Rnd from 'react-rnd';

import { socket } from '../socket2Server';

import { connect } from 'react-redux';

class ResultsViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 'visible',
      width: 600,
      height: 640,
      x: 1000,
      y: 20
    };
  }

  convertOutputToImage(filePath) {
    return (<img src={filePath} style={{height: '100%', width: '100%', objectFit: 'contain'}}/>)
  }

  convertOutputToTable(filePath) {
    socket.emit('readCsvContent', filePath);
    socket.on('readCsvContentRes', (items) => {
      console.log('readCsvContentRes', items);
      var col = [];
      for (let i = 0; i < items.length; i++) {
        for (var key in items[i]) {
          if (col.indexOf(key) === -1) {
            col.push(key);
          }
        }
      }
      var table = document.createElement("table");
      var tr = table.insertRow(-1);
      for (let i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.setAttribute("style", "text-align:center;");
        th.innerHTML = col[i];
        tr.appendChild(th);
      }
      for (let i = 0; i < items.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = items[i][col[j]];
        }
      }
      document.getElementById("display").innerHTML = "";
      document.getElementById("display").appendChild(table);
    });
  }

  convertOutputToPureHtml(filePath) {
    socket.emit('readUrlContent', filePath);
    socket.on('readUrlContentRes', (val) => {
      document.getElementById("display").innerHTML = val;
    });
  }

  convertOutputToHtml(filePath) {
    let htmlCode = "";

    if (!filePath)
      return htmlCode;

    let ext = filePath.split('.').pop();
    switch (ext) {
      case 'png':
        htmlCode = this.convertOutputToImage(filePath);
        break;
      case 'csv':
        htmlCode = this.convertOutputToTable(filePath);
        break;
      case 'html':
        htmlCode = this.convertOutputToPureHtml(filePath);
        break;
      default:
        htmlCode = "";
        break;
    }
    return htmlCode;
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
          <div id='display' style={{backgroundColor: this.props.backgroundColor, textAlign: 'center'}}>
            {this.convertOutputToHtml(this.props.showOutputDataReducer)}
          </div>
        </Rnd>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    showOutputDataReducer: state.showOutputDataReducer,
  };
}

export default connect(mapStateToProps, null)(ResultsViewer);
