#
# Adding compile flags to the C++ and C compiler
# 
MACRO(ADD_CXX_COMPILER_FLAGS)
	SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${ARGN}")  
ENDMACRO()

MACRO(ADD_C_COMPILER_FLAGS)
	SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${ARGN}")  
ENDMACRO()

MACRO(ADD_C_AND_CXX_COMPILER_FLAGS)
	ADD_C_COMPILER_FLAGS(${ARGN})
	ADD_CXX_COMPILER_FLAGS(${ARGN})
ENDMACRO()

#
# Adding linker flags to the C++ and C linker
# 
MACRO(ADD_LINKER_FLAGS)
	SET(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} ${ARGN}")
	SET(CMAKE_MODULE_LINKER_FLAGS "${CMAKE_MODULE_LINKER_FLAGS} ${ARGN}") 
	SET(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} ${ARGN}") 
	SET(CMAKE_STATIC_LINKER_FLAGS "${CMAKE_STATIC_LINKER_FLAGS} ${ARGN}") 
ENDMACRO()

#
# Add compiler flags used by all modules
#
MACRO(SET_SUPERMASH_SHARED_MSVC_COMPILER_AND_LINKER_FLAGS)
	IF( MSVC )
		ADD_DEFINITIONS(-D_CRT_SECURE_NO_WARNINGS)
		ADD_DEFINITIONS(-D_SCL_SECURE_NO_WARNINGS)
		SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /fp:precise" )

		# add debug information in release configuration and other optimization flags
		SET(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} /Zi /Ox /Oi /Ot /Oy /GL /GS- /Gy /D _SECURE_SCL=0" )
		SET(CMAKE_C_FLAGS_RELEASE "${CMAKE_C_FLAGS_RELEASE} /Zi")
		SET(CMAKE_EXE_LINKER_FLAGS_RELEASE "${CMAKE_EXE_LINKER_FLAGS_RELEASE} /debug /LTCG")
		SET(CMAKE_MODULE_LINKER_FLAGS_RELEASE "${CMAKE_MODULE_LINKER_FLAGS_RELEASE} /debug /LTCG")
		SET(CMAKE_SHARED_LINKER_FLAGS_RELEASE "${CMAKE_SHARED_LINKER_FLAGS_RELEASE} /debug /LTCG")

		# Enable fastlink option for debug build
		SET(CMAKE_SHARED_LINKER_FLAGS_DEBUG "${CMAKE_SHARED_LINKER_FLAGS_DEBUG} /debug:fastlink")
		SET(CMAKE_MODULE_LINKER_FLAGS_DEBUG "${CMAKE_MODULE_LINKER_FLAGS_DEBUG} /debug:fastlink")
		SET(CMAKE_EXE_LINKER_FLAGS_DEBUG "${CMAKE_EXE_LINKER_FLAGS_DEBUG} /debug:fastlink")
	ENDIF()
ENDMACRO()

#
# use OpenMP features
#
MACRO(USE_OPENMP)
	IF (${CMAKE_C_COMPILER} MATCHES "icc.*$" OR ISOLVE_USE_INTEL_COMPILER)
		SET(USING_INTEL ON)
	ELSE()
		SET(USING_INTEL OFF)
	ENDIF()

	IF(WIN32)
		IF(USING_INTEL)
			# Intel  
			ADD_COMPILE_OPTIONS( "-Qopenmp" )
		ELSEIF(MSVC)
			ADD_COMPILE_OPTIONS( "/openmp" )
		ENDIF()
	ENDIF()

	IF(UNIX)
		# Gnu  
		IF(USING_INTEL)
			# Intel  
			ADD_COMPILE_OPTIONS( "-openmp" )
		ELSE(CMAKE_COMPILER_IS_GNUCXX)
			ADD_COMPILE_OPTIONS( "-fopenmp" )
		ENDIF()
	ENDIF()
ENDMACRO()

