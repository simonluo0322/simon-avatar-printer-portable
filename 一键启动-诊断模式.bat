@echo off
chcp 65001 >nul
title 3D Printer Live - Debug Console
cd /d "%~dp0app"
set "PATH=%~dp0runtime\node;%~dp0runtime\python;%~dp0runtime\python\Scripts;%PATH%"
set "PYTHONUTF8=1"
set "PYTHONIOENCODING=utf-8"
"%~dp0runtime\python\python.exe" "%~dp0start-app.py"
if errorlevel 1 (
    echo.
    echo [FAILED] 启动失败。请把上面的报错信息发给助手。
    pause
)