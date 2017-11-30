FROM alpine

MAINTAINER  Manuel guidon <guidon@itis.ethz.ch>

RUN apk add --no-cache g++ bash jq

WORKDIR /work

ADD ./code /work
ADD ./simcore.io /simcore.io
RUN chmod +x /simcore.io/*

ENV PATH="/simcore.io:${PATH}"

RUN gcc -c -fPIC -lm tinyexpr.c -o libtiny.o
RUN g++ -std=c++11 -o test main.cpp libtiny.o
RUN rm *.cpp *.c *.h
