<template>
  <div>
    <label>Day</label>
    <input type="radio" value=0 v-model="internalNightSelected">
    <input type="radio" value=1 v-model="internalNightSelected">
    <label>Night</label>
  </div>
</template>

<script>

import EventBus from './event-bus'

export default {
  name: 'StyleSwitch',
  props: ['nightSelected'],
  data () {
    return {
      internalNightSelected: 0
    }
  },
  watch: {
    'internalNightSelected': function () {
      EventBus.$emit('nightSelectionChanged', this.internalNightSelected)
    }
  },
  created () {
    this.internalNightSelected = this.nightSelected
  }
}
</script>
