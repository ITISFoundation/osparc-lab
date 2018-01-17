# add all tests of the demos here

ADD_TEST( NAME CppCiTest
    WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
    COMMAND python3 ${CMAKE_CURRENT_SOURCE_DIR}/cpp-ci/setup.py --travis_build_and_test
)
