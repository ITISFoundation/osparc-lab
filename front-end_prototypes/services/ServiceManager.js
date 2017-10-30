'use strict';

const uuid = require('uuid')

module.exports = class ServiceManager {
  constructor () {
    this.AvailableServices = []

    this.AvailableServices.push({
      uuid: uuid.v4(),
      name: 'randomizer',
      text: 'Random',
      tooltip: 'Creates a random number in the given range',
      input: 'none',
      output: 'number',
      settings: [
        {
          name: 'lowerLimit',
          text: 'Lower Limit',
          type: 'number',
          value: 1
        },
        {
          name: 'upperLimit',
          text: 'Upper Limit',
          type: 'number',
          value: 10
        }
      ]
    })

    this.AvailableServices.push({
      uuid: uuid.v4(),
      name: 'adder',
      text: 'Adder',
      tooltip: 'Adds the value in the settings to the input',
      input: 'number',
      output: 'number',
      settings: [
        {
          name: 'add',
          text: 'Add',
          type: 'number',
          value: 5
        }
      ]
    })

    this.AvailableServices.push({
      uuid: uuid.v4(),
      name: 'multiplier',
      text: 'Multiplier',
      tooltip: 'Multiplies the input by the value in the settings',
      input: 'number',
      output: 'number',
      settings: [
        {
          name: 'multiply',
          text: 'Multiply by',
          type: 'number',
          value: 2
        }
      ]
    })

    this.AvailableServices.push({
      uuid: uuid.v4(),
      name: 'divider',
      text: 'Divider',
      tooltip: 'Divides the input by the value in the settings',
      input: 'number',
      output: 'number',
      settings: [
        {
          name: 'divide',
          text: 'Divide by',
          type: 'number',
          value: 2
        }
      ]
    })

    this.AvailableServices.push({
      uuid: uuid.v4(),
      name: 'requestWhatInItalia',
      text: 'Italia',
      tooltip: 'You know what it does',
      input: 'none',
      output: 'bool',
      settings: [
        {
          name: 'day',
          text: 'Day',
          type: 'number',
          value: 0
        }
      ]
    })
  }

  getAvailableServices() {
    return this.AvailableServices
  }
}
