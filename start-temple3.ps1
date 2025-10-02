# Temple3 Application Startup Script
# This script starts both the frontend and backend servers

Write-Host "🏛️  Temple3 Application Startup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory (Temple3 root)
$RootDir = $PSScriptRoot
$FrontendDir = Join-Path $RootDir "frontend"

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Function to start backend
function Start-Backend {
    Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
    Write-Host "   Location: $RootDir" -ForegroundColor Gray
    Write-Host "   Command: npm run dev" -ForegroundColor Gray
    Write-Host ""
    
    # Start backend in new PowerShell window
    $backendScript = @"
Set-Location '$RootDir'
Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green
Write-Host 'Location: $RootDir' -ForegroundColor Gray
Write-Host ''
npm run dev
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript
    Write-Host "✅ Backend server starting in new window..." -ForegroundColor Green
}

# Function to start frontend
function Start-Frontend {
    Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
    Write-Host "   Location: $FrontendDir" -ForegroundColor Gray
    Write-Host "   Command: npm run dev" -ForegroundColor Gray
    Write-Host ""
    
    # Start frontend in new PowerShell window
    $frontendScript = @"
Set-Location '$FrontendDir'
Write-Host '🎨 Frontend Server Starting...' -ForegroundColor Green
Write-Host 'Location: $FrontendDir' -ForegroundColor Gray
Write-Host ''
npm run dev
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript
    Write-Host "✅ Frontend server starting in new window..." -ForegroundColor Green
}

# Check if directories exist
if (-not (Test-Path $RootDir)) {
    Write-Host "❌ Error: Root directory not found: $RootDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $FrontendDir)) {
    Write-Host "❌ Error: Frontend directory not found: $FrontendDir" -ForegroundColor Red
    exit 1
}

# Check if package.json files exist
if (-not (Test-Path (Join-Path $RootDir "package.json"))) {
    Write-Host "❌ Error: Backend package.json not found" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $FrontendDir "package.json"))) {
    Write-Host "❌ Error: Frontend package.json not found" -ForegroundColor Red
    exit 1
}

# Check if ports are already in use
Write-Host "🔍 Checking ports..." -ForegroundColor Yellow
$backendPort = 3000
$frontendPorts = @(3001, 3002, 3003, 3004, 3005)

if (Test-Port $backendPort) {
    Write-Host "⚠️  Port $backendPort is already in use (Backend)" -ForegroundColor Yellow
    Write-Host "   The backend might already be running or another service is using this port." -ForegroundColor Gray
}

$frontendPortInUse = $false
foreach ($port in $frontendPorts) {
    if (Test-Port $port) {
        Write-Host "⚠️  Port $port is in use" -ForegroundColor Yellow
        $frontendPortInUse = $true
    }
}

if ($frontendPortInUse) {
    Write-Host "   Vite will automatically find an available port." -ForegroundColor Gray
}

Write-Host ""

# Start servers
try {
    # Start backend first
    Start-Backend
    
    # Wait a moment for backend to start
    Start-Sleep -Seconds 2
    
    # Start frontend
    Start-Frontend
    
    # Wait a moment for both to initialize
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "🚀 Temple3 Application Starting!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
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
    Write-Host "📋 Useful Commands:" -ForegroundColor Cyan
    Write-Host "   Health Check: http://localhost:3000/health" -ForegroundColor White
    Write-Host "   API Docs:     http://localhost:3000/api" -ForegroundColor White
    Write-Host ""
    Write-Host "ℹ️  Both servers are running in separate PowerShell windows." -ForegroundColor Yellow
    Write-Host "   Close those windows to stop the servers." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✨ Happy coding! Press any key to close this window..." -ForegroundColor Green
    
    # Wait for user input before closing
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
} catch {
    Write-Host ""
    Write-Host "❌ Error starting Temple3 application:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Press any key to close..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}