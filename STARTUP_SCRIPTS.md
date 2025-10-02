# Temple3 Startup Scripts

This directory contains several scripts to easily start the Temple3 application (both frontend and backend).

## Quick Start Options

### Option 1: Double-click Batch File (Easiest)
```
Double-click: start-temple3.bat
```
- Simplest method
- Opens two separate PowerShell windows
- One for backend, one for frontend
- Just close the windows to stop servers

### Option 2: PowerShell Script (Recommended)
```powershell
.\start-temple3.ps1
```
- Opens two separate PowerShell windows
- Shows startup progress and server information
- Displays test credentials and useful URLs
- Press any key to close the startup window

### Option 3: Single Terminal (Advanced)
```powershell
.\start-temple3-single.ps1
```
- Runs both servers in background jobs
- Interactive command interface
- Type commands to manage servers:
  - `backend` - Show backend output
  - `frontend` - Show frontend output
  - `status` - Show server status
  - `stop` - Stop all servers
  - `quit` - Stop servers and exit

## Manual Start (Traditional)

If you prefer to start servers manually:

### Backend:
```powershell
npm run dev
```

### Frontend (in separate terminal):
```powershell
cd frontend
npm run dev
```

## Server Information

Once started, you can access:

- **Frontend**: http://localhost:3001 (or next available port)
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Database**: PostgreSQL on localhost:5432

## Test Credentials

- **Tenant**: first-community
- **Email**: admin@firstcommunity.org
- **Password**: admin123

## Troubleshooting

### PowerShell Execution Policy Error
If you see an execution policy error, run this once as Administrator:
```powershell
Set-ExecutionPolicy RemoteSigned
```

### Port Already in Use
The scripts will detect if ports are in use and Vite will automatically find an available port for the frontend.

### Database Connection Issues
Make sure PostgreSQL is running:
```powershell
Get-Service -Name "*postgresql*"
```

## Prerequisites

Before running these scripts, ensure you have:

1. ✅ Node.js installed
2. ✅ PostgreSQL installed and running
3. ✅ Dependencies installed (`npm install` in root and frontend directories)
4. ✅ Database set up (`npm run setup-db`)
5. ✅ .env file configured

## Script Features

- 🔍 **Port checking** - Detects if ports are already in use
- 🎨 **Colored output** - Easy to read status messages
- 🛡️ **Error handling** - Graceful handling of common issues
- 📊 **Status reporting** - Shows server URLs and credentials
- 🔧 **Multiple options** - Choose the method that works best for you