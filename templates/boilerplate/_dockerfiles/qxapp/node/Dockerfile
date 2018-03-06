# Compilation stage ----
FROM node:8.9.2

LABEL maintainer=pcrespov

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /home/node/
# https://www.npmjs.com/package/qxcompiler
RUN npm install qxcompiler

# TODO: why to create again? not better taking entire client-qx??
ENV PATH="/home/node/node_modules/.bin/:${PATH}"
#RUN qx create qxapp -I --qxpath /home/node/node_modules/qooxdoo-sdk/framework/

WORKDIR /home/node/qxapp
COPY client-qx/source source
COPY client-qx/*.json ./
RUN qx compile


# Deployment stage -----
FROM node:8.9.2

ARG web_app_port=8080

ENV SIMCORE_WEB_HOSTNAME "0.0.0.0"
ENV SIMCORE_WEB_PORT $web_app_port
ENV SIMCORE_WEB_OUTDIR /home/node/source-output

ARG s4l_ip="0.0.0.0"
ARG s4l_port="9095"
ENV CS_S4L_HOSTNAME $s4l_ip
ENV CS_S4L_PORT $s4l_port

WORKDIR /home/node/
COPY --from=0 /home/node/qxapp/source-output source-output
COPY server-node-express .

# TODO ensure npm@5.5.1
RUN npm install -y \
  && echo node $(node --version) \
  && echo npm $(npm --version)

EXPOSE $web_app_port

CMD ["npm", "start"]