#
# Add the compile flag, that warnings are treated as errors
# 
MACRO(TREAT_WARNINGS_AS_ERRORS)
	IF (MSVC)
		ADD_C_AND_CXX_COMPILER_FLAGS("/WX")
	ELSEIF(UNIX)
		IF(CENTOS6)
#			ADD_C_AND_CXX_COMPILER_FLAGS("-Werror")
		ELSEIF(CMAKE_COMPILER_IS_GNUCXX)
			ADD_C_AND_CXX_COMPILER_FLAGS("-Werror")
		ELSEIF(CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
#			ADD_C_AND_CXX_COMPILER_FLAGS("-Werror")
		ENDIF()
	ENDIF()
ENDMACRO()

MACRO(MSVC_DISABLE_WARNING_CODES)
	IF (MSVC AND ISOLVE_USE_INTEL_COMPILER)
		FOREACH(warning_code ${ARGN})
			ADD_C_AND_CXX_COMPILER_FLAGS("/Qdiag-disable:${warning_code}")
		ENDFOREACH()
	ENDIF()
ENDMACRO()

MACRO(MSVC_DISABLE_LINKER_WARNING_CODES)
	IF (MSVC AND ISOLVE_USE_INTEL_COMPILER)
		FOREACH(linker_warning_code ${ARGN})
			ADD_LINKER_FLAGS("/ignore:${linker_warning_code}")
		ENDFOREACH()
	ENDIF()
ENDMACRO()

MACRO(MSVC_IGNORE_SPECIFIC_DEFAULT_LIBRARIES_DEBUG)
	IF (MSVC)
		FOREACH(flag ${ARGN})
			SET( CMAKE_SHARED_LINKER_FLAGS_DEBUG "${CMAKE_SHARED_LINKER_FLAGS_DEBUG} /NODEFAULTLIB:\"${flag}\"" )
			SET( CMAKE_EXE_LINKER_FLAGS_DEBUG "${CMAKE_EXE_LINKER_FLAGS_DEBUG} /NODEFAULTLIB:\"${flag}\"" )
		ENDFOREACH()
	ENDIF()
ENDMACRO()

MACRO(MSVC_IGNORE_SPECIFIC_DEFAULT_LIBRARIES_RELEASE)
	IF (MSVC)
		FOREACH(flag ${ARGN})
			SET( CMAKE_SHARED_LINKER_FLAGS_RELEASE "${CMAKE_SHARED_LINKER_FLAGS_RELEASE} /NODEFAULTLIB:\"${flag}\"" )
			SET( CMAKE_EXE_LINKER_FLAGS_RELEASE "${CMAKE_EXE_LINKER_FLAGS_RELEASE} /NODEFAULTLIB:\"${flag}\"" )
		ENDFOREACH()
	ENDIF()

ENDMACRO()

MACRO(DISABLE_AUTOMATIC_LINKAGE_OF_SUPERMASH)
	ADD_DEFINITIONS( /DSUPERMASH_MANUALLY_LINKED )
ENDMACRO()

#
# Visual studio specific: add a project (target_name) to the filter group called filter_name
# 
MACRO(MSVC_PROJECT_GROUP target_name filter_name)
	IF(MSVC)
		SET_PROPERTY(TARGET ${target_name} PROPERTY FOLDER ${filter_name})
	ENDIF()
ENDMACRO()
#
# Visual studio specific: add files of a project to a specific filter filter_name
# 
MACRO(MSVC_SOURCE_GROUP filter_name)
	IF(MSVC)
		SOURCE_GROUP( ${filter_name} FILES ${ARGN} )
	ENDIF()
ENDMACRO()
#
# Visual studio specific: add files of a project to a specific filter filter_name
# 
MACRO(MSVC_ONLY_EDIT_PROJECT project_name)
	IF(MSVC)
		ADD_CUSTOM_TARGET( ${project_name} SOURCES ${ARGN} )
	ENDIF()
ENDMACRO()
#
# Visual studio specific: define _CRT_SECURE_NO_WARNINGS and _SCL_SECURE_NO_WARNINGS
# 
MACRO(MSVC_SET_CRT_AND_SCL_SECURE_NO_WARNINGS target_name)
	IF(MSVC)
		SET_TARGET_PROPERTIES(${target_name} PROPERTIES COMPILE_FLAGS " /D _CRT_SECURE_NO_WARNINGS /D _SCL_SECURE_NO_WARNINGS")
	ENDIF()
ENDMACRO()

MACRO(USE_CXX11_FEATURES)
	IF(UNIX)
		IF (CMAKE_COMPILER_IS_GNUCXX)
			ADD_CXX_COMPILER_FLAGS( -std=gnu++0x )
		ELSEIF(CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
			ADD_CXX_COMPILER_FLAGS( -std=gnu++0x )
			#ADD_CXX_COMPILER_FLAGS( -fsanitize=address )
			#ADD_CXX_COMPILER_FLAGS( -fno-omit-frame-pointer )
			#ADD_CXX_COMPILER_FLAGS( -fno-optimize-sibling-calls )
		ELSEIF(CMAKE_CXX_COMPILER_ID STREQUAL "Intel")
			ADD_CXX_COMPILER_FLAGS( -std=c++0x )
		ENDIF()
	ENDIF()
ENDMACRO()

#
# Add MFC support to project
#
MACRO(ADD_MFC_SUPPORT)
	IF(MSVC)
		# CMAKE_MFC_FLAG = 0 -> no support, 1 -> static linkage, 2 -> dynamic linkage
		SET(CMAKE_MFC_FLAG 2)
		ADD_DEFINITIONS("/D _AFXDLL")
	ENDIF(MSVC)
ENDMACRO()

#
# Add MFC support to project
#
MACRO(ADD_XCORE_PLUGIN target_name)
	IF(MSVC)
		SET_TARGET_PROPERTIES(${target_name} PROPERTIES SUFFIX .xdll )
	ENDIF(MSVC)
ENDMACRO()


#
# Add unicode support to project
#
MACRO(ADD_UNICODE_SUPPORT)
	IF(MSVC)
		ADD_DEFINITIONS("/D _UNICODE /D UNICODE")
	ENDIF(MSVC)
ENDMACRO()

#
# Create the option and mark it as 'advanced' section
# 
MACRO(ADVANCED_OPTION option_name)
	OPTION(${option_name} ${ARGN})
	MARK_AS_ADVANCED(${option_name})
ENDMACRO()


#
# Some plausibility checks for external variables
#
MACRO(REQUIRE_THIS_EXTERNALS_VARIABLE variable_name)
	IF ( NOT DEFINED ${variable_name} )
		MESSAGE( FATAL_ERROR "CMake variable ${variable_name} is not defined. Was it not added to the external's json file or is there a spelling error?" )
	ENDIF()
	IF ( NOT EXISTS ${${variable_name}} )
		MESSAGE( "CMake variable ${variable_name} points into void (${${variable_name}}). Thus you run into troubles when compiling or linking. However, the solution file will be correctly generated." )
	ENDIF()
ENDMACRO()

#
# Some plausibility checks for external variables
#
MACRO(REQUIRE_VARIABLE_DEFINED variable_name)
	IF ( NOT DEFINED ${variable_name} )
		MESSAGE( FATAL_ERROR "CMake variable ${variable_name} is not defined but is required to be defined." )
	ENDIF()
ENDMACRO()


MACRO(ADD_OPTIONS_FOR_START_APPLICATIONS)
	IF (MSVC)
		SET(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} /MANIFESTDEPENDENCY:\"type='win32' name='Microsoft.VC90.CRT' version='9.0.21022.8' processorArchitecture='amd64' publicKeyToken= '1fc8b3b9a1e18e3b'\"")
	ENDIF()
ENDMACRO()

MACRO(ADD_EXE_MANIFEST target_name manifest_file)
	# Adds manifest ${manifest_file} to executable ${target_name}
	# https://gist.github.com/bjornblissing/6fc452fe7ec1fdfe3419
	# http://stackoverflow.com/questions/6335352/how-can-i-embed-a-specific-manifest-file-in-a-windows-dll-with-a-cmake-build
	# For DLLs, #1 should be changed to #2
	IF (MSVC)
		ADD_CUSTOM_COMMAND(
			TARGET ${target_name}
			POST_BUILD
			COMMAND "mt.exe" -manifest \"${manifest_file}\" -inputresource:\"$<TARGET_FILE:${target_name}>\"\;\#1 -outputresource:\"$<TARGET_FILE:${target_name}>\"\;\#1
			COMMENT "Adding manifest ${manifest_file}..." 
		)
	ENDIF(MSVC)
ENDMACRO()

MACRO(DISABLE_DPI_AWARE_MANIFEST target_name)
	IF( MSVC AND NOT ISOLVE_XCORE )
		#MESSAGE( "Disable DPI aware property in the manifest file" )
		SET( extracted_manifest_file_name "${CMAKE_CURRENT_BINARY_DIR}/${target_name}.extracted.manifest" )
		SET( modified_manifest_file_name "${CMAKE_CURRENT_BINARY_DIR}/${target_name}.modified.manifest" )
		SET( target_exe_name $<TARGET_FILE:${target_name}> )

		SET( replace_python_file_name "${CMAKE_CURRENT_BINARY_DIR}/replace_dpi_aware_${target_name}.py" )
		SET( replace_script_content "with open('${extracted_manifest_file_name}', 'r') as f_in:\n\twith open('${modified_manifest_file_name}', 'w') as f_out:\n\t\tf_out.write( f_in.read().replace('>true</dpiAware>', '>false</dpiAware>'))\n" )
		FILE( WRITE "${replace_python_file_name}" ${replace_script_content} )
		FILE(TO_NATIVE_PATH "${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/$<CONFIG>/Python27/python.exe" dos_python_exe)

		ADD_CUSTOM_COMMAND(
			TARGET ${target_name}
			POST_BUILD
			COMMAND "mt.exe" -inputresource:\"${target_exe_name}\"\;\#1 -out:\"${extracted_manifest_file_name}\"
			COMMAND "${dos_python_exe}" "${replace_python_file_name}"
			COMMAND "mt.exe" -manifest ${modified_manifest_file_name} -outputresource:\"${target_exe_name}\"\;1
			COMMENT "Disable display aware manifest setting ..." 
		)
	ENDIF()
ENDMACRO()

#
# Macro to add the source files to the target and link the needed libraries
# Uses variables: MY_TARGET_NAME, SOURCE_FILES, HEADER_FILES, MY_INTERNAL_LINK_LIBRARIES, MY_EXTERNAL_LINK_LIBRARIES
#
MACRO( SETUP_STATIC_LIBRARY )
	MESSAGE( STATUS "  -> Adding ${MY_TARGET_NAME} as static library" )
	ADD_LIBRARY( ${MY_TARGET_NAME} STATIC ${SOURCE_FILES} ${HEADER_FILES} ${ADDITIONAL_FILES} )
	TARGET_LINK_LIBRARIES( ${MY_TARGET_NAME} LINK_PUBLIC ${MY_INTERNAL_LINK_LIBRARIES} ${MY_EXTERNAL_LINK_LIBRARIES} )
ENDMACRO()

#
# Macro to add the source files to the target and link the needed libraries
# Uses variables: MY_TARGET_NAME, SOURCE_FILES, HEADER_FILES, MY_INTERNAL_LINK_LIBRARIES, MY_EXTERNAL_LINK_LIBRARIES
#
MACRO( SETUP_SHARED_LIBRARY )
	IF (SUPERMASH_STATICALLY_LINKED)
		# in Linux we have the possibility to link everything into the executable
		SETUP_STATIC_LIBRARY()
	ELSE()
		MESSAGE( STATUS "  -> Adding ${MY_TARGET_NAME} as shared library" )
		ADD_LIBRARY( ${MY_TARGET_NAME} SHARED ${SOURCE_FILES} ${HEADER_FILES} ${ADDITIONAL_FILES} )
		TARGET_LINK_LIBRARIES( ${MY_TARGET_NAME} LINK_PRIVATE ${MY_INTERNAL_LINK_LIBRARIES} ${MY_EXTERNAL_LINK_LIBRARIES} )
	ENDIF()
ENDMACRO()


#
# Variable for the boost test command line options
#
MACRO( SET_BOOST_TEST_SUITE_OPTIONS target_name options_to_use )
	IF (MSVC)
		SET( LOG_FOLDER ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/$<$<CONFIG:debug>:Debug>$<$<CONFIG:release>:Release>/test_data )

		FOREACH(BUILD_TYPE ${CMAKE_CONFIGURATION_TYPES})
			# make sure, that the log folder exists
			FILE(MAKE_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${BUILD_TYPE}/test_data )
		ENDFOREACH()
	ELSE()
		SET( LOG_FOLDER ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/test_data )

		# make sure, that the log folder exists
		FILE(MAKE_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/test_data )
	ENDIF()

	#IF (NOT SUPERMASH_PULSE_AGENT)
	#	SET( ${options_to_use} --log_level=test_suite --output_format=HRF --log_sink=${LOG_FOLDER}/test_log_${target_name}.log --report_sink=${LOG_FOLDER}/test_summary_${target_name}.log --report_level=detailed )
	#ELSE()
		SET( ${options_to_use} --log_level=test_suite --output_format=XML --log_sink=${LOG_FOLDER}/test_log_${target_name}.xml --report_sink=${LOG_FOLDER}/test_summary_${target_name}.xml )
	#ENDIF()
ENDMACRO()

#
# Macro to add the source files to the target and link the needed libraries
# Uses variables: MY_TARGET_NAME, SOURCE_FILES, HEADER_FILES, MY_INTERNAL_LINK_LIBRARIES, MY_EXTERNAL_LINK_LIBRARIES
#
MACRO( SETUP_TEST_SUITE )
	MESSAGE( STATUS "  -> Adding ${MY_TARGET_NAME} as test suite" )
	IF (SUPERMASH_STATICALLY_LINKED)
		MESSAGE( STATUS "TestSuite: Adding ctest executable based test suite ${MY_TARGET_NAME}.")
		ADD_EXECUTABLE( ${MY_TARGET_NAME} ${SOURCE_FILES} ${HEADER_FILES} ${ADDITIONAL_FILES} )
		TARGET_LINK_LIBRARIES( ${MY_TARGET_NAME} LINK_PRIVATE ${MY_INTERNAL_LINK_LIBRARIES} ${MY_EXTERNAL_LINK_LIBRARIES} )
		SET_BOOST_TEST_SUITE_OPTIONS( ${MY_TARGET_NAME} BOOST_TEST_SUITE_START_OPTIONS )
		ADD_TEST( NAME ${MY_TARGET_NAME} COMMAND ./${MY_TARGET_NAME} ${BOOST_TEST_SUITE_START_OPTIONS} WORKING_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY} )
	ELSE()
		#MESSAGE( STATUS "TestSuite: Adding ConsoleTestRunner test suite ${MY_TARGET_NAME}.")
		ADD_DEFINITIONS( /DBOOST_TEST_NO_MAIN ) # we do not need a main test function (handled in ConsoleTestRunner)
		ADD_LIBRARY( ${MY_TARGET_NAME} SHARED ${SOURCE_FILES} ${HEADER_FILES} ${ADDITIONAL_FILES} )
		TARGET_LINK_LIBRARIES( ${MY_TARGET_NAME} LINK_PRIVATE ${MY_INTERNAL_LINK_LIBRARIES} ${MY_EXTERNAL_LINK_LIBRARIES} )
	ENDIF()
