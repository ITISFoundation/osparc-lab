#
# Define how to use third party, i.e.
# - include directory
# - library
# - preprocessor definitions needed by package
#

IF(MSVC)
	# WARNING: linux != to windows versions!
	SET(WT_VERSION 4.0.1)
	SET(WtRootDir $(SolutionDir)ThirdParties\libs\Wt-4.0.1-rc1-msvs2017-Windows-x64-SDK)
	# Beware, $(ConfigurationName) is not a cmake variable: it
	# will only be expanded by VS during the build/link step.
	# Same for $(PlatformName)
	SET(WT_INCLUDE_DIR ${WtRootDir}/include)
	SET(WT_LIBRARY_DIR ${WtRootDir}/lib/x64/$(ConfigurationName))
ENDIF(MSVC)

IF(UNIX)
	SET(WT_VERSION ${WT_VERSION})
	SET(WT_INCLUDE_DIR /usr/local/include)
	SET(WT_LIBRARY_DIR /usr/local/lib)
ENDIF(UNIX)

MACRO(USE_WT_HEADERS)
	INCLUDE_DIRECTORIES(${WT_INCLUDE_DIR})
	LINK_DIRECTORIES(${WT_LIBRARY_DIR})
	ADD_DEFINITIONS(${WT_DEFINITIONS})
 
	SET(WT_LIBRARIES
		wt
		wtdbo
		wtdbosqlite3
		wthttp
		wttest
	)
ENDMACRO()

MACRO(USE_WT)
	USE_WT_HEADERS()

	LIST( APPEND MY_EXTERNAL_LINK_LIBRARIES ${WT_LIBRARIES} )
	#REMEMBER_TO_CALL_THIS_INSTALL_MACRO( INSTALL_RUNTIME_LIBRARIES_WT )
ENDMACRO()

MACRO(INSTALL_RUNTIME_LIBRARIES_WT)
	MESSAGE( STATUS "--> ThirdPartyWT: installing WT library ..." )
	IF(CMAKE_COMPILER_IS_GNUCXX)
		IF(APPLE)
			FILE(COPY ${WT_LIBRARY_DIR}/
				DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}
				FILES_MATCHING PATTERN "*.dylib")
		ELSE()
			FILE(COPY ${WT_LIBRARY_DIR}/
				DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}
				FILES_MATCHING PATTERN "*${WT_VERSION}.so*" )
		ENDIF()
	ELSEIF(MSVC)
		FOREACH(BUILD_TYPE ${CMAKE_CONFIGURATION_TYPES})
			FILE(COPY ${WT_LIBRARY_DIR}/../${BUILD_TYPE}/
				DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${BUILD_TYPE}
				FILES_MATCHING PATTERN "*.dll" PATTERN "*.pdb" PATTERN ".svn" EXCLUDE )
		ENDFOREACH()
	ENDIF()
ENDMACRO()
