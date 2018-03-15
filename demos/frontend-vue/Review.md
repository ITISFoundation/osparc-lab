# Vue.js review

###### Overview
- Front-end JavaScript framework capable of powering advanced Single-Page Applications
- Released in 2014
- MIT licensed
- No specific company supporting it

###### Starting point for prototyping:
- Based on Vue's official vue-cli with webpack for quick setup
- Node.js + express used in web server side

###### In order to start prototyping:
- node.js required
- front-end created using
  - ```npm install -g vue-cli```
  - ```vue init webpack myapp```
  - ```cd myapp```
  - ```npm install```
- start server
  - ```yarn start```
- create deployment version
  - ```npm run build```
 - change listening port in:
  - build/dev-server.js

##### Aspects reviewed:

- **Interactive layout**
  - Not very fancy packages found for creating dynamic layouts
  - Many Vue dedicated layouts not in a mature status
  - Better to use html-css basic solutions
- **Front-end/Back-end communication**
  - socket.io module used for communication
  - Easy to set up in both server and client sides
  - Publish-subscribe pattern communication
- **Bind components in UI**
  - Built-in event bus (publish-subscribe) pattern communication
  - Very flexible and easy to use notification system
- **Add 3D renderer**
  - vue-three package used. It is wrapper on top of three.js which is based on WebGL
  - Flexible and easy to use
- **Add workbench**
  - Very poor resources found so far to build flowcharts
- **Dynamic styling**
  - Easy to define styles shared between components
- **Extra impressions**
  - Kind of a mixture of react.js and angular.js
  - Templating, scripting and styling well separated
  - Lot of templating logic goes into html side code
  - Lightweight framework that needs extra third party packages/modules to build components
  - It is growing rapidly what brings new cool features
  - Very active community behind
  - Easy learning curve
