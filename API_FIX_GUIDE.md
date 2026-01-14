# API Configuration Fix

## Issue
The "Failed to fetch" error occurs because the frontend cannot reach the PHP backend APIs.

## Root Cause
The API URL path doesn't match where XAMPP serves files from. Your project is located at:
`d:\EDI 2025-26\skin-health-hub-main\skin-health-hub-main\`

But XAMPP needs to serve it from its htdocs directory.

## Solutions

### Option 1: Create Symbolic Link (Recommended)
Create a symbolic link in XAMPP's htdocs folder:

1. Open Command Prompt as Administrator
2. Navigate to XAMPP htdocs:
   ```cmd
   cd C:\xampp\htdocs
   ```
3. Create symbolic link:
   ```cmd
   mklink /D "skin-health-hub" "d:\EDI 2025-26\skin-health-hub-main\skin-health-hub-main"
   ```
4. Update `.env` file:
   ```
   VITE_API_URL=http://localhost/skin-health-hub/api
   ```
5. Restart dev server

### Option 2: Copy Project to htdocs
1. Copy entire project to `C:\xampp\htdocs\skin-health-hub\`
2. Update `.env`:
   ```
   VITE_API_URL=http://localhost/skin-health-hub/api
   ```
3. Restart dev server

### Option 3: Configure Apache Virtual Host
Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf` and add your project path.

## Current Fix Applied
I've updated the code to use: `http://localhost/EDI%202025-26/skin-health-hub-main/skin-health-hub-main/api`

**This will only work if XAMPP can access the D: drive path.**

If it doesn't work, please use Option 1 or 2 above.

## Test the Fix
1. Restart the dev server (Ctrl+C, then `npm run dev`)
2. Try signing up again
3. Check browser console (F12) for any errors
