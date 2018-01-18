rem robocopy %WT_ROOT_DIR%bin %CommonOutDir% *.dll
rem robocopy %WT_ROOT_DIR%bin %CommonOutDir% *.pdb
rem robocopy %WT_ROOT_DIR%lib\share\Wt\resources %CommonOutDir%wwwroot\resources /MIR

robocopy ..\WTSparcSandbox\wwwroot %CommonOutDir%wwwroot /E
robocopy ..\WTSparcSandbox\bindir %CommonOutDir% /E

exit /b /0

