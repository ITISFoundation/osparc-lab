import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import TrackballControls from 'three-trackballcontrols';
import * as THREE from 'three';

import { connect } from 'react-redux';

class ThreeDView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      ...this.state,
      rotation: new THREE.Euler(),
      cameraPosition: new THREE.Vector3(0, 0, 20),
    };
  }

  componentDidMount() {
    const controls = new TrackballControls(this.refs.mainCamera,
      ReactDOM.findDOMNode(this.refs.react3));

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.addEventListener('change', () => {
      this.setState({
        cameraPosition: this.refs.mainCamera.position,
      });
    });

    this.controls = controls;
  }

  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
  }

  _onAnimate = () => {
    this.controls.update();
    this.setState({
      rotation: new THREE.Euler(0, this.state.rotation.y + 0.2 * Math.PI / 180, 0),
    });
  };

  render() {
    const scrollSize = 5;
    const width = window.innerWidth-scrollSize;
    const height = window.innerHeight-scrollSize;

    return (
      <div className="ThreeDView">
        <h5 style={bottomRight}>
          Sphere radius: {this.props.sphereRadius}
        </h5>
        <React3
          ref="react3"
          mainCamera="camera"
          width={width}
          height={height}
          onAnimate={this._onAnimate}
          clearColor={this.props.backgroundColor}
        >
        <scene>
          <perspectiveCamera
            ref="mainCamera"
            name="camera"
            fov={50}
            aspect={width / height}
            near={0.1}
            far={1000}
            position={this.state.cameraPosition}
          />
          <mesh rotation={this.state.rotation}>
            <sphereGeometry
              // resourceId="mySphere"
              radius={this.props.sphereRadius}
              widthSegments={16}
              heightSegments={8}
            />
            <meshBasicMaterial
              color={0xFF0000}
              wireframe
              wireframeLinewidth = {3}
            />
          </mesh>
        </scene>
      </React3>
    </div>);
  }
};

const bottomRight = {
  right: '15px',
  bottom: '5px',
  position: 'absolute',
  color: 'white'
}

function mapStateToProps(state){
  return {
    sphereRadius: state.radiusReducer
  };
}

export default connect(mapStateToProps)(ThreeDView);
