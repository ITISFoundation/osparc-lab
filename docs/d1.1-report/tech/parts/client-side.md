## Frameworks

The front-end part corresponds to the software running on the client side. The server-side transmits the program/instructions to the web-browser, on the client-side, which interprets and executes them. The front-end interacts directly with the user and for that reason, one of its main features of front-end frameworks is the Graphical User Interface (GUI). There is a wide variety of frameworks that supports the development of front-ends among which we have pre-selected: [vue], [react], [qooxdoo] and [wt].

In order to review different frameworks, we decided to build a Single-Page-Application with a similar User Interface implementing the same features so that we could make a fair comparison.

The aspects reviewed are the following:  

- **Interactive layout**: The layout consists of at least 4 main components (Available services, Settings viewer, 3D renderer and Workbench). The user should be able to interact with the sizing/position of those components. A Results viewer has been also implemented for the React and qooxdoo prototypes.  
- **3D renderer**: The 3D viewer shows an interactive object. Three.js is the most popular JavaScript library that uses WebGL and has been used for all 4 prototypes.  
- **Workbench**: Shows how the different computational services are connected to conform a pipeline.  
- **Data binding in UI**: All the information used in the frontend is a JSON object. This data needs to be converted to something meaningful for the user so that the complexity behind turns into buttons, text/number inputs...  
- **Dynamic styling**: By clicking a checkbox or dropdown menu, the style should be switchable.  
- **Front-end/Back-end communication**: Some logic is implemented in the client-side, but the heaviest logic stays in the server side. That is why the client needs to communicate with the server. E.g. when the web application is started, it asks the server what are the available services. For vue, react and qooxdoo, the web socket socket.io module was used.  

### [vue]

![vue-screenshot](../img/vue.png)

- **Interactive layout**
    - Not very fancy packages found for creating dynamic layouts
    - Many Vue dedicated layouts not in a mature status
    - Better to use HTML-CSS basic solutions
    - vue-splitpane module used
- **3D renderer**
    - Three.js library used
    - Flexible and easy to use
- **Workbench**
    - Very poor resources found to build flowcharts
    - vue-port-graph module used
- **Data binding in UI**
    - The declarative UI makes it easy to mix HTML code with JavaScript based logic coding
    - Built-in event bus (publish-subscribe) pattern communication
    - Very flexible and easy to use notification system
- **Dynamic styling**
    - Easy to define styles shared between components
- **Front-end/Back-end communication**
    - vue-socket.io module used for communication
    - Easy to set up in both server and client sides
    - Publish-subscribe pattern communication
- **Extra impressions**
    - Kind of a mixture of React.js and Angular.js
    - Templating, scripting and styling well separated
    - Lot of templating logic goes into html side code
    - Lightweight framework that needs extra third party packages/modules to build components
    - It is growing rapidly what brings new cool features
    - Very active community behind
    - Easy learning curve

### [react]

![react-screenshot](../img/react.jpg)

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

### [qooxdoo]

![qx-screenshot](../img/qx.png)

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

### [wt]

![wt-screenshot](../img/wt.png)

TODO: short description review, pros, cons

## Conclusions

This is a comparative table with the pre-selected framework and some key-points

|                | vue          | react        |      qooxdoo |
|----------------|--------------|--------------|--------------|
|  **License**   | MIT licensed | MIT licensed | MIT licensed |
| **Popularity** | <ul><li>Released in 2014</li><li>75000 stars in Github</li><li>12000 questions in Stack overflow</li></ul> | <ul><li>Released in 2013</li><li>83000 stars in Github</li><li>65000 questions in Stack overflow</li></ul> | <ul><li>Released in 2009</li><li>600 stars in Github</li><li>1000 questions in Stack overflow</li></ul> |
|    **Pros**    | <ul><li>Mix between Angular and React</li><li>HTML, CSS and logic nicely separated</li></ul> | <ul><li>Facebook supports it. One of the most popular Front-End JavaScript framework</li><li>Lot of dedicated and easy to install 3rd party libraries | <ul><li>Desktop-like web application</li><li>Object Oriented programming model</li><li>Lots of native 3rd party libraries available</li><li>Three.js used directly</li><li>Complete control over dependencies |
|    **Cons**    | <ul><li>No specific company supporting it</li><li>Not many dedicated 3rd party libraries available</li><li>Lack of control over dependencies</li></ul> | <ul><li>HTML, CSS and logic not very well separated</li><li>Lack of control over dependencies</li></ul> | <ul><li>Not a big community behind</li><li>Some 3rd party libraries do not integrate very well</li></ul> |

The main difference between vue, react and qooxdoo is that while the first two provide very light frameworks and programming concepts with simple skeletons to start building on top of, qooxdoo provides a mature framework with a collection UI widgets. What means that for vue and react applications whatever UI component you want to add, you need to look for it out there and install it, using the Node Package Manager, together with its dependencies in the project. In qooxdoo, if the original framework doesn't provide the component, you need to download the desired package and keep it within the project.

### Recommendations
Based on our analysis and how mature the frameworks we reviewed are, vue should be discarded.
Between [react] and [qooxdoo], we have the feeling that both frameworks could work, but taking into the popularity and support the community can provide, our recommendations is to use [react].



[vue]: https://vuejs.org
[react]: https://reactjs.org
[qooxdoo]: http://www.qooxdoo.org
[wt]: https://www.webtoolkit.eu/wt
