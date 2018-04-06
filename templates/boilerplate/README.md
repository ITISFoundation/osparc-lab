# boilerplate qx-tornado-s4laas

Simple boilerplate with a [qx] front-end, a [tornado] web-server and [s4l] as a service.

The source code is grouped as follows
 - ```client-qx``` is the [qx] client
 - ```server-node-express``` is a [nodejs] web server based on [express]
 - ```server-py-aiohttp``` is a [python] web server based on [aiohttp]
 - ```server-py-flask-eventlet``` is a web server with a [flask] application served by [eventlet]
 - ```services-rpc-api``` are the [thrift]-RPC APIs for computational services

#### Building dev dockers
```bash
docker-compose -f docker-compose.dev.yml build
```

builds a docker image tagged ```boilerplate_build-qx:latest``` with [qx] compiler inside.

```bash
docker-compose -f docker-compose.dev.yml run build-qx
```
will use container above to compile ```client-qx```. Output in ```client-qx/source-output```.


#### Running Python server in host computer

1. Create a python venv and activate it
```bash
conda create --yes --name boilerplate
source activate boilerplate
pip3 install -r server-py-aiohttp/requirements.txt
pip3 install -r server-py-flask-eventlet/requirements.txt
```

2. run the python server with [aiohttp] or [flask]

```bash
python server-py-aiohttp/server.py
python server-py-flask-eventlet/server.py
```
then open browser in ```http://localhost:8080```

#### Running all servers

Compose file is setup to launch three services qxapp, pyaio and pyflk to demo the same qx application served with different back-ends:
```bash
docker-compose build
docker-compose up
```
will run qx application with:
 - a node server in ```http://localhost:8080```
 - an async python server in ```http://localhost:8081```
 - a sync python server in ```http://localhost:8082```


[aiohttp]:http://aiohttp.readthedocs.io
[exploreflask]:https://exploreflask.com/en/latest/
[express]:https://expressjs.com
[flask]:http://flask.pocoo.org/
[nodejs]:https://nodejs.org/en/
[python]:https://www.python.org
[qx]:http://www.qooxdoo.org
[thrift]:https://thrift.apache.org
[tornado]:http://www.tornadoweb.org/
[s4l]:https://www.zurichmedtech.com/sim4life/

