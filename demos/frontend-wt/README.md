# Wt Web-App

Demo of a web application with user session, tree view and a 3D viewer. The application is implemented using [wt] and [threejs] libraries.

### Description
The main objective of this demo is to build a web UI using [wt] as a base technology. [wt] cannot be defined *per se* as a client-side framework, but instead as a C++ library to develop web applications. It is actually a server-side solution but it allows writing web GUIs in C++ using a widget abstraction. This paradigm is traditionally used in GUI programming in desktop applications, as in [Sim4Life], which makes it very convenient. [wt] also permits the integration side-by-side of third-party javascript libraries. In this demo, one of the views, uses [threejs] to handle the 3D rendering running directly at the client-side.

### Review
- Language: C++
- Popularity: Github score 56, Stack-overflow score 40
- License: Dual: GNU General Public + commercial

**Pros**:

- C++ and widget abstraction allows high reusability and compatibility with existing code-base
- Abstracts request handling and UI rendering
- Integrates session management and lifetime: every user has its own application object and deployment models for with dedicated/shared processes per session.
- Can integrate side-by-side other third-party javascript libraries, e.g. [threejs]
- C++ integrates very well with other scripting language like python (see [boost.python])
 ...), etc
- Other advantages inherent to the C++ language: type safety, speed, support to concurrency (multi-threading, coroutines,

**Cons**:

- Build and deploy C++ applications can be time-consuming and complex compared to scripting languages-based libraries. Containerization of the development environment (ie. compilers, ...) might lighten this inconvenient but it is definitively more demanding than any other solution based on javascript or other scripting language.
- Not clear separation between server-client. This is intentionally avoided by design, but it can become an issue when the target is to clearly control the responsibility of each side (e.g. to reduce communication between both sides).


[wt]: https://wwww.webtoolkit.eu/wt
[threejs]: https://threejs.org/
[Sim4Life]: https://www.zurichmedtech.com/sim4life/
[boost.python]: http://www.boost.org/doc/libs/1_66_0/libs/python/doc/html/index.html
