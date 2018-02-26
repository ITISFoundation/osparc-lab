# Compilation stage ----
FROM node:8.9.2

LABEL maintainer=pcrespov

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /home/node/
# https://www.npmjs.com/package/qxcompiler
RUN npm install qxcompiler

# TODO: why to create again? not better taking entire client-qx??
ENV PATH="/home/node/node_modules/.bin/:${PATH}"
RUN qx create qxapp -I --qxpath /home/node/node_modules/qooxdoo-sdk/framework/

WORKDIR /home/node/qxapp
COPY client-qx/source source
RUN qx compile


# Deployment stage -----
FROM node:8.9.2

WORKDIR /home/node/
COPY --from=0 /home/node/qxapp/source-output source-output
COPY server-node-express .

RUN npm install -y

EXPOSE 8080

CMD ["npm", "start"]
