# boilerplate qx-tornado-s4laas

Simple boilerplate with a [qx] front-end, a [tornado] web-server and [s4l] as a service.



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




[aiohttp]:http://aiohttp.readthedocs.io
[exploreflask]:https://exploreflask.com/en/latest/
[flask]:http://flask.pocoo.org/
[qx]:http://www.qooxdoo.org
[tornado]:http://www.tornadoweb.org/
[s4l]:https://www.zurichmedtech.com/sim4life/