import React, { Component } from 'react';
import './HelloWorld.css';

class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.state = { greeting: 'Hallo' };
    this.baskify = this.baskify.bind(this);
  }
  render() {
    return (
      <div className="HelloWorld">
        {this.state.greeting} {this.props.name}!
        <br/>
        <button onClick={this.baskify}>Auf Baskisch!</button>
      </div>
    );
  }
  baskify() {
    this.setState({ greeting: 'Kaixo' });
  }
};

export default HelloWorld;
