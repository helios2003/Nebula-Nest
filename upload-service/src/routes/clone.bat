@echo off
if "%~2"=="" (
    echo Usage: %0 ^<github_username^> ^<repository_name^>
    exit /b 1
)

set "size="
for /f "tokens=*" %%A in ('curl -s https://api.github.com/repos/%1/%2 2^> nul ^| findstr /C:"size"') do set "size=%%A"
if not "%size%"=="" (
    for /f "tokens=*" %%B in ("%size%") do echo %%B
) else (
    echo 0
)
