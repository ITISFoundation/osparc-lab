## doc-generator

Builds a docker with tools (currently [mkdocs](http://www.mkdocs.org/)) that parse docs/ and publish documentation in a website

#### Usage

[mkdocs](http://www.mkdocs.org/) reads [mkdocs.yml](../../mkdocs.yml) configuration and serves a website with live-reload (i.e. changes in doc will be automatically reflected in the web live):
```
  cd osparc-lab

  # builds tools
  docker build -t doc-generator tools/doc-generator

  # or can simply pull it from itisfoundation registry
  docker pull itisfoundation/doc-generator:latest

  # serves doc website (dev)
  docker run -it -v $(pwd):/usr/app -p 8000:8000 doc-generator


  # builds website
  docker run -it -v $(pwd):/usr/app -p 8000:8000 doc-generator python -m mkdocs build
```

To [generate a static web](http://www.mkdocs.org/#building-the-site) then run
```
docker run -it -v $(pwd):/usr/app -p 8000:8000 doc-generator python -m mkdocs build
```
and will create all the code in a ```site``` folder.
