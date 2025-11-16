@echo off
REM Interview Management System - Windows Batch Startup
REM Double-click this file to start the entire application

cd /d "%~dp0"

REM Run PowerShell script
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1"

pause
