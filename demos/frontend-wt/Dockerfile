FROM ubuntu:16.04

# https://packages.ubuntu.com/
# https://packages.ubuntu.com/xenial/g++
# https://packages.ubuntu.com/artful/libdevel/libboost-all-dev
RUN    apt-get update -qq \
    && apt-get install -yq \
                    wget \
                    cmake \
                    g++ \
                    libboost-all-dev \
                    libtbb-dev \
                    zlib1g-dev \
                    libssl-dev

## WT ---------------------------------------
# https://www.webtoolkit.eu/wt/download
# https://github.com/emweb/wt/releases
ARG wt_version=4.0.2
ENV WT_VERSION=${wt_version}
ENV WT_NAME=wt-${wt_version}

RUN cd /tmp \
    && wget https://github.com/emweb/wt/archive/${WT_VERSION}.tar.gz \
    && tar xf ${WT_VERSION}.tar.gz \
    && cd /tmp/${WT_NAME} && mkdir build && cd build \
    && cmake \
      -DCMAKE_INSTALL_PREFIX=/usr/local/${WT_NAME} \
      -DCMAKE_BUILD_EXAMPLES=OFF \
      ../ \
    && make -j4 \
    && make install \
    && rm -rf /tmp

WORKDIR /home/src
COPY . .

RUN mkdir build && cd build \
  && cmake .. \
  && make clean \
  && make \
  && mkdir /home/app \
  && cp -r /home/src/build/_bin/* /home/app

WORKDIR /home/app
EXPOSE 80

CMD ["./wtdemo", "--http-address=0.0.0.0", "--http-port=80", "--docroot=/home/app/wwwroot"]
