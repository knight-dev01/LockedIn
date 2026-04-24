# LockedIn — Development Startup Script
# Run: .\start.ps1

Write-Host ""
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host "    LockedIn — Proof Over Claims" -ForegroundColor White
Write-Host "    Starting Development Servers..." -ForegroundColor Gray
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "[1/2] Starting FastAPI Backend on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; .\venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[2/2] Starting Next.js Frontend on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "  ========================================" -ForegroundColor Green
Write-Host "    Both servers starting!" -ForegroundColor White
Write-Host "    Backend:  http://localhost:8000" -ForegroundColor Gray
Write-Host "    Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "    API Docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "  ========================================" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "Browser opened. Happy building!" -ForegroundColor Cyan
