import React, { Component } from 'react';
import Rnd from 'react-rnd';
import {Treebeard, decorators} from 'react-treebeard';
import { socket } from '../socket2Server';

class ResultsFolder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 'visible',
      width: 320,
      height: 400,
      x: 360,
      y: 20,
      resultFolderStructure: null
    };

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({
      cursor: node
    });

    if (node.active === true && node.type === 'file')
      console.log(node.path);
  }

  getMyStyle() {
    // copied from react-treebeard/src/themes/default
    return {
      tree: {
        base: {
          listStyle: 'none',
          // backgroundColor: '#21252B',
          backgroundColor: this.props.backgroundColor,
          margin: 0,
          padding: 0,
          color: '#9DA5AB',
          fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
          fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                // background: '#31363F'
                background: this.props.activeColor,
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#9DA5AB'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
      }
    }
  }

  componentDidMount() {
    socket.emit('rabbit');

    socket.on('rabbitFolderStructure', (val) => {
      if (val.type === 'rabbitFolderStructure') {
        this.setState({
          resultFolderStructure: val.value
        });
      }
    });
  }

  render() {
    if (!this.state.resultFolderStructure) {
      return(
        <div className="ResultsFolder" />
      );
    }

    return (
      <div className="ResultsFolder">
        <Rnd
          style = {{
            color: this.props.color,
            backgroundColor: this.props.backgroundColor,
            borderStyle: 'solid',
            textAlign: 'left',
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
          <h4 style={{textAlign: 'center'}}>Results Folder</h4>
          <hr style={{marginTop: '0px', marginBottom: '0px'}} />
          <div style={{backgroundColor: this.props.backgroundColor}}>
            <Treebeard
              data={this.state.resultFolderStructure}
              onToggle={this.onToggle}
              decorators={decorators}
              style={this.getMyStyle()}
            />
          </div>
        </Rnd>
      </div>
    )
  }
}

export default ResultsFolder;
