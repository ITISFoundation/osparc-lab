ADD_TEST( NAME DemosFileStructure
	COMMAND python3 ./tools/TestDemosFileStructure.py
	WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/..
)


ADD_TEST( NAME PythonOveralPep8
	COMMAND ./tools/check_pep8.sh ./tools  # for now no demos
	WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/..
)