ENDMACRO()

#
# Macro to add the source files to the target and link the needed libraries
# Uses variables: MY_TARGET_NAME, MODULE_NAME, SOURCE_FILES, HEADER_FILES, MY_INTERNAL_LINK_LIBRARIES, MY_EXTERNAL_LINK_LIBRARIES
#
MACRO( SETUP_PYD_LIBRARY )
	MESSAGE( STATUS "  -> Adding ${MY_TARGET_NAME} as pyd module" )
	ADD_PYTHON_MODULE( ${MY_TARGET_NAME} ${MODULE_NAME} ${SOURCE_FILES} ${HEADER_FILES} ${ADDITIONAL_FILES} )
	TARGET_LINK_LIBRARIES( ${MY_TARGET_NAME} LINK_PRIVATE ${MY_INTERNAL_LINK_LIBRARIES} ${MY_EXTERNAL_LINK_LIBRARIES} )
ENDMACRO()

#
# Macro to add the source files to the target and link the needed libraries
# Uses variables: MY_TARGET_NAME, SOURCE_FILES, HEADER_FILES, MY_INTERNAL_LINK_LIBRARIES, MY_EXTERNAL_LINK_LIBRARIES
#
MACRO( SETUP_UI_EXECUTABLE )
	MESSAGE( STATUS "  -> Adding ${MY_TARGET_NAME} as user interface application" )
	ADD_OPTIONS_FOR_START_APPLICATIONS()
	ADD_EXECUTABLE( ${MY_TARGET_NAME} WIN32 ${SOURCE_FILES} ${HEADER_FILES} ${ADDITIONAL_FILES} )
	TARGET_LINK_LIBRARIES( ${MY_TARGET_NAME} LINK_PRIVATE ${MY_INTERNAL_LINK_LIBRARIES} ${MY_EXTERNAL_LINK_LIBRARIES} )
	DISABLE_DPI_AWARE_MANIFEST( ${MY_TARGET_NAME} )
