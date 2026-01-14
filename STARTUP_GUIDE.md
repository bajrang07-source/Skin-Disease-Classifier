# 🚀 Quick Startup Guide - Skin Health Hub

## Start All Services (In Order)

### 1. Start XAMPP
- Open XAMPP Control Panel
- Click "Start" for **Apache**
- Click "Start" for **MySQL**
- Wait for both to show "Running" status

### 2. Start ML Backend (Terminal 1)
```powershell
cd e:\XAMPP\htdocs\skin-health-hub-main\skin-health-hub-main\ml-backend
python app.py
```
Wait for: `Running on http://127.0.0.1:5000`

### 3. Start Frontend (Terminal 2)
```powershell
cd e:\XAMPP\htdocs\skin-health-hub-main\skin-health-hub-main
npm run dev
```
Wait for: `Local: http://localhost:5173/`

## Access Application
Open browser: **http://localhost:5173**

## Test Accounts
- **Patient**: patient@test.com / password123
- **Doctor**: doctor@test.com / password123
- **Admin**: admin@skinhealth.com / password123

## Stop Services
1. Press `Ctrl+C` in both terminal windows
2. Stop Apache and MySQL in XAMPP Control Panel

## Ports Used
- Frontend: 5173
- ML Backend: 5000
- Apache: 80
- MySQL: 3306
