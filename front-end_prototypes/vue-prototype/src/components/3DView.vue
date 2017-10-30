<template>
  <div class="ThreeDView">
    <h5>3D View. Sphere radius: {{sphereRadius}}</h5>
  </div>
</template>


<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import EventBus from './event-bus'

export default {
  name: 'ThreeDView',
  data () {
    return {
      sphereRadius: 1
    }
  },
  methods: {

  },
  mounted: function () {
    var canvas4three = document.getElementById('canvas4three')

    var scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x4C4C4F)
    scene.background = new THREE.Color(canvas4three.style.backgroundColor)
    var camera = new THREE.PerspectiveCamera()
    camera.position.z = 20
    var controls = new TrackballControls(camera, canvas4three)

    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)

    canvas4three.appendChild(renderer.domElement)

    var geometry = new THREE.SphereGeometry(this.sphereRadius, 32, 16)
    var material = new THREE.MeshPhongMaterial({
      wireframe: true,
      wireframeLinewidth: 3,
      color: 0xFF0000
    })
    var mesh = new THREE.Mesh(geometry, material)

    var pointLight = new THREE.PointLight(0xFFFFFF)
    pointLight.position.x = -10
    pointLight.position.y = 10
    pointLight.position.z = 40

    scene.add(camera)
    scene.add(mesh)
    scene.add(pointLight)

    window.addEventListener('resize', onWindowResize, false)

    function onWindowResize (event) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      controls.handleResize()

      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    }

    function render () {
      scene.background = new THREE.Color(canvas4three.style.backgroundColor)

      requestAnimationFrame(render)
      mesh.rotation.y += 0.2 * Math.PI / 180
      controls.update()
      renderer.render(scene, camera)
    }
    render()

    EventBus.$on('radiusChanged', sphereRadius => {
      this.sphereRadius = sphereRadius
      mesh.scale.x = this.sphereRadius
      mesh.scale.y = this.sphereRadius
      mesh.scale.z = this.sphereRadius
    })
  }
}
</script>


<style scoped>

</style>
