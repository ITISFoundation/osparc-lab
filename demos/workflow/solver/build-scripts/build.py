import sys, os
from optparse import OptionParser
import docker
import json

dir_path = os.path.dirname(os.path.realpath(__file__))
parent_path = os.path.abspath(os.path.join(dir_path, os.pardir))
path, folder_name = os.path.split(parent_path)

def main(argv):
    parser = OptionParser()

    parser.add_option(
        "-i", "--imagename", dest="imagename", help="name for the image", default=folder_name)

    parser.add_option(
        "-v", "--version", dest="version", help="version for the image", default='')

    parser.add_option(
        "-r", "--registry", dest="registry", help="docker registry to use", default='')

    parser.add_option(
        "-n", "--namespace", dest="namespace", help="which namespace to use", default="")

    parser.add_option(
        "-p", "--publish", action="store_true", dest="publish", help="publish in registry")


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
        json_file = os.path.join(dir_path,''.join((f,".json")))
        with open(json_file) as json_data:
            label_dict = json.load(json_data)
            labels["io.simcore."+f] = str(label_dict[f])
   
    tag = ''
    if options.registry:
        tag = options.registry + "/"
    if options.namespace:
        tag = tag + options.namespace + "/"
    tag = tag + options.imagename
    if options.version:
        tag = tag + ":" + options.version
    client = docker.from_env(version='auto')

    client.images.build(path=parent_path, tag=tag, labels=labels)
    if options.publish:
        client.login(registry=options.registry, username="z43", password="z43")
    for line in client.api.push(tag, stream=True):
        print(line)
	

if __name__ == "__main__":
    main(sys.argv[1:])

