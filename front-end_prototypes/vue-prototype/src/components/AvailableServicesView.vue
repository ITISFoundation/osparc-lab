<template>
  <div class="AvailableServices">
    <h5>
      Available Services
      <template v-for="service in services">
         |
        <b-button v-on:click="serviceRequested(service)" :variant="'primary'">
          {{service.text}}
        </b-button>
      </template>
    </h5>
  </div>
</template>

<script>
import uuid from 'uuid'
import EventBus from './event-bus'

export default {
  name: 'AvailableServices',
  components: {
    uuid
  },
  data () {
    return {
      services: []
    }
  },
  mounted () {
    this.requestAvailableServices()
  },
  methods: {
    serviceRequested: function (service, event) {
      EventBus.$emit('serviceRequestedUp', service)
    },
    requestAvailableServices () {
      console.log('requestAvailableServices sent to the server')
      this.$socket.emit('requestAvailableServices')
    }
  },
  sockets: {
    radiusChangedByServer: function (val) {
      if (val.type === 'randomizer') {
        EventBus.$emit('radiusChanged', val.value)
      }
    },
    availableServices: function (val) {
      console.log('availableServices')
      if (val.type === 'availableServices') {
        this.services = val.value
      }
    }
  }
}
</script>


<style scoped>

</style>
