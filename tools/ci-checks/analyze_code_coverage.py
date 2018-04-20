'''
Analyze Python Code via clang's code coverage
'''

import subprocess
import os
import logging
import sys

logging.getLogger().setLevel(logging.DEBUG)


def test_executable(exe_name):
    '''Testing an executables run and its test coverage'''
    logging.info('Testing executable name: %s', exe_name)

    raw_prof_file_name = exe_name + '.profraw'
    subprocess.call('./' + exe_name, env=dict(
        os.environ, LLVM_PROFILE_FILE=raw_prof_file_name))

    merged_prof_file_name = exe_name + '.profdata'
    subprocess.call(('/usr/bin/llvm-profdata-3.8 merge ' +
                     raw_prof_file_name + ' -o ' + merged_prof_file_name).split())

    report = subprocess.check_output(
        ('llvm-cov report ./' + exe_name + ' -instr-profile=' + merged_prof_file_name).split()).decode()

    logging.info('Full test coverage report: \n\n \
                 %s \n\nPlausibility checks follow: \n', report)

    exit_code = 0
    within_per_file = False
    for line in report.split('\n'):
        if line.startswith('-' * 30):
            within_per_file = not within_per_file
        elif within_per_file:
            # now we could analyze the output of the code coverage (just grab
            # output)
            split = line.split()
            file_name = split[0]
            total_regions = float(split[1])
            missed_regions = float(split[2])

            if missed_regions / total_regions > 0.1:
                exit_code = 1
                logging.error('Total code coverage is weak in ' +
                              file_name + '! ' + ', '.join(line.split()))

    return exit_code


if __name__ == '__main__':
    sys.exit(test_executable(sys.argv[1]))
