# React.js review

###### Overview
- One of the most popular Front-end JavaScript framework
- Released in 2013
- MIT licensed
- Developed and maintained mainly by Facebook
- Very good performance due to its render-when-change philosophy

###### Starting point for prototyping:
- Based on create-react-app with webpack for quick setup
- Node.js + express used in web server side

##### Aspects reviewed:

- **Interactive layout**
  - Many packages provide very good looking interactive layouts
- **Front-end/Back-end communication**
  - socket.io module used for communication
  - Easy to set up in both server and client sides
  - Publish-subscribe pattern communication
- **Bind components in UI**
  - redux is the most popular module
  - Based on a store, actions and reducers: mutates the states of the components providing interactivity
  - Can get complex and not very scalable when dealing with heavy props and states
- **Add 3D renderer**
  - react-three and react-three-renderer are the modules that go on top of three.js which is based on WebGL
  - react-three-renderer used for prototyping even though not all three.js features are implemented
- **Add workbench**
  - Very nice packages found to represent a flowchart
  - nodes and links can be extended to fit our needs
- **Dynamic styling**
  - Easy to define styles shared between components
- **Extra impressions**
  - html, scripting and styling well separated
  - Not easy to mix scripting with templating
  - Lot of third party packages to choose to implement new features
  - Very active community behind and many examples already in place
  - Linear learning curve
