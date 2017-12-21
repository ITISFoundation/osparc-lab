# This dockerfile is intended to create images for production!
# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8.9.2

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Tell Docker about the port we'll run on.
EXPOSE 7001

RUN npm install express socket.io

WORKDIR /home/node/
RUN git clone https://github.com/qooxdoo/qx-cli
WORKDIR /home/node/qx-cli
RUN npm install && npm link

WORKDIR /home/node/
RUN git clone https://github.com/qooxdoo/qooxdoo-compiler
WORKDIR /home/node/qx-cli
RUN npm link ../qooxdoo-compiler

WORKDIR /home/node/
RUN git clone https://github.com/qooxdoo/qooxdoo
WORKDIR /home/node/qx-cli
RUN npm link ../qooxdoo

WORKDIR /home/node/qooxdoo-compiler
RUN npm rebuild node-sass

WORKDIR /home/node/
RUN qx create app -I

# Copy all local files into the image.
WORKDIR /home/node/app
COPY source source
COPY server.js server.js
RUN qx compile
# this is should be copied when compiling
COPY source/resource source-output/app/resource