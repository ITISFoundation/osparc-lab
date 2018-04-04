FROM node:8.9.2

LABEL maintainer=pcrespov

ENV NPM_CONFIG_LOGLEVEL warn

# TODO PC: set as host user, otherwise outdir is set as root in the host
WORKDIR /home/node/

# https://www.npmjs.com/package/qxcompiler
RUN npm install qxcompiler

# TODO PC: why to create again? not better taking entire client-qx??
ENV PATH="/home/node/node_modules/.bin/:${PATH}"
RUN qx create qxapp -I --qxpath /home/node/node_modules/qooxdoo-sdk/framework/

WORKDIR /home/node/qxapp
VOLUME /home/node/qxapp

CMD ["qx", "compile"]
