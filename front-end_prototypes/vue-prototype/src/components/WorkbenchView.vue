<template>
  <div class="Workbench">
    <h5>Workbench</h5>
    <PortGraph :graphConfig="workbenchConfig" :onEntityClick="entitySelected" />
  </div>
</template>


<script>
import PortGraph from 'vue-port-graph'
import uuid from 'uuid'
import EventBus from './event-bus'

export default {
  name: 'Workbench',
  components: {
    PortGraph,
    uuid
  },
  data () {
    return {
      workbenchConfig: {
        nodes: [],
        edges: [],
        options: {
          nodeWidth: 130,
          nodeHeight: 30,
          portRadius: 10,
          graphPadding: 20
        }
      }
    }
  },
  created: function () {
    this.workbenchConfig.nodes.push(
      {
        id: 'node_1',
        ports: [
          {
            uuid: uuid.v4(),
            id: 'out_0',
            type: 'output'
          }]
      }
    )
    this.workbenchConfig.nodes.push(
      {
        id: 'node_2',
        ports: [
          {
            uuid: uuid.v4(),
            id: 'in_0',
            type: 'input'
          }]
      }
    )
    this.workbenchConfig.edges.push(
      {
        source:
        {
          nodeId: this.workbenchConfig.nodes[0].id,
          portId: this.workbenchConfig.nodes[0].ports[0].id
        },
        target:
        {
          nodeId: this.workbenchConfig.nodes[1].id,
          portId: this.workbenchConfig.nodes[1].ports[0].id
        }
      }
    )
  },
  methods: {
    entitySelected (connection) {
      if (connection.type === 'node') {
        console.log(connection.data.id)
      }
    }
  },
  mounted () {
    EventBus.$on('serviceRequested', service => {
      this.workbenchConfig.nodes.push(
        {
          id: service.text,
          ports: [
            {
              uuid: uuid.v4(),
              id: 'out_0',
              type: 'output'
            }]
        }
      )
    })
  }
}
</script>


<style scoped>

</style>
