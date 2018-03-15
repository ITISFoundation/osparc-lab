
## TODO implement https://stackoverflow.com/questions/14474659/cmake-how-to-have-a-target-for-copying-files
# TODO define a target
# robocopy ..\WTSparcSandbox\wwwroot %CommonOutDir%wwwroot /E
# robocopy ..\WTSparcSandbox\bindir %CommonOutDir% /E
#FILE(COPY ${CMAKE_CURRENT_SOURCE_DIR}/bindir/
#  DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}
#)
#FILE(COPY ${CMAKE_CURRENT_SOURCE_DIR}/wwwroot/
#  DESTINATION ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}
#)

SET(RESOURCE_DIRS
  ${CMAKE_CURRENT_SOURCE_DIR}/../WTSparcSandbox/bindir/
  ${CMAKE_CURRENT_SOURCE_DIR}/../WTSparcSandbox/wwwroot/
)

ADD_CUSTOM_TARGET(BuildEnv)

FOREACH(RESOURCE_DIR ${RESOURCE_DIRS})
  ADD_CUSTOM_COMMAND( TARGET BuildEnv
    PRE_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${RESOURCE_DIR} ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/Release
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${RESOURCE_DIR} ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/Debug
  )
ENDFOREACH()