ENDMACRO()

#
# Macro to add the source files to the target and link the needed libraries
# Uses variables: MY_TARGET_NAME, SOURCE_FILES, HEADER_FILES, MY_INTERNAL_LINK_LIBRARIES, MY_EXTERNAL_LINK_LIBRARIES
#
MACRO( SETUP_CONSOLE_EXECUTABLE )
	MESSAGE( STATUS "  -> Adding ${MY_TARGET_NAME} as console application" )
	ADD_OPTIONS_FOR_START_APPLICATIONS()
	ADD_EXECUTABLE( ${MY_TARGET_NAME} ${SOURCE_FILES} ${HEADER_FILES} ${ADDITIONAL_FILES} )
	TARGET_LINK_LIBRARIES( ${MY_TARGET_NAME} LINK_PRIVATE ${MY_INTERNAL_LINK_LIBRARIES} ${MY_EXTERNAL_LINK_LIBRARIES} )
ENDMACRO()


MACRO( INCLUDE_ALL_THESE_CMAKE_INCLUDE_FILES folder_regexp )
	FILE( GLOB all_include_files ${folder_regexp} )
	FOREACH( to_be_included_file ${all_include_files} )
		#MESSAGE( STATUS "Including ${to_be_included_file}" )
		INCLUDE( ${to_be_included_file} )
	ENDFOREACH()
