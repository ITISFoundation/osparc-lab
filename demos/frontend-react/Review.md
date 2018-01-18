# React.js review

###### Overview
- One of the most popular Front-end JavaScript framework
- Released in 2013
- MIT licensed
- Developed and maintained mainly by Facebook
- Very good performance due to its render-when-change philosophy

###### Prototype based on:
- create-react-app with webpack for quick setup:
  - https://medium.com/@diamondgfx/learning-react-with-create-react-app-part-1-a12e1833fdc
- Node.js + express used in web server side

###### In order to start prototyping:
- node.js required
- front-end created using
  - ```npm install -g create-react-app```
  - ```create-react-app cd myapp```
- pull the prototype out of the context of the create-react-app framework and into a standard webpack build
  - ```yarn run eject```
- start server
  - ```yarn start```
- change listening port in:
  - scripts/start.js

##### Aspects reviewed:
- **Interactive layout**
  - Many packages provide very good looking interactive layouts
  - react-rnd module used
- **3D renderer**
  - react-three and react-three-renderer are the modules that go on top of Three.js
  - react-three-renderer used even though not all three.js features are implemented
- **Workbench**
  - Very nice packages found to represent a flowchart
  - nodes and links can be extended to fit our needs
  - storm-react-diagrams module used
- **Data binding in UI**
  - redux is the most popular module for component communication
  - Based on a store, actions and reducers: mutates the states of the components providing interactivity
- **Dynamic styling**
  - Easy to define styles shared between components
- **Front-end/Back-end communication**
  - socket.io-client together with socket.io modules used for communication
  - Easy to set up in both server and client sides
  - Publish-subscribe pattern communication
- **Extra impressions**
  - HTML, scripting and styling well separated
  - Not easy to mix scripting with templating
  - Lot of third party packages to choose to implement new features
  - Very active community behind and many examples already in place
  - Linear learning curve
