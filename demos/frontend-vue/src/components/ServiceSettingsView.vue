<template>
  <div class="ServiceSettings">
    <h5>Service settings</h5>
    <template v-if="settings.length>0">
      <form>
        {{service.text}}
        <br />
        <template v-for="setting in settings">
          {{setting.text}}: <input type='setting.type' v-model="setting.value" />
          <br />
        </template>
        <button @click.prevent="submitValues()">Apply</button>
      </form>
    </template>
  </div>
</template>


<script>
import EventBus from './event-bus'

export default {
  name: 'ServiceSettings',
  data () {
    return {
      service: '',
      settings: []
    }
  },
  created: function () {

  },
  mounted () {
    EventBus.$on('serviceRequested', service => {
      this.service = service
      this.settings.length = 0
      for (var i = 0; i < service.settings.length; i++) {
        this.settings.push(service.settings[i])
      }
    })
  },
  methods: {
    submitValues (submitEvent) {
      if (this.service.name === 'requestWhatInItalia') {
        this.$socket.emit('requestWhatInItalia', this.service)
      } else {
        EventBus.$emit('serviceComputeOutputUp', this.service)
      }
    }
  }
}
</script>


<style scoped>

</style>