ENDMACRO()

MACRO( COPY_UI_FOLDERS target_name )
    MACRO( THIS_COPY_COMMAND target_name subfolder )
        # check if folder exists
        SET( SOURCE_FOLDER_NAME ${CMAKE_CURRENT_SOURCE_DIR}/ui/${subfolder} )
        IF ( IS_DIRECTORY ${SOURCE_FOLDER_NAME} )
            #MESSAGE( STATUS "Copy ui ${target_name}/${subfolder} ..." )
			FOREACH(BUILD_TYPE ${CMAKE_CONFIGURATION_TYPES})
				FILE( COPY ${SOURCE_FOLDER_NAME}/ DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${BUILD_TYPE}/ui/${subfolder}/${target_name} PATTERN *.* )
			ENDFOREACH()
        ENDIF()       
    ENDMACRO()

    THIS_COPY_COMMAND( ${target_name} icons )
    THIS_COPY_COMMAND( ${target_name} cursors )
    THIS_COPY_COMMAND( ${target_name} bitmaps )
    THIS_COPY_COMMAND( ${target_name} fonts )
ENDMACRO()

MACRO( COPY_PY_FOLDERS target_name )
	MACRO( THIS_COPY_COMMAND subfolder subsubfolder )
		# check if folder exists
		SET( SOURCE_FOLDER_NAME ${CMAKE_CURRENT_SOURCE_DIR}/${subfolder} )
		IF ( IS_DIRECTORY ${SOURCE_FOLDER_NAME} )
			FOREACH(BUILD_TYPE ${CMAKE_CONFIGURATION_TYPES})
				FILE( COPY ${SOURCE_FOLDER_NAME}/ DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${BUILD_TYPE}/scripts/${subfolder}/${subsubfolder} PATTERN *.py )
			ENDFOREACH()
		ENDIF()
	ENDMACRO()

	THIS_COPY_COMMAND( examples ${target_name} )
	THIS_COPY_COMMAND( import ${target_name} )
	THIS_COPY_COMMAND( lib ${target_name} )
	THIS_COPY_COMMAND( testsuite test_${target_name} )
