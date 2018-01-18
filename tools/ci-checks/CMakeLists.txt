ADD_TEST( NAME DemosFileStructure
	COMMAND python3 ./tools/ci-checks/TestDemosFileStructure.py
	WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)


ADD_TEST( NAME PythonOveralPep8
	COMMAND ./tools/ci-checks/CheckPep8.sh ./tools  # for now no demos
	WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)

