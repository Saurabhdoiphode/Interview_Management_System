# Interview Management System - Setup Guide

## 🚀 Quick Start

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Redis** (v7 or higher) - [Download](https://redis.io/download)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone and Navigate
```powershell
cd "C:\Users\saura\OneDrive\Desktop\interview management system"
```

### Step 2: Install Dependencies

#### Install root dependencies:
```powershell
npm install
```

#### Install backend dependencies:
```powershell
cd backend
npm install
cd ..
```

#### Install frontend dependencies:
```powershell
cd frontend
npm install
cd ..
```

### Step 3: Environment Setup

#### Create backend .env file:
```powershell
Copy-Item .env.example backend\.env
```

#### Edit `backend\.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/interview-management

# JWT Secrets (Change these!)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email (Use Gmail or any SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@interviewmanagement.com

# Cloudinary (Sign up at https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis
REDIS_URL=redis://localhost:6379
```

#### Create frontend .env file:
```powershell
"VITE_API_URL=http://localhost:5000/api`nVITE_SOCKET_URL=http://localhost:5000" | Out-File -FilePath frontend\.env -Encoding utf8
```

### Step 4: Start MongoDB and Redis

#### Option A: Using Docker (Recommended)
```powershell
docker-compose up mongodb redis -d
```

#### Option B: Manual Installation
1. **Start MongoDB:**
   ```powershell
   # If installed as Windows Service, it should already be running
   # Or start manually:
   mongod --dbpath C:\data\db
   ```

2. **Start Redis:**
   ```powershell
   # If installed as Windows Service:
   redis-server
   ```

### Step 5: Run the Application

#### Option A: Run Everything Together
```powershell
npm run dev
```

#### Option B: Run Separately

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 6: Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 📝 Default Test Accounts

After seeding the database (optional), you can use:

**Super Admin:**
- Email: admin@ims.com
- Password: Admin@123

**HR Manager:**
- Email: hr@ims.com
- Password: HR@123

**Candidate:**
- Email: candidate@ims.com
- Password: Candidate@123

## 🛠️ Development Commands

### Backend
```powershell
cd backend

# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Database migration
npm run migrate

# Seed database
npm run seed
```

### Frontend
```powershell
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐳 Docker Deployment

### Build and run all services:
```powershell
docker-compose up -d
```

### Stop all services:
```powershell
docker-compose down
```

### View logs:
```powershell
docker-compose logs -f
```

### Rebuild specific service:
```powershell
docker-compose up -d --build backend
```

## 📦 Database Setup

### Create MongoDB Database
```powershell
# Connect to MongoDB
mongosh

# Create database
use interview-management

# Create first user (optional)
db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@ims.com",
  password: "$2a$10$...", # Use bcrypt to hash password
  role: "super_admin",
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🔐 Email Configuration

### Gmail Setup:
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `.env` file

### Other SMTP Providers:
- **SendGrid:** smtp.sendgrid.net (Port: 587)
- **Mailgun:** smtp.mailgun.org (Port: 587)
- **AWS SES:** email-smtp.region.amazonaws.com (Port: 587)

## ☁️ Cloudinary Setup

1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add to backend `.env` file

## 🔍 Troubleshooting

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### MongoDB Connection Issues
```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# Start MongoDB service
Start-Service MongoDB
```

### Redis Connection Issues
```powershell
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Module Not Found Errors
```powershell
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

## 📚 API Documentation

Once the backend is running, access Swagger documentation at:
http://localhost:5000/api-docs

## 🧪 Testing

### Run All Tests
```powershell
npm test
```

### Run Backend Tests
```powershell
cd backend
npm test
```

### Run Frontend Tests
```powershell
cd frontend
npm test
```

### Test Coverage
```powershell
npm run test:coverage
```

## 🔑 Security Notes

⚠️ **Important**: Before deploying to production:

1. Change all default secrets in `.env`
2. Use strong JWT secrets (minimum 32 characters)
3. Enable HTTPS
4. Configure CORS properly
5. Set up rate limiting
6. Enable MongoDB authentication
7. Use environment-specific configurations

## 📞 Support

For issues or questions:
- Open an issue in the repository
- Email: support@interviewmanagement.com

## 🎉 You're All Set!

Your Interview Management System is now ready to use. Start by registering a new account or using one of the default test accounts.
