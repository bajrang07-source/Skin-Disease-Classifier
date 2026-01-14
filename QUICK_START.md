# 🚀 Skin Health Hub - Quick Start Guide
**Docker Deployment - Ready to Share!**

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ **Docker Desktop** installed and **RUNNING** (Important!)
- ✅ Minimum 8GB RAM
- ✅ 20GB free disk space
- ✅ Windows 10/11 or macOS or Linux

### Install Docker Desktop (if not installed):
**Download:** https://www.docker.com/products/docker-desktop

**After installation:**
1. Open Docker Desktop application
2. Wait for it to fully start (you'll see a green icon in system tray)
3. Verify it's running: Open PowerShell and type `docker info`

---

## ⚡ Quick Start (3 Steps)

### Step 1: Start Docker Desktop
**IMPORTANT:** Docker Desktop must be running BEFORE you proceed!

✅ Look for Docker icon in your system tray (it should be running)

---

### Step 2: Open PowerShell in Project Directory

**Right-click in project folder** → **Open in Terminal** (or PowerShell)

Or manually navigate:
```powershell
cd e:\XAMPP\htdocs\skin-health-hub-main\skin-health-hub-main
```

---

### Step 3: Build and Start Application

**Run these commands one by one:**

```powershell
# Build all Docker images (takes 10-15 minutes first time)
docker-compose build

# Start all services
docker-compose up -d

# Check if all services are running
docker-compose ps
```

**Expected output:**
```
NAME                  STATUS
skinwise-mysql        Up (healthy)
skinwise-api          Up (healthy)
skinwise-ml           Up (healthy)
skinwise-frontend     Up (healthy)
skinwise-nginx        Up (healthy)
```

---

## 🌐 Access the Application

Once all services show "healthy" status:

**Open your browser and go to:** http://localhost

### Test Accounts (Already Created):

**Patient Account:**
- Email: `patient@test.com`
- Password: `password123`

**Doctor Account:**
- Email: `doctor@test.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@skinhealth.com`
- Password: `password123`

---

## 🎯 What's Included?

This Docker setup includes **5 services**:

1. **Frontend** - React web application
2. **PHP API** - Backend REST API
3. **ML Backend** - AI skin disease classifier (93% accuracy)
4. **MySQL** - Database with sample data
5. **Nginx** - Reverse proxy for routing

---

## 🔧 Common Issues & Solutions

### Issue 1: "Docker daemon not running"
**Error:** `Cannot connect to Docker daemon`

**Solution:**
1. Open Docker Desktop application
2. Wait until it shows "Docker Desktop is running"
3. Try commands again

---

### Issue 2: Port 80 already in use
**Error:** `port is already allocated`

**Solution:**
```powershell
# Stop any running web servers (XAMPP, Apache, IIS)
# Or use different port by editing docker-compose.yml
```

---

### Issue 3: Build takes very long
**This is NORMAL!** First build downloads:
- Node.js dependencies (~500MB)
- PHP dependencies (~100MB)
- Python + TensorFlow (~2GB)
- MySQL image (~550MB)

**Expected time:** 10-15 minutes on first build
**Subsequent builds:** 1-2 minutes (cached)

---

### Issue 4: ML Backend shows "starting" for long time
**This is NORMAL!** The ML backend needs to:
1. Load TensorFlow library
2. Load ResNet50 model (366MB)

**Wait 2-3 minutes** after starting services.

---

## 📊 Useful Commands

### Daily Use
```powershell
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f api
```

### Troubleshooting
```powershell
# Check service status
docker-compose ps

# Restart a service
docker-compose restart ml-backend

# Rebuild a service
docker-compose build --no-cache frontend
docker-compose up -d frontend

# Complete clean restart (removes all data!)
docker-compose down -v
docker-compose up -d
```

### Development Mode (with hot reload)
```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

---

## 🗂️ Project Structure

```
skin-health-hub-main/
├── 🐳 Dockerfile.frontend       # React + Vite
├── 🐳 Dockerfile.api            # PHP + Apache
├── 🐳 Dockerfile.ml             # Python + TensorFlow
├── 🐳 docker-compose.yml        # Main configuration
├── 🐳 docker-compose.dev.yml    # Development config
├── 🐳 docker-compose.prod.yml   # Production config
├── 📁 src/                      # Frontend code
├── 📁 api/                      # Backend code
├── 📁 ml-backend/               # ML service
│   └── ResNet50_Skin_Stage3_93acc.keras (AI model)
├── 📁 database/                 # Database schema
└── 📁 nginx/                    # Reverse proxy config
```

---

## ✨ Features

### For Patients:
- 🔍 Upload skin images for instant AI analysis
- 📅 Book appointments with dermatologists
- 📞 Schedule reminder calls (Twilio integration)
- 📊 View your medical history
- ⭐ Rate and review doctors

### For Doctors:
- 👥 Manage patient appointments
- 📋 View patient predictions and history
- ✅ Approve/reject appointment requests
- 📊 Dashboard with statistics

### AI Analysis:
- 🧠 ResNet50 deep learning model
- 🎯 93% accuracy
- 🏥 Detects 7+ skin diseases:
  - Acne
  - Eczema
  - Psoriasis
  - Melanoma
  - And more...

---

## 🔒 Security Notes

### Default Passwords (Change these!):
The `.env` file contains database passwords:
```env
MYSQL_ROOT_PASSWORD=SkinWise_Root_2025!
MYSQL_PASSWORD=SkinWise_User_2025!
```

**For production deployment:**
1. Edit `.env` file
2. Change passwords to strong, unique values
3. Never commit `.env` to Git

---

## 🌍 Deployment Options

### Local Development (Current):
```powershell
docker-compose up -d
```
Access: http://localhost

### Production Deployment:
```powershell
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**For production, also consider:**
- Setting up SSL certificates
- Using environment-specific passwords
- Configuring backups
- Setting up monitoring

---

## 📞 API Endpoints

All accessible at `http://localhost/api/`

**Authentication:**
- `POST /api/auth/login.php` - User login
- `POST /api/auth/signup.php` - User registration

**Predictions:**
- `POST /api/predict/upload.php` - Upload image
- `POST /predict` - ML prediction endpoint

**Appointments:**
- `GET /api/appointments/list.php` - List appointments
- `POST /api/appointments/book.php` - Book appointment
- `PUT /api/appointments/update_status.php` - Update status

**Users:**
- `GET /api/users/doctors.php` - List doctors
- `GET /api/users/profile.php` - Get user profile

**Reviews:**
- `GET /api/reviews/list.php` - List reviews
- `POST /api/reviews/add.php` - Add review

---

## 🛑 Stopping the Application

To free up system resources when not using:

```powershell
# Stop all services (data is preserved)
docker-compose down

# Stop and remove all data (clean slate)
docker-compose down -v
```

---

## 📚 Additional Documentation

- `DOCKER_README.md` - Detailed deployment guide
- `DOCKER_CONTAINERIZATION_GUIDE.md` - Architecture details
- `PRODUCT_SPECIFICATION.md` - Full product specifications

---

## 💡 Tips for Friends

### First Time Setup:
1. Install Docker Desktop
2. Extract project files
3. Open PowerShell in project folder
4. Run: `docker-compose build` (grab coffee ☕)
5. Run: `docker-compose up -d`
6. Visit: http://localhost
7. Login with test account

### Subsequent Use:
1. Make sure Docker Desktop is running
2. Run: `docker-compose up -d`
3. Visit: http://localhost
4. Done! 🎉

### When Finished:
```powershell
docker-compose down
```

---

## ✅ Checklist Before Sharing

- [x] All Dockerfiles created
- [x] docker-compose.yml configured
- [x] .env file with passwords
- [x] Database schema included
- [x] ML model included (366MB)
- [x] Documentation complete
- [x] Test accounts configured
- [x] README for friends

---

## 🎉 Success Criteria

You know it's working when:
- ✅ All 5 services show "healthy" in `docker-compose ps`
- ✅ http://localhost loads the application
- ✅ You can login with test credentials
- ✅ You can upload an image for prediction
- ✅ No errors in browser console

---

**Enjoy using Skin Health Hub! 🏥**

**Questions?** Check logs: `docker-compose logs -f`
