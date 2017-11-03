<template>
  <div>
    <b-button v-on:click="randomRadiusServer()" v-bind:variant="variant" size="sm">Random radius</b-button>
    <b-button @click="pingServer()" v-bind:variant="variant" size="sm">Ping Server</b-button>
    <p v-if="isConnected">Server says: {{socketMessage}}</p>
    <p v-if="!isConnected">Socket not connected!</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isConnected: false,
      variant: 'danger',
      socketMessage: ''
    }
  },
  sockets: {
    connect () {
      console.log('socket connected IListenToSockets')
      this.isConnected = true
      this.variant = 'success'
    },

    disconnect () {
      console.log('socket disconnected')
      this.isConnected = false
      this.variant = 'danger'
    },

    customEmit: function (val) {
      if (val.type === 'customEmit') {
        console.log('This method was fired by the socket server:' + val.text)
        this.socketMessage = val.text
      }
    }
  },
  methods: {
    pingServer () {
      console.log('pingServer sent to the server')
      this.$socket.emit('pingServer', 'PING!')
    },
    randomRadiusServer () {
      console.log('randomRadiusServer sent to the server')
      this.$socket.emit('randomRadius', 'randomRadius')
    }
  }
}
</script>
