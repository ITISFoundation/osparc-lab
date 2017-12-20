import sys
import os
import subprocess
import logging
import argparse
import shutil

logging.getLogger().setLevel(logging.INFO)

class CommandLine:
    '''Wrapper around the command line options, cmake is executed in current directory'''
    def __init__(self):
        parser = argparse.ArgumentParser(description='Used within build container')
        parser.add_argument('--configure_gcc', default=False, action='store_true',
                            help='Configure build with gcc')
        parser.add_argument('--configure_clang', default=False, action='store_true',
                            help='Configure build with clang')
        parser.add_argument('--build', default=False, action='store_true',
                            help='Build configured solution')
        parser.add_argument('--test', default=False, action='store_true',
                            help='Test built solution')
        parser.add_argument('--all_gcc', default=False, action='store_true',
                            help='Configure, build and test with gcc')
        parser.add_argument('--all_clang', default=False, action='store_true',
                            help='Configure, build and test with clang')
        parser.add_argument('--all', default=False, action='store_true',
                            help='Configure, build and test with gcc and clang')

        self.__args = parser.parse_args()

    def configure(self, compiler_str):
        '''Configure cmake with the passed compile'''
        # first kill any existing configuration
        cache_file = 'CMakeCache.txt'
        if os.path.exists(cache_file):
            logging.info('Deleting configured old files ...')
            for item in os.listdir():
                if os.path.isdir(item):
                    shutil.rmtree(item)
                if os.path.isfile(item):
                    os.remove(item)

        cc = '/usr/bin/' + compiler_str
        cxx = '/usr/bin/' + compiler_str + '++'
        if compiler_str=='gcc':
            cxx = '/usr/bin/g++'
        subprocess.check_call(('cmake ' + os.path.dirname(sys.argv[0])).split(),
                            env=dict(os.environ, CC=cc, CXX=cxx))

    def build(self):
        '''Build the configured project'''
        subprocess.check_call('make -j2'.split())
 
    def test(self):
        '''Test the configured project'''
        subprocess.check_call('ctest -V'.split())
        

    def execute(self):
        '''Main logic to call functions'''

        if self.__args.configure_clang or self.__args.all_clang or self.__args.all:
            logging.info('Configuring for clang')
            self.configure('clang')
        if self.__args.build or self.__args.all_clang or self.__args.all:
            logging.info('Build with clang')
            self.build()
        if self.__args.test or self.__args.all_clang or self.__args.all:
            logging.info('Test clang build')
            self.test()

        if self.__args.configure_gcc or self.__args.all_gcc or self.__args.all:
            logging.info('Configuring for gcc')
            self.configure('gcc')
        if self.__args.build or self.__args.all_gcc or self.__args.all:
            logging.info('Build with gcc')
            self.build()
        if self.__args.test or self.__args.all_gcc or self.__args.all:
            logging.info('Test gcc build')
            self.test()


def main():
    '''Main function supporting all commands'''
    exit_code = 123456
    try:
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
    finally:
        # change owner ship
        if os.path.exists('/build'):
            logging.info('Fixing ownership in /build')
            owner_ids = subprocess.check_output( 'stat -c "%u:%g" /build'.split()).decode().replace('"','')
            subprocess.call(('chown -R ' + owner_ids + ' /build').split())
    return exit_code

if __name__=='__main__':
    sys.exit(main())
