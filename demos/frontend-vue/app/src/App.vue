<template>
  <div id="app" v-bind:style='[style1, styleItalia]'>
    <div style="width: 100%; overflow: hidden;">
      <div style="width: 90%; float: left;">
        <IListenToSockets v-bind:style='[style1, styleItalia]'></IListenToSockets>
      </div>
      <div style="margin-left: 20px;">
        <StyleSwitch v-bind:nightSelected="nightSelected" v-bind:style='[style1, styleItalia]'></StyleSwitch>
      </div>
    </div>
    <AvailableServices v-bind:style='[style1, styleItalia]'></AvailableServices>
    <div class='components-container'>
      <split-pane :min-percent='15' :default-percent='70' split="horizontal">
        <template slot="paneL">
          <split-pane :min-percent='15' :default-percent='25' split="vertical">
            <template slot="paneL">
              <ServiceSettings v-bind:style='[style1, styleItalia]'></ServiceSettings>
            </template>
            <template slot="paneR">
              <ThreeDView id='canvas4three' v-bind:style='[style2, styleItalia]'></ThreeDView>
            </template>
          </split-pane>
        </template>
        <template slot="paneR">
          <Workbench v-bind:style='[style3, styleItalia]'></Workbench>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import splitPane from 'vue-splitpane'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSocketio from 'vue-socket.io'

import IListenToSockets from './components/IListenToSockets'
import StyleSwitch from './components/StyleSwitch'
import AvailableServices from './components/AvailableServicesView'
import ServiceSettings from './components/ServiceSettingsView'
import ThreeDView from './components/3DView'
import Workbench from './components/WorkbenchView'
import EventBus from './components/event-bus'

// import { addAvailableService, getAvailableServices, addService, getServices } from './components/ServiceManager'
// import EventBus from './event-bus'
// import { addAvailableService, getAvailableServices } from './components/ServiceManager'

Vue.use(BootstrapVue)
Vue.use(VueSocketio, 'http://localhost:5001')

export default {
  name: 'app',
  data () {
    return {
      workbenchConfig: {},
      nightSelected: 0,
      baseColor: 235,
      styleItalia: {}
    }
  },
  components: {
    splitPane,
    IListenToSockets,
    StyleSwitch,
    AvailableServices,
    ServiceSettings,
    ThreeDView,
    Workbench
  },
  computed: {
    style1: function () {
      var baseColor = this.baseColor
      baseColor = baseColor + 0
      var textColor = 255 - baseColor
      return {
        'background-color': 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
        'color': 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
      }
    },
    style2: function () {
      var baseColor = this.baseColor
      baseColor = baseColor + 10
      var textColor = 255 - baseColor
      return {
        'background-color': 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
        'color': 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
      }
    },
    style3: function () {
      var baseColor = this.baseColor
      baseColor = baseColor + 20
      var textColor = 255 - baseColor
      return {
        'background-color': 'rgb(' + baseColor + ',' + baseColor + ',' + baseColor + ')',
        'color': 'rgb(' + textColor + ',' + textColor + ',' + textColor + ')'
      }
    }
  },
  mounted () {
    EventBus.$on('serviceRequestedUp', service => {
      EventBus.$emit('serviceRequested', service)
    })
    EventBus.$on('serviceComputeOutputUp', service => {
      if (service.name === 'randomizer') {
        var min = Number(service.settings[0].value)
        var max = Number(service.settings[1].value)
        var newEdge = Math.floor(Math.random() * (max - min + 1) + min)
        EventBus.$emit('radiusChanged', newEdge)
      }
    })
    EventBus.$on('serviceComputeOutputUp', service => {
      if (service.name === 'randomizer') {
        var min = Number(service.settings[0].value)
        var max = Number(service.settings[1].value)
        var newEdge = Math.floor(Math.random() * (max - min + 1) + min)
        EventBus.$emit('radiusChanged', newEdge)
      }
    })
    EventBus.$on('nightSelectionChanged', newValue => {
      this.nightSelected = newValue
      if (this.nightSelected === '1') {
        this.baseColor = 66
      } else {
        this.baseColor = 235
      }
      this.styleItalia = {}
    })
  },
  sockets: {
    radiusChangedByServer: function (val) {
      if (val.type === 'randomizer') {
        EventBus.$emit('radiusChanged', val.value)
      }
    },
    whatInItalia: function (val) {
      if (val.type === 'result') {
        var result = Number(val.value[0])
        if (result === 1) {
          this.styleItalia = {
            'background-color': 'rgb(249,200,203)',
            'color': 'black'
          }
        } else {
          this.styleItalia = {}
        }
      }
    }
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.components-container {
		position: relative;
    border: 1px;
    height: calc(100vh - 90px);
}

</style>
