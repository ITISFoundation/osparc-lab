#!/usr/bin/env python
"""
 Cmder emulator @windows has troubles to run this script.
 We are trying then docker's python API as cross-platform
 scripting language

 See https://docker-py.readthedocs.io/en/stable/
"""
import sys
import docker

IMAGE_NAME="itis/nodejs"

if __name__ == "__main__":
    client = docker.from_env()
    client.containers.run(IMAGE_NAME,
        environment=["NODE_ENV=production", ],
        user="node",
        name="mynodejs-app",
        working_dir= "/usr/src/app",
        ports={49160:8080},
        mem_limit="300M",
        memswap_limit="1G",
        detach=True,
        runtime=" ".join(sys.argv[1:]),
        )
