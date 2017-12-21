# qooxdoo review

###### Overview
- Front-end JavaScript framework capable of powering advanced Desktop-like web-applications
- First released in 2005. v1.0 in 2009
- MIT licensed
- No specific company supporting it
- Almost no HTML or CSS required since own UI widgets items are used
- In order to use 3rd party libraries, they need to be downloaded in a js file(s) format first

###### Prototype based on:
- qooxdoo command line interface. Following tutorial in Github:
   - https://github.com/qooxdoo/qooxdoo-cli

###### In order to start prototyping:
- node.js v8 required
- front-end created using
  - ```npm install -g qx-cli```
  - ```qx create myapp```
  - ```cd myapp```
  - ```qx compile```
- start serving the source-output with a minimum of interaction with the server
 - ```node server.js```

##### Aspects reviewed:
- **Interactive layout**
  - qx.ui.window.Window used to make it look like a Desktop application
- **3D renderer**
  - Using Three.js directly
  - Three.js related OrbitControls.js and ShaderSkin.js were also used for controlling the camera and adding texture to the head model respectively
- **Workbench**
  - jquery-flowchart.js used
  - nodes and links can be extended to fit our needs
- **Data binding in UI**
  - 'json object' -> 'model' qooxdoo built-in conversion used
  - Similar to redux
- **Dynamic styling**
  - Includes different themes that can be extended/customized
  - Well separated from the logic, even though can be part of it
- **Front-end/Back-end communication**
  - As usual, socket.io module used
- **Extra impressions**
  - All 3rd party libraries used need to be downloaded first
  - There are some 3rd party libraries that require lot of interaction with the code that do not work so well
