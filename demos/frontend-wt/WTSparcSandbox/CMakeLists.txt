SET(MY_TARGET_NAME  wtdemo)

FILE( GLOB HEADER_FILES
  *.h *.cmake *.txt
  bindir/*.h
  login/*.h
  login/model/*.h
  sessionview/*.h
  threeview/*.h
)  # uncomment this line to have all headers in current directory and skip the next list

FILE( GLOB SOURCE_FILES
  *.cpp
  bindir/*.cpp
  login/*.cpp
  login/model/*.cpp
  sessionview/*.cpp
  threeview/*.cpp
)  # uncomment this line to have all headers in current directory and skip the next list


SET( ADDITIONAL_FILES  # add every file on its own line to ease merge operation
)

TREAT_WARNINGS_AS_ERRORS()
ADD_UNICODE_SUPPORT()

SET( MY_INTERNAL_LINK_LIBRARIES ${CURRENT_TARGET_DEPENDS} )
SET( MY_EXTERNAL_LINK_LIBRARIES LINK_PRIVATE ${MY_EXTERNAL_LINK_LIBRARIES}  # add every file on its own line to ease merge operation
		# Ordering: First the most dependent libraries
)

USE_BOOST()
USE_WT()

# Create "this" target: this macro uses MY_TARGET_NAME, SOURCE_FILES, HEADER_FILES, MY_INTERNAL_LINK_LIBRARIES, MY_EXTERNAL_LINK_LIBRARIES, ... (do not change namings above!)
SETUP_CONSOLE_EXECUTABLE()

MSVC_SET_CRT_AND_SCL_SECURE_NO_WARNINGS( ${MY_TARGET_NAME} )

# This is a hack during auto conversion of VS project files to be able to set the filter in the master file
# better write the naming directly here instead of using this naming.
IF (MY_PROJECT_GROUP_NAME)
  MSVC_PROJECT_GROUP( ${MY_TARGET_NAME} ${MY_PROJECT_GROUP_NAME} )
ENDIF()

# TODO see BuildEnv/CMakeLists.txt
# robocopy ..\WTSparcSandbox\wwwroot %CommonOutDir%wwwroot /E
# robocopy ..\WTSparcSandbox\bindir %CommonOutDir% /E
FILE(COPY ${CMAKE_CURRENT_SOURCE_DIR}/bindir/
  DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}
)
FILE(COPY ${CMAKE_CURRENT_SOURCE_DIR}/wwwroot/
  DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/wwwroot
)
