@echo off
chcp 65001 >nul
setlocal enableextensions
cd /d "%~dp0"
title 头像打印机 · 一键安装并启动

set "RUNTIME_URL=https://github.com/simonluo0322/simon-avatar-printer-portable/releases/download/v1.0.0/runtime-win64.zip"

if exist "%~dp0runtime\python\python.exe" if exist "%~dp0runtime\node\node.exe" goto READY

echo.
echo   首次安装：正在下载运行环境（约 160MB，只需下载一次）
echo   下载地址：%RUNTIME_URL%
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue';try{Invoke-WebRequest -Uri '%RUNTIME_URL%' -OutFile '%~dp0runtime.zip' -UseBasicParsing}catch{exit 1}"
if not exist "%~dp0runtime.zip" goto DLFAIL
echo   正在解压运行环境...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try{Expand-Archive -LiteralPath '%~dp0runtime.zip' -DestinationPath '%~dp0' -Force}catch{exit 1}"
del "%~dp0runtime.zip" >nul 2>nul
if not exist "%~dp0runtime\python\python.exe" goto UNZIPFAIL
echo   安装完成，正在启动...
echo.

:READY
start "" "%~dp0一键启动.bat"
exit /b 0

:DLFAIL
echo.
echo   [失败] 运行环境下载失败：请检查网络，或者复制下面的地址用浏览器下载，
echo          再把 runtime.zip 放到本文件夹，重新双击本文件。
echo          %RUNTIME_URL%
echo.
pause
exit /b 1

:UNZIPFAIL
echo.
echo   [失败] 解压后没有找到 runtime 目录。请手动把 runtime.zip 解压到本文件夹，
echo          确保得到 runtime\python\python.exe 和 runtime\node\node.exe。
echo.
pause
exit /b 1
