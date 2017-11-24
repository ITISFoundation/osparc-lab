FROM alpine

MAINTAINER  Manuel guidon <guidon@itis.ethz.ch>

RUN apk add --no-cache g++ bash

WORKDIR /work

ADD ./code /work
ADD ./simcore.io /simcore.io
RUN chmod +x /simcore.io/*

ENV PATH="/simcore.io:${PATH}"

RUN g++ -o test main.cpp
RUN rm *.cpp
