import sys
import os
from optparse import OptionParser
import docker
import json

dir_path = os.path.dirname(os.path.realpath(__file__))
path, folder_name = os.path.split(dir_path)


def main(argv):
    parser = OptionParser()

    parser.add_option(
        "-i", "--imagename", dest="imagename", help="name for the image", default=folder_name)

    parser.add_option(
        "-v", "--version", dest="version", help="version for the image", default='')

    parser.add_option(
        "-r", "--registry", dest="registry", help="docker registry to use", default='')

    parser.add_option(
        "-n", "--namespace", dest="namespace",
        help="which namespace to use", default="")

    (options, args) = parser.parse_args(sys.argv)

    registry = ""
    namespace = ""
    image_name = ""
    version = ""

    _settings = {}
    _input = {}
    _output = {}

    labels = {}
    for f in ["settings", "input", "output"]:
        json_file = ''.join((f, ".json"))
        with open(json_file) as json_data:
            label_dict = json.load(json_data)
            labels["io.simcore." + f] = str(label_dict[f])

    tag = ''
    if options.registry:
        tag = options.registry + "/"
    if options.namespace:
        tag = tag + options.namespace + "/"
    tag = tag + options.imagename
    if options.version:
        tag = tag + ":" + options.version
    print tag
    client = docker.from_env(version='auto')
    client.images.build(path='.', tag=tag, labels=labels)

if __name__ == "__main__":
    main(sys.argv[1:])
