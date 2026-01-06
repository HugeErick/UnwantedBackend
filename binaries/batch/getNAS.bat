@echo off
setlocal enabledelayedexpansion


::Config
set NAS_HOSTNAME=NAS10Merk
set SHARE_PATH=\Public
set DRIVE_LETTER=Y:
set USERNAME=Gestion
set PASSWORD=Merkabbala10!


:: resolve NAS IP
:resolve_nas
echo Attempting to resolve NAS IP address...
for /f "tokens=2 delims=[]" %%A in ('ping -4 -n 1 %NAS_HOSTNAME% ^| findstr "["') do (
    set NAS_IP=%%A
    echo Resolved IP: !NAS_IP!
)

if "%NAS_IP%"=="" (
    echo Failed to resolve NAS IP address
    timeout /t 20 >nul
    goto :resolve_nas
)

:: Attempt connection
echo Connecting to \\!NAS_IP!%SHARE_PATH%...
net use %DRIVE_LETTER% \\!NAS_IP!%SHARE_PATH% /persistent:yes /user:%USERNAME% %PASSWORD%

:: verify connection
if errorlevel 1 (
    echo Connection failed, retrying...
    timeout /t 5 >nul
    set NAS_IP=
    goto :resolve_nas
) else (
    echo Successfully connected %DRIVE_LETTER% to NAS
)

timeout /t 800 >nul
exit