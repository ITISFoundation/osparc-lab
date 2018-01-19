## Frameworks

At the back-end, the server-side of the web application while for the back-end (web server-side) the following web-frameworks were pre-selected: [express] in node.js, [flask]/[sanic] in python and [wt] in C++.

All these web-frameworks provide standard features (included or within packages) for:

- routing URLs to handlers
- interacting with databases
- support user sessions and authorization
- templating system to render data (e.g HTML, JSON, XML, ...)
- security against web attacks

Most of the points below are highlights useful for the discussion in the context of this project.


## [express]

  - **Language**: node.js, js
  - **Popularity**: Github score 92, Stack-overflow score 83
  - **License**: MIT license

**Pros:**

  - *Productivity*:
    - Very high (if no issues with npm or configurations)
    - Same language as in client side
  - *Functionality*:
    - Large amount of packages for virtually everything!
    - npm proofs to be state-of-the-art managing dependencies but its complexity makes it very difficult (for non-experts) to track and solve errors.
    - TODO review ongoing

**Cons:**

  - Difficult to integrate python/C++ code (only via other processes)
  - TODO review ongoing


## [flask]/[sanic]
  - **Language**: python 3
  - **Popularity**: Github score 91, Stack-overflow score 77
  - **License**: BSD/MIT license

**Pros:**

- *Productivity*: light-weight complete web-framework.  
- *Functionality*: standard web-framework  
  - Using asynchronous APIs (sanic)
  - Allows mixed python/C++
  - TODO review ongoing

**Cons:**

-  TODO review ongoing

## [wt]
  - **Language** C++
  - **Popularity**: Github score 56, Stack-overflow score 40
  - **License**: Dual: GNU General Public + commercial

**Pros:**

- *Productivity*: UI programed in a similar way as in desktop app (analogous to Qt).
- *Functionality*: All power of C++: concurrency, courroutines, multi-threading ... you name it
    - Has the potential of replacing one-to-one MFC but difficult to proof
    - TODO review ongoing

**Cons:**

- First trials shows a high level of communication with the server  
- Needs some heavy-lifting to get it up & running in container (c++ libs, build, ...)  
- TODO review ongoing  

## Conclusions
Currently these are our recommendation of a web-framework (in order):

1. [flask]/[sanic]: preferred to develop the framework
1. [express]: as prototype/mockup servers
1. [wt] : keep an eye




[express]: http://expressjs.com/
[flask]: http://flask.pocoo.org/
[sanic]: https://github.com/channelcat/sanic
[wt]: http://www.webtoolkit.eu/wt