ENDMACRO()

MACRO( COPY_SHADER_FILES target_name )
	# check if folder exists
	SET( SOURCE_FOLDER_NAME ${CMAKE_CURRENT_SOURCE_DIR}/shaders )
	IF ( IS_DIRECTORY ${SOURCE_FOLDER_NAME} )
		FOREACH(BUILD_TYPE ${CMAKE_CONFIGURATION_TYPES})
			FILE( COPY ${SOURCE_FOLDER_NAME}/ DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${BUILD_TYPE}/shaders PATTERN *.* )
		ENDFOREACH()
	ENDIF()       
ENDMACRO()

MACRO( CHECK_GIT_ROOT_DIR expected_git_branch working_copy_dir)
	INCLUDE( FindGit )
	IF (GIT_FOUND)
		# Get the latest abbreviated commit hash of the working branch
		EXECUTE_PROCESS(
		  COMMAND git rev-parse --abbrev-ref HEAD
		  WORKING_DIRECTORY ${working_copy_dir}
		  OUTPUT_VARIABLE GIT_BRANCH
		  OUTPUT_STRIP_TRAILING_WHITESPACE
		)
		
		IF (NOT ${GIT_BRANCH} STREQUAL ${expected_git_branch})
			SET( MSG "This working copy's git branch '${GIT_BRANCH}' does not match the expected git branch '${expected_git_branch}'." )
			IF (SUPERMASH_PULSE_AGENT)
				MESSAGE( FATAL_ERROR ${MSG} )
			ELSE()
				MESSAGE( ${MSG} )
				MESSAGE( "If this is intended, you can skip this message by disabling the option '*_VERIFY_SUPERMASH_BRANCH'." )
				MESSAGE( "If there is no other error, then you can still continue (= valid configuration)." )
			ENDIF()
		ENDIF()
	ELSEIF()
		MESSAGE( STATUS "Cannot check that this working copy is on branch '${expected_git_branch}'" )
	ENDIF()
