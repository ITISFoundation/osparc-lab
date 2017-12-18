# Front-end Prototype using [qooxdoo](http://qooxdoo.org/)
https://github.com/qooxdoo/qooxdoo-cli

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
  cd frontend-qooxdoo

  sudo make build

  # run container in dev mode
  sudo make run
```

## Dev notes
- Followed (https://github.com/qooxdoo/qooxdoo-cli)
- Development setup is done *by hand*  running directly a *nodejs* image and setting up the react project using the container's bash
```bash
 cd frontend-qooxdoo
 sudo docker run -it --rm -v $(pwd)/app2:/home/node/app2 -w /home/node/app2 -p 7001:7001 --dns 172.16.8.15 node:8.9.2 bash

 # now in container's bash
 qx compile
 node server.js
```
