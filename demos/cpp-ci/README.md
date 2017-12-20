# CI Tests Issue 24

This folder contains a C++ project, which can be analyzed for 

* code coverage in test
* static analysis
* showing how to work with deploy and build docker images

## Strategy behind deploy/build docker images

There are two helper scripts (`setup.py` and `build.py`), which help to find the correct command lines.
The script helps to do a full build docker images, run the generated docker images.
It is designed to serve two purposes:
1. do everything at once for continuous integration on travis or locally
1. have the possibility to fine grain the steps by passing additional commands to diffent stages


### `setup.py`: script in the host container

The options are as following

```python3 setup.py --help
usage: setup.py [-h] [--create_build_image] [--create_deploy_image]
                [--test_deploy_image] [--run_build_image] [--run_deploy_image]
                [--build_and_deploy] [--travis_build_and_test]

Used outside build container

optional arguments:
  -h, --help            show this help message and exit
  --create_build_image  Build docker image for building the source
  --create_deploy_image
                        Build docker image for deployment
  --test_deploy_image   Test docker image for deployment
  --run_build_image     Additional options passed to the run docker command.
                        Options after the option IMAGE_NAME are passed after
                        the image name.
  --run_deploy_image    Additional options passed to the run docker command.
                        Options after the option IMAGE_NAME are passed after
                        the image name.
  --build_and_deploy    Do everything from building, deploying and testing
  --travis_build_and_test
                        Do everything from building, deploying and testing
```

The options `--build_and_deploy` and `--travis_build_and_test` do the same except the latter builds into `/tmp` instead of the current working directory. They both build the build-docker-image, configure, build and test the source code, followed by building a deploy-docker-image and a test on the deploy-docker-image.

The option `--create_build_image` builds the docker image, which can be used to compile the code.

The option `--create_deploy_image` build the deploy image assuming that the current working directory contains the `cmake`-ed binary folder.

The options `--run_build_image` and `--run_deploy_image` wrap the `docker run ...` command. Additional options can be optionally passed to the docker run command by simply appending them. The image name is given by the script. Passing a commmand executed within the docker container can be done also via the additional options: every option after `IMAGE_NAME` will be treated as command and its options. Example: `python3 setup.py --run_build_image IMAGE_NAME bash` start the build docker in a bash shell.

The option `--run_build_image` is special, since it maps the current working directory to `/build` within the docker image as well the full source code into `/source`. Therefore, you can change the source code outside the docker image and still compile it nicely within the build-docker.

Last but not least, the script changes the owner of the `/build` folder output (typically `root` within the docker) back to the folder owner.


### build.py: commands used within the build container

The options are as following

```python3 build.py --help
usage: build.py [-h] [--configure_gcc] [--configure_clang] [--build] [--test]
                [--all_gcc] [--all_clang] [--all]

Used within build container

optional arguments:
  -h, --help         show this help message and exit
  --configure_gcc    Configure build with gcc
  --configure_clang  Configure build with clang
  --build            Build configured solution
  --test             Test built solution
  --all_gcc          Configure, build and test with gcc
  --all_clang        Configure, build and test with clang
  --all              Configure, build and test with gcc and clang
```

The options shall be self explaining, i.e., `--configure*` uses `cmake` to configure, `--build` and `--test` use `make` and `ctest`, respectively.
Important to know is, that the source code is typically mapped to `/source` and the build is expected to land in `/build` if it shall be accessible outside the container.

