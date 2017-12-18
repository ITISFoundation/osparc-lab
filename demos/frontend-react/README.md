# Front-end Prototype using [React.js](https://reactjs.org/)

## Description
  - The goal of this prototype is to review the following aspects:
	- Interactive layout
	- Front-end/Back-end communication
	- Bind components in UI
	- Add 3D renderer
	- Add workbench
	- Dynamic styling


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
  sudo docker run -it --rm -v $(pwd)/app:/home/node/app -w /home/node/app -p 6001:6001 -p 6002:6002 --dns 172.16.8.15 node:8.9.2 bash

  # now in container's bash
  # Add --no-bin-links flag if it complains about 'read-only file system, symlink...'
  npm install --no-bin-links
  npm start
```
 - Alternatively, build a dev image and run install and start using container's bash
 ```bash
   cd frontend-react
   sudo docker run -it -v $(pwd)/app:/home/node/app  itis/react-app:dev /bin/bash

   # now in container's bash
   npm install --no-bin-links
   npm start
 ```



 - The production setup is specified in the Dockerfile.