ENDMACRO()

MACRO( CREATE_BUILD_SCRIPTS supermash_source_dir )
	FOREACH( BUILD_TYPE ${CMAKE_CONFIGURATION_TYPES} )
		FOREACH( BUILD_COMMAND Build Rebuild Clean )
			SET( BUILD_CONFIGURATION ${BUILD_TYPE} )
			SET( SOLUTION_FILE_NAME ${CMAKE_BINARY_DIR}/${PROJECT_NAME}.sln )
			SET( FILE_ROOT_NAMING ${CMAKE_BINARY_DIR}/${BUILD_COMMAND}${BUILD_TYPE} )
			IF ( CMAKE_GENERATOR_TOOLSET )
				SET( PLATFORM_TOOLSET_NAME ${CMAKE_GENERATOR_TOOLSET} )
			ELSE()
				SET( PLATFORM_TOOLSET_NAME v140 )
			ENDIF()
			FILE( TO_NATIVE_PATH ${FILE_ROOT_NAMING}.log BUILD_LOG_FILE_NAME )
			CONFIGURE_FILE( ${supermash_source_dir}/BuildScripts/BuildConfiguration.bat.in ${FILE_ROOT_NAMING}.bat )
		ENDFOREACH()
	ENDFOREACH()
ENDMACRO()

