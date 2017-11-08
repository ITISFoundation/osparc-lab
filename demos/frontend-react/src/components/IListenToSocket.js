// https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34

import React, { Component } from 'react';
import uuid from  'uuid'
import { Button } from 'react-bootstrap';

import { socket } from '../socket2Server';

import './IListenToSocket.css';


class IListenToSocket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      variant: 'danger',
      socketMessage: '',
      myId: uuid.v4()
    };
  }

  componentDidMount() {
    socket.emit('amIConnected', this.state.myId);

    socket.on('userConnected', (hisId) => {
      if (this.state.myId === hisId) {
        this.setState({
          isConnected: true,
          variant: 'success'
        })
      }
    });

    socket.on('customEmit', (msg) => {
      if (msg.type === 'customEmit') {
        console.log('This method was fired by the socket server:' + msg.text)
        this.setState({
          socketMessage: msg.text
        })
      }
    });
  }

  randomRadiusServer() {
    console.log('randomRadius sento to the server')
    socket.emit('randomRadius', 'randomRadius')
  }

  pingServer() {
    console.log('pingServer sento to the server')
    socket.emit('pingServer', 'PING!')
  }

  render() {
    return (
      <div className="IListenToSocket"
        style = {{
          color: this.props.color,
          backgroundColor: this.props.backgroundColor
        }}
      >
        <Button onClick={this.randomRadiusServer.bind(this)} bsStyle={this.state.variant}>
          Random radius
        </Button>
        <Button onClick={this.pingServer} bsStyle={this.state.variant}>
          Ping Server
        </Button>
        {this.state.isConnected ? (
          <p>Server says: {this.state.socketMessage}</p>
        ) : (
          <p>Socket not connected!</p>
        )}
      </div>
    );
  }
}

export default IListenToSocket;
