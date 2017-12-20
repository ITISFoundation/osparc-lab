#!/bin/bash

# run from repo root folder
docker run -it -v $(pwd):/usr/app -p 8000:8000 itisfoundation/doc-generator:latest
