import sys
import os
import subprocess
import logging
import argparse
import shutil

logging.getLogger().setLevel(logging.INFO)

def build_image_name():
    '''the docker image name for the building container'''
    return "itisfoundation/build_cpp_env"
def deploy_image_name():
    '''the docker image name for the building container'''
    return "itisfoundation/demo_cpp_ci"
def image_name_option():
    '''the magic command line option to separate in a docker run the outside and inside commands'''
    return 'IMAGE_NAME'
def this_script_folder():
    '''this script folder extraction'''
    return os.path.abspath(os.path.dirname(sys.argv[0]))
def travis_build_dir():
    '''the build folder where travis builds in (or all setup.py --all builds)'''
    build_dir = '/tmp/build'
    if not os.path.exists(build_dir):
        os.makedirs(build_dir)
    return build_dir

class CommandLine:
    '''Wrapper around the command line options, cmake is executed in current directory'''
    def __init__(self):
        magic_docker_cmd_option = '. Options after the option ' + image_name_option() + ' are passed after the image name.'
        parser = argparse.ArgumentParser(description='Used outside build container')
        parser.add_argument('--create_build_image', default=False, action='store_true',
                            help='Build docker image for building the source')
        parser.add_argument('--create_deploy_image', default=False, action='store_true',
                            help='Build docker image for deployment')
        parser.add_argument('--test_deploy_image', default=False, action='store_true',
                            help='Test docker image for deployment')
        parser.add_argument('--run_build_image', default=False, action='store_true',
                            help='Additional options passed to the run docker command'+magic_docker_cmd_option)
        parser.add_argument('--run_deploy_image', default=False, action='store_true',
                            help='Additional options passed to the run docker command'+magic_docker_cmd_option)
        parser.add_argument('--build_and_deploy', default=False, action='store_true',
                            help='Do everything from building, deploying and testing')
        parser.add_argument('--travis_build_and_test', default=False, action='store_true',
                            help='Do everything from building, deploying and testing')

        self.__args = parser.parse_args()


    def execute(self):
        '''Main logic to call functions'''

        do_all = self.__args.build_and_deploy or self.__args.travis_build_and_test
        build_dir = os.getcwd()
        if self.__args.travis_build_and_test:
            # special case for travis
            build_dir = travis_build_dir()

        if self.__args.create_build_image or do_all:
            logging.info('Create build image')
            docker_file_dir = os.path.join(this_script_folder(), '..', '..', 'templates', 'build-docker-files')
            docker_file = os.path.join(docker_file_dir, 'build-cpp-env.dockerfile')
            subprocess.check_call(('docker build -f ' + docker_file + ' -t ' + build_image_name() + ' ' + docker_file_dir).split())
        if do_all:
            logging.info('Running deploy docker image')
            run_build_image( [], ('python3 /source/demos/cpp-ci/build.py --all').split(), build_dir)
        if self.__args.create_deploy_image or do_all:
            logging.info('Create deploy image')
            docker_file = os.path.join(this_script_folder(), 'deploy.dockerfile')
            subprocess.check_call(('docker build -t ' + deploy_image_name() + ' ' + build_dir + '/_bin').split())
        if self.__args.test_deploy_image or do_all:
            logging.info('Test deploy image')
            run_deploy_image([], [])

def split_docker_run_and_within_container_cmd_options(options):
    docker_run_options = None
    within_container_cmd_options = None
    if image_name_option() in options:
        i = options.index(image_name_option())
        docker_run_options = options[:i]
        within_container_cmd_options = options[i+1:]
    else:
        docker_run_options = options
        within_container_cmd_options = []
    return ( docker_run_options, within_container_cmd_options )

def run_image(image_name, docker_run_options, within_container_cmd):
    '''Run a docker image'''

    cmd = 'docker run -it --rm '.split() + docker_run_options + [image_name] + within_container_cmd

    logging.info('Docker run command: ' + ' '.join(cmd))
    subprocess.check_call(cmd)

def run_build_image(docker_run_options, within_container_cmd, build_dir):
    '''Run the build docker image'''
    run_options = docker_run_options
    run_options += ('-v ' + build_dir + ':/build -v ' + this_script_folder() + '/../..:/source').split()

    run_image(build_image_name(), run_options, within_container_cmd)

def run_deploy_image(docker_run_options, within_container_cmd):
    '''Run the build docker image'''
    run_image(deploy_image_name(), docker_run_options, within_container_cmd)

def main():
    '''Main function supporting all commands'''
    exit_code = 123456
    try:
        if len(sys.argv)>1 and sys.argv[1] == '--run_build_image':
            docker_run_options, within_container_cmd = split_docker_run_and_within_container_cmd_options(sys.argv[2:])
            run_build_image(docker_run_options, within_container_cmd, os.getcwd())
        elif len(sys.argv)>1 and sys.argv[1] == '--run_deploy_image':
            docker_run_options, within_container_cmd = split_docker_run_and_within_container_cmd_options(sys.argv[2:])
            run_deploy_image(docker_run_options, within_container_cmd)
        else:
            commands = CommandLine()
            commands.execute()
        exit_code = 0
    except subprocess.CalledProcessError as e:
        logging.error('Command failed: ' + str(e))
        logging.error(e.output)
        exit_code = e.returncode
    except Exception as e:
        logging.error('Error occured: ' + str(e))
        exit_code = 1
    return exit_code

if __name__=='__main__':
    sys.exit(main())
