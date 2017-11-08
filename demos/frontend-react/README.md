# Front-end Prototype using [React.js](https://reactjs.org/)

 TODO short description goes here

## Description
  - TODO


## Setup

 - Running in dev-mode
``` bash

  cd front-end_prototypes/react

  # build dev image ->
  sudo make build-dev

  # run container in dev mode
  sudo make run-dev
```


## Dev notes
 - Followed blog on [Dockerizing a React application](https://medium.com/ai2-blog/dockerizing-a-react-application-3563688a2378)
 - Development setup is done *by hand*  running directly a *nodejs* image and setting up the react project using the container's bash
```bash
  cd front-end_prototypes/react
  sudo docker run -ti -v $(pwd)/app:/home/node/app -w /home/node/app -p 6001:6001 --rm node:7.8.0 bash

  # now in container's bash
  npm install
  npm run start
```
 - Alternatively, build a dev image and run install and start using container's bash
 ```bash
   cd front-end_prototypes/react
   sudo docker run -it -v $(pwd)/app:/home/node/app  itis/react-app:dev /bin/bash

   # now in container's bash
   npm install
   npm run start
 ```



 - The production setup is specified in the Dockerfile.
