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


#------------------------------------------------------------------------

FROM python:3

# Selects appropriate 'server-py-*/' folder
ARG serverdir

ENV SIMCORE_WEB_OUTDIR=/usr/src/app/client
ENV SIMCORE_WEB_HOSTNAME='0.0.0.0'
ENV SIMCORE_WEB_PORT=8080

WORKDIR /usr/src/app

COPY --from=0 /home/node/qxapp/source-output ${SIMCORE_WEB_OUTDIR}

COPY services-rpc-api/*/gen-py ./

COPY $serverdir/requirements.txt requirements.txt

RUN pip3 install --no-cache-dir -r ./requirements.txt \
    && python --version \
    && pip list --format=columns

COPY $serverdir/* ./

EXPOSE 8080

CMD ["python", "server.py"] 