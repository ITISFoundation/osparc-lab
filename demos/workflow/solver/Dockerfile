FROM alpine

MAINTAINER  Manuel guidon <guidon@itis.ethz.ch>

RUN apk add --no-cache g++ bash jq

WORKDIR /work

ADD ./code /work
ADD ./simcore.io /simcore.io
RUN chmod +x /simcore.io/*

ENV PATH="/simcore.io:${PATH}"

RUN g++ -std=c++11 -o test main.cpp
RUN rm *.cpp
