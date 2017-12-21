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
- **Front-end/Back-end communication**
  - As usual, socket.io module could be used
- **Bind components in UI**
  - 'json object' -> 'model' qooxdoo built-in conversion used. It is similar to redux in that sense.
- **Add 3D renderer**
  - Using three.js directly. Requires downloading it first.
  - Three.js related OrbitControls.js and ShaderSkin.js were also used
- **Add workbench**
  - jquery-flowchart.js used. Requires downloading it first
  - nodes and links can be extended to fit our needs
- **Dynamic styling**
  - Includes for different themes that can be extended
  - Well separated from the logic, even though can be part of it
- **Extra impressions**
  - There are some 3rd party libraries that require lot of interaction with the code that do not work so well.
