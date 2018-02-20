# This dockerfile is intended to create images for production!
# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8.9.2

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Tell Docker about the port we'll run on.
EXPOSE 8080

RUN npm install -g qxcompiler
# RUN npm install express socket.io

WORKDIR /home/node/
RUN qx create qxapp -I

# Copy all local files into the image.
WORKDIR /home/node/qxapp
COPY source source
RUN qx compile