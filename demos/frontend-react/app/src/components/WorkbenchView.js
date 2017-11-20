import React, { Component } from 'react';
import * as SRD from 'storm-react-diagrams';

import { socket } from '../socket2Server';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectedServiceChanged } from '../actions';

import './WorkbenchView.scss';

class WorkbenchView extends Component {

  constructor(props) {
    super(props)

    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.registerNodeFactory(new SRD.DefaultNodeFactory());
    this.diagramEngine.registerLinkFactory(new SRD.DefaultLinkFactory());
  }

  componentDidMount() {
    socket.on('outputDataStructure', (res) => {
      if (res.type === 'outputDataStructure') {
        for (var i = 0; i < this.props.workbench.nodes.length; i++) {
          if (this.props.workbench.nodes[i].uniqueName === res.jobId) {
            this.props.workbench.nodes[i].service.outputDir = res.value;
            this.rebuildWorkbench();
            break;
          }
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let diffNodes = prevProps.workbench.nodes.length !== this.props.workbench.nodes.length;
    let diffConns = prevProps.workbench.connections.length !== this.props.workbench.connections.length;
    if (diffNodes || diffConns) {
      this.rebuildWorkbench();
    }
  }

  selectionChanged(node) {
    if (node.selected) {
      this.props.selectedServiceChanged(node.extras);
    } else {
      this.props.selectedServiceChanged();
    }
  }

  rebuildWorkbench() {
  	this.activeModel = new SRD.DiagramModel();

    let nodes = [];
    for (let i = 0; i < this.props.workbench.nodes.length; i++) {
      let node = this.addNode(this.props.workbench.nodes[i]);
      node.x = 25 + i*125;
      node.y = 25;
      node.extras.uniqueName = this.props.workbench.nodes[i].uniqueName;
      node.extras.service = this.props.workbench.nodes[i].service;
      node.addListener({
        selectionChanged: (node, isSelected) => {
          this.selectionChanged(node);
        }
      });
      nodes.push(node);
    }
    // auto select last node
    nodes.slice(-1)[0].selected = true;

    let links = [];
    for (let i = 0; i < this.props.workbench.connections.length; i++) {
      let link = this.addConnection(this.props.workbench.connections[i], nodes);
      links.push(link);
    }

    for (let i = 0; i < nodes.length; i++) {
      this.activeModel.addNode(nodes[i]);
    }

    for (let i = 0; i < links.length; i++) {
      this.activeModel.addLink(links[i]);
    }

    this.diagramEngine.setDiagramModel(this.activeModel);
    this.forceUpdate();
  }

  addNode(nodeObject) {
    let node = new SRD.DefaultNodeModel(nodeObject.uniqueName);
    if ('input' in nodeObject) {
      node.addPort(new SRD.DefaultPortModel(true, nodeObject.input.nameId, nodeObject.input.nameId));
    }
    if ('output' in nodeObject) {
      node.addPort(new SRD.DefaultPortModel(false, nodeObject.output.nameId, nodeObject.output.nameId));
    }
    return node;
  }

  addConnection(connectionObject, nodes) {
    let link = new SRD.LinkModel();

    // Connect input
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].extras.uniqueName === connectionObject.input.node) {
        for (let j = 0; j < nodes[i].getOutPorts().length; j++) {
          if (nodes[i].getOutPorts()[j].name === connectionObject.input.port) {
            link.setSourcePort(nodes[i].getOutPorts()[j]);
          }
        }
      }
    }

    // Connect output
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].name === connectionObject.output.node) {
        for (let j = 0; j < nodes[i].getInPorts().length; j++) {
          if (nodes[i].getInPorts()[j].name === connectionObject.output.port) {
            link.setTargetPort(nodes[i].getInPorts()[j]);
          }
        }
      }
    }

    return link;
  }

  render() {
    return (
      <div className="body">
        <div className="workbench-body">
				  <div className="content">
            <div className="diagram-layer">
              <SRD.DiagramWidget diagramEngine={this.diagramEngine} />
            </div>
          </div>
        </div>
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
    selectedServiceChanged: selectedServiceChanged
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(WorkbenchView);
