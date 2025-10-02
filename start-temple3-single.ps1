# Temple3 Application Startup Script (Single Terminal)
# This script starts both servers in the current terminal using background jobs

Write-Host "🏛️  Temple3 Application Startup (Single Terminal)" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory (Temple3 root)
$RootDir = $PSScriptRoot
$FrontendDir = Join-Path $RootDir "frontend"

# Function to stop all jobs on exit
function Stop-AllJobs {
    Write-Host ""
    Write-Host "🛑 Stopping Temple3 servers..." -ForegroundColor Yellow
    Get-Job | Where-Object { $_.Name -like "Temple3*" } | Stop-Job
    Get-Job | Where-Object { $_.Name -like "Temple3*" } | Remove-Job
    Write-Host "✅ All servers stopped." -ForegroundColor Green
}

# Register cleanup on Ctrl+C
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Stop-AllJobs
}

Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
Write-Host "   Location: $RootDir" -ForegroundColor Gray

# Start backend as background job
$backendJob = Start-Job -Name "Temple3-Backend" -ScriptBlock {
    param($rootDir)
    Set-Location $rootDir
    npm run dev
} -ArgumentList $RootDir

Write-Host "✅ Backend job started (Job ID: $($backendJob.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "   Location: $FrontendDir" -ForegroundColor Gray

# Start frontend as background job
$frontendJob = Start-Job -Name "Temple3-Frontend" -ScriptBlock {
    param($frontendDir)
    Set-Location $frontendDir
    npm run dev
} -ArgumentList $FrontendDir

Write-Host "✅ Frontend job started (Job ID: $($frontendJob.Id))" -ForegroundColor Green

# Wait for servers to initialize
Write-Host ""
Write-Host "⏳ Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "🚀 Temple3 Application Running!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Server Information:" -ForegroundColor Cyan
Write-Host "   🔧 Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "   🎨 Frontend: http://localhost:3001 (or next available port)" -ForegroundColor White
Write-Host "   💾 Database: PostgreSQL on localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Tenant:   first-community" -ForegroundColor White
Write-Host "   Email:    admin@firstcommunity.org" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📋 Management Commands:" -ForegroundColor Cyan
Write-Host "   'backend'  - Show backend output" -ForegroundColor White
Write-Host "   'frontend' - Show frontend output" -ForegroundColor White
Write-Host "   'status'   - Show job status" -ForegroundColor White
Write-Host "   'stop'     - Stop all servers" -ForegroundColor White
Write-Host "   'quit'     - Stop servers and exit" -ForegroundColor White
Write-Host ""

# Interactive command loop
do {
    Write-Host "Temple3> " -NoNewline -ForegroundColor Green
    $command = Read-Host
    
    switch ($command.ToLower()) {
        "backend" {
            Write-Host ""
            Write-Host "🔧 Backend Output:" -ForegroundColor Yellow
            Write-Host "==================" -ForegroundColor Yellow
            Receive-Job -Name "Temple3-Backend"
            Write-Host ""
        }
        "frontend" {
            Write-Host ""
            Write-Host "🎨 Frontend Output:" -ForegroundColor Yellow
            Write-Host "===================" -ForegroundColor Yellow
            Receive-Job -Name "Temple3-Frontend"
            Write-Host ""
        }
        "status" {
            Write-Host ""
            Write-Host "📊 Job Status:" -ForegroundColor Yellow
            Write-Host "==============" -ForegroundColor Yellow
            Get-Job | Where-Object { $_.Name -like "Temple3*" } | Format-Table Name, State, HasMoreData
            Write-Host ""
        }
        "stop" {
            Stop-AllJobs
            Write-Host ""
        }
        "quit" {
            Stop-AllJobs
            Write-Host "👋 Goodbye!" -ForegroundColor Green
            break
        }
        "help" {
            Write-Host ""
            Write-Host "📋 Available Commands:" -ForegroundColor Cyan
            Write-Host "   'backend'  - Show backend output" -ForegroundColor White
            Write-Host "   'frontend' - Show frontend output" -ForegroundColor White
            Write-Host "   'status'   - Show job status" -ForegroundColor White
            Write-Host "   'stop'     - Stop all servers" -ForegroundColor White
            Write-Host "   'quit'     - Stop servers and exit" -ForegroundColor White
            Write-Host "   'help'     - Show this help" -ForegroundColor White
            Write-Host ""
        }
        "" {
            # Empty command, do nothing
        }
        default {
            Write-Host "❓ Unknown command: $command" -ForegroundColor Red
            Write-Host "   Type 'help' for available commands" -ForegroundColor Yellow
        }
    }
} while ($true)