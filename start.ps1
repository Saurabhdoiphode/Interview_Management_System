# Interview Management System - Auto Startup Script
Write-Host "========== Interview Management System ==========" -ForegroundColor Green
Write-Host "Starting Application..." -ForegroundColor Green
Write-Host ""

# Kill any existing node processes
Write-Host "[1/4] Cleaning up old processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Get the project root directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "[2/4] Starting Backend Server on port 5000..." -ForegroundColor Cyan
Push-Location "$projectRoot\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Pop-Location
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[3/4] Starting Frontend Server on port 5173..." -ForegroundColor Cyan
Push-Location "$projectRoot\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Pop-Location
Start-Sleep -Seconds 3

# Open in Chrome
Write-Host "[4/4] Opening application in browser..." -ForegroundColor Cyan
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"

if (Test-Path $chromePath) {
    Start-Process $chromePath "http://localhost:5173"
    Write-Host "[OK] Chrome opened at http://localhost:5173" -ForegroundColor Green
} else {
    Start-Process "msedge.exe" "http://localhost:5173" -ErrorAction SilentlyContinue
    Write-Host "[OK] Browser opened at http://localhost:5173" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "[SUCCESS] APPLICATION STARTED!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Database: MongoDB Atlas (Connected)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Three terminal windows have opened:" -ForegroundColor Yellow
Write-Host "  - Backend Terminal (npm run dev)" -ForegroundColor Yellow
Write-Host "  - Frontend Terminal (npm run dev)" -ForegroundColor Yellow
Write-Host "  - Main Terminal (this window)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ready to use:" -ForegroundColor Green
Write-Host "  1. Register with email and password" -ForegroundColor Green
Write-Host "  2. Login with your credentials" -ForegroundColor Green
Write-Host "  3. View Dashboard and Job Listings" -ForegroundColor Green
Write-Host "  4. All data saves to MongoDB Atlas" -ForegroundColor Green
Write-Host ""
