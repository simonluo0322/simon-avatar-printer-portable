@echo off
chcp 65001 >nul
cd /d "%~dp0app"
set "PATH=%~dp0runtime\node;%~dp0runtime\python;%~dp0runtime\python\Scripts;%PATH%"
set "PYTHONUTF8=1"
start "" "%~dp0runtime\python\pythonw.exe" "%~dp0start-browser.py"
exit