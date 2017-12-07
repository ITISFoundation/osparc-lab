# Front-end Prototype using [React.js](https://reactjs.org/)

 TODO short description goes here

## Description
  - TODO


## Setup

 - Running in dev-mode
``` bash
  cd frontend-react

  sudo make build

  # run container in dev mode
  sudo make run
```


## Dev notes
 - Followed blog on [Dockerizing a React application](https://medium.com/ai2-blog/dockerizing-a-react-application-3563688a2378)
 - Development setup is done *by hand*  running directly a *nodejs* image and setting up the react project using the container's bash
```bash
  cd frontend-react
  sudo docker run -it -v $(pwd)/app:/home/node/app -w /home/node/app -p 6001:6001 --rm node:8.9.2 bash

  # now in container's bash
  # Add --no-bin-links flag if it complains about 'read-only file system, symlink...'
  npm install
  npm start
```
 - Alternatively, build a dev image and run install and start using container's bash
 ```bash
   cd frontend-react
   sudo docker run -it -v $(pwd)/app:/home/node/app  itis/react-app:dev /bin/bash

   # now in container's bash
   npm install
   npm start
 ```



 - The production setup is specified in the Dockerfile.
