#!/usr/bin/python3
'''Checking the folder structure of the projects within <root>/demos

'''

import os
import os.path
import sys
import logging

logging.getLogger().setLevel(logging.INFO)


class AllFine(object):

    '''This class gathers the outcome state (okay or failure)'''

    def __init__(self):
        self.__ok = True

    def error(self, msg):
        '''
        Helper function to display an error message as well as setting
        the outcome to failure
        '''
        logging.error(msg)
        self.__ok = False

    @staticmethod
    def warning(msg):
        '''Helper function to display a warning message, keep outcome as is'''
        logging.warning(msg)

    def okay(self):
        '''Query the overall outcome sucess/failure and some prints'''
        if self.__ok:
            logging.info('All tests passed')
        else:
            logging.error('Some tests failed')
        return self.__ok


def check_makefile(folder, all_fine):
    '''Checking the structure of the Makefile's involved'''
    logging.info('Checking makefile')

    # not sure, if these tests make sense: feel free to change/extend
    has_demo = False
    has_start = False
    has_stop = False
    with open(os.path.join(folder, 'Makefile')) as my_file:
        for line in my_file:
            if line.startswith('demo:'):
                has_demo = True
            if line.startswith('start:'):
                has_start = True
            if line.startswith('stop:'):
                has_stop = True

    if not has_demo:
        all_fine.warning('No "demo" target')
    if not has_start:
        all_fine.warning('No "start" target')
    if not has_stop:
        all_fine.warning('No "stop" target')


def test_file_structure():
    '''
    Looping through the "demos" folder's subfolder and check some
    assumptions
    '''

    logging.info('Testing file structure in demos folder')

    all_fine = AllFine()

    root_folder = 'demos'
    for sub_folder in os.listdir('demos'):
        folder = os.path.join(root_folder, sub_folder)
        if os.path.isdir(folder):
            logging.info('Testing folder: %s', folder)

            # Makefile checks
            if not os.path.exists(os.path.join(folder, 'Makefile')):
                if not os.path.exists(os.path.join(folder, 'CMakeLists.txt')):
                    all_fine.error(
                        'File "Makefile" does not exist (case sensitive!)')
            else:
                check_makefile(folder, all_fine)

            # Readme check
            if not os.path.exists(os.path.join(folder, 'README.md')):
                all_fine.error(
                    'File "README.md" does not exist (case sensitive!)')
            else:
                with open(os.path.join(folder, 'README.md')) as my_file:
                    content = my_file.read().strip()
                    if not content:
                        all_fine.error('Readme file seems empty')

    return all_fine.okay()


if __name__ == '__main__':
    if test_file_structure():
        sys.exit(0)
    else:
        sys.exit(1)
