FROM ubuntu:16.04

RUN apt-get update && apt-get install -y \
	build-essential \
	clang \
	llvm \
	cmake \
	cmake-curses-gui \
	python3

RUN mkdir /source
RUN mkdir /build

WORKDIR /build
