# Wt Web-App

Demo of a web application with user session, tree view and a 3D viewer. The application is implemented using [wt] and [threejs] libraries.

### Description
The main objective of this demo is to evaluate [wt] as a base technology for our platform. [wt] is a C++ library to develop web applications. The core library allows writing all the UI logic in C++ and provides a widget abstraction very similar to that of [Sim4Life], our desktop simulator. This is a very convenient feature since it would allow reusing a large  code base into the new platform. In addition, [wt] allows the integration side-by-side of third-party javascript libraries. In this demo, [threejs] is used to hander the 3D rendering in the 3D viewer.

### Review
- Language: C++
- Popularity: Github score 56, Stack-overflow score 40
- License: Dual: GNU General Public + commercial

**Pros**:

- C++ and widget abstraction allows high reusability and compatibility with existing code-base. High productivity!
- Can integrate side-by-side other third-party javascript libraries, e.g. [threejs]
- C++ integrates as well very well with ohter scripting language like python (see [boost.python])
- TODO [ongoing]

**Cons**:

- Build and deploy C++ applications can be time-consuming and complex compared to scripting languages-based libraries. Containerization of the development environment (ie. compilers, ...) might lighten this inconvenient but it is definitively more demanding than any other solution based on javascript or other scripting language.
- TODO [ongoing]


[wt]: https://wwww.webtoolkit.eu/wt
[threejs]: https://threejs.org/
[Sim4Life]: https://www.zurichmedtech.com/sim4life/
[boost.python]: http://www.boost.org/doc/libs/1_66_0/libs/python/doc/html/index.html