MACRO( EXTRACT_GIT_INFO working_folder head_hash head_datetime branch_name )
	FIND_PACKAGE( Git )
	IF (GIT_FOUND)
		EXEC_PROGRAM( "${GIT_EXECUTABLE}" "${working_folder}" ARGS log -n 1 --format=\"%H\" HEAD OUTPUT_VARIABLE ${head_hash} )
		EXEC_PROGRAM( "${GIT_EXECUTABLE}" "${working_folder}" ARGS log -n 1 --format=\"%ai\" HEAD OUTPUT_VARIABLE ${head_datetime} )
		
		EXECUTE_PROCESS(
			COMMAND git rev-parse --abbrev-ref HEAD
			WORKING_DIRECTORY ${working_folder}
			OUTPUT_VARIABLE ${branch_name}
			OUTPUT_STRIP_TRAILING_WHITESPACE
		)
		
		IF ( "${${branch_name}}" STREQUAL "tmp.${${head_hash}}" )
			IF (DEFINED ENV{PULSE_GIT_BRANCH})
				STRING(REGEX REPLACE "\"" "" branch $ENV{PULSE_GIT_BRANCH})
				SET(${branch_name} ${branch})
			ENDIF()
		ENDIF()

	ENDIF()
ENDMACRO()

MACRO( EXTRACT_GIT_INFO_MESSAGE working_folder msg )
	EXTRACT_GIT_INFO( ${working_folder} head_hash head_datetime branch_name )
	SET( ${msg} "Commit:  ${head_hash}\nDate:    ${head_datetime}\nBranch:  ${branch_name}\n" )
ENDMACRO()

MACRO( SET_MSVC_VERSION_INFO target_name version_major version_minor version_update version_build componay_name product_name )
	IF(MSVC)
		SET(VERSION_MAJOR ${version_major})
		SET(VERSION_MINOR ${version_minor})
		SET(VERSION_UPDATE ${version_update} )
		SET(VERSION_BUILD ${version_build} )
		SET(COMPANY_NAME ${componay_name} )
		SET(PRODUCT_NAME ${product_name} )
		CONFIGURE_FILE( ${SUPERMASH_SOURCE_ROOT_DIR}/BuildScripts/VersionPatch.bat.in ${CMAKE_CURRENT_BINARY_DIR}/VersionPatch.bat )
		
		SET( VERSION_PATCH_EXE "${SUPERMASH_SOURCE_ROOT_DIR}/BuildScripts/verpatch.exe" )
		
		ADD_CUSTOM_COMMAND( TARGET ${target_name} POST_BUILD
			COMMAND ${CMAKE_CURRENT_BINARY_DIR}/VersionPatch.bat ${VERSION_PATCH_EXE} $<TARGET_FILE_DIR:${target_name}>/$<TARGET_FILE_NAME:${target_name}>
			WORKING_DIRECTORY  )
	ENDIF()
ENDMACRO()

# Copy git hooks into .git folder
MACRO( COPY_GIT_HOOKS_TO target_git_folder )
	IF(EXISTS ${target_git_folder})
		SET(hooks_target ${target_git_folder}/hooks)
		SET(hooks_source ${SUPERMASH_SOURCE_ROOT_DIR}/../git_hooks)
		MESSAGE(STATUS "Copying git hooks from '${hooks_source}' to '${hooks_target}'")
		FILE( COPY  ${hooks_source}/ DESTINATION ${hooks_target})
	ELSE()
		MESSAGE( FATAL_ERROR "The target directory '${target_git_folder}' does not exist.")
	ENDIF()
ENDMACRO()
