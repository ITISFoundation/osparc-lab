ADD_TEST( NAME DemosFileStructure
	COMMAND python3 ./tools/ci-checks/test_demos_file_structure.py
	WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)


ADD_TEST( NAME PythonOveralPep8Tools
	COMMAND ./tools/ci-checks/CheckPep8.sh ./tools  # for now no demos
	WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)

ADD_TEST( NAME PythonOveralPep8Templates
	COMMAND ./tools/ci-checks/CheckPep8.sh ./templates  # for now no demos
	WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)