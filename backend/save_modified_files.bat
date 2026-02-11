@echo off
setlocal enabledelayedexpansion

REM Get the root directory of the git project
for /f "tokens=*" %%i in ('git rev-parse --show-toplevel 2^>nul') do set "GIT_ROOT=%%i"

if "%GIT_ROOT%"=="" (
    echo ERROR: Not a git repository or git is not installed.
    exit /b 1
)

REM Convert forward slashes to backslashes for Windows paths
set "GIT_ROOT=%GIT_ROOT:/=\%"

REM Define the temp directory
set "TEMP_DIR=%GIT_ROOT%\temp"

REM Create temp directory if it doesn't exist
if not exist "%TEMP_DIR%" (
    mkdir "%TEMP_DIR%"
    echo Created temp directory: %TEMP_DIR%
)

echo.
echo Git Project Root: %GIT_ROOT%
echo Destination: %TEMP_DIR%
echo.
echo Copying modified and new files...
echo ========================================

set "FILE_COUNT=0"

REM Get all modified, added, and untracked files
REM Using git status --porcelain for reliable parsing
for /f "tokens=1,* delims= " %%a in ('git status --porcelain 2^>nul') do (
    set "STATUS=%%a"
    set "FILEPATH=%%b"

    REM Remove leading space if present
    if "!FILEPATH:~0,1!"==" " set "FILEPATH=!FILEPATH:~1!"

    REM Skip deleted files (status D)
    if not "!STATUS!"=="D" if not "!STATUS!"=="D " (
        REM Convert forward slashes to backslashes
        set "FILEPATH=!FILEPATH:/=\!"

        REM Handle renamed files (format: old -> new)
        echo !FILEPATH! | findstr /C:" -> " >nul
        if !errorlevel!==0 (
            for /f "tokens=2 delims=>" %%x in ("!FILEPATH!") do (
                set "FILEPATH=%%x"
                set "FILEPATH=!FILEPATH:~1!"
            )
        )

        REM Remove quotes if present
        set "FILEPATH=!FILEPATH:"=!"

        set "SRC_FILE=%GIT_ROOT%\!FILEPATH!"
        set "DEST_FILE=%TEMP_DIR%\!FILEPATH!"

        REM Get the directory part of the destination file
        for %%f in ("!DEST_FILE!") do set "DEST_DIR=%%~dpf"

        REM Create destination directory structure if needed
        if not exist "!DEST_DIR!" mkdir "!DEST_DIR!" 2>nul

        REM Copy the file if it exists (skip deleted files)
        if exist "!SRC_FILE!" (
            copy /y "!SRC_FILE!" "!DEST_FILE!" >nul 2>&1
            if !errorlevel!==0 (
                echo [!STATUS!] !FILEPATH!
                set /a FILE_COUNT+=1
            ) else (
                echo FAILED: !FILEPATH!
            )
        )
    )
)

echo ========================================
echo.
echo Done! Copied !FILE_COUNT! file(s) to %TEMP_DIR%

endlocal
