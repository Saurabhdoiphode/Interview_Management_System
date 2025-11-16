# Interview Management System - Quick Start Guide

## How to Run the Project

### Option 1: Double-Click to Start (Recommended)
Simply double-click the **`start.bat`** file in the project root folder. This will:
- ✅ Stop any existing processes
- ✅ Start the Backend Server (port 5000)
- ✅ Start the Frontend Server (port 5173)
- ✅ Automatically open Chrome browser with the application

### Option 2: Run PowerShell Script
Open PowerShell in the project root and run:
```powershell
.\start.ps1
```

### Option 3: Manual Start
If you prefer to start servers manually:

#### Start Backend:
```bash
cd backend
npm run dev
```

#### Start Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## System Requirements
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Chrome** or **Edge** browser
- **MongoDB Atlas** account (connected via MongoDB URI in `.env`)

---

## Project Structure

```
interview-management-system/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── server.js       # Main server file
│   │   └── ...
│   └── package.json
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # React entry point
│   │   └── ...
│   └── package.json
│
├── .env                     # MongoDB connection & config
├── start.bat                # Windows batch file to start
├── start.ps1                # PowerShell startup script
└── README.md                # This file
```

---

## Accessing the Application

After starting with `start.bat`:

### Frontend (User Interface)
- **URL:** http://localhost:5173
- **Features:**
  - User Registration
  - User Login
  - Dashboard with Job Listings
  - Job Statistics

### Backend (API Server)
- **URL:** http://localhost:5000
- **Database:** MongoDB Atlas
- **Endpoints:**
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - User login
  - GET `/api/jobs` - Get all jobs
  - POST `/api/jobs` - Create new job

---

## Usage

1. **Register:**
   - Click "Register" on the login page
   - Enter: First Name, Last Name, Email, Password, Role
   - Submit the form

2. **Login:**
   - Enter your registered email and password
   - Click "Login"

3. **Dashboard:**
   - View job statistics
   - Browse job listings
   - See role-specific information

---

## Technology Stack

### Frontend
- React 18
- Vite (Build tool)
- Pure CSS (No framework)
- Fetch API for HTTP calls

### Backend
- Node.js + Express
- MongoDB Atlas (Database)
- JavaScript (ES6 modules)

---

## Environment Configuration

The `.env` file contains:
```
MONGODB_URI=mongodb+srv://[user]:[password]@cluster.mongodb.net/...
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
```powershell
# Find and kill process on port 5000
Get-Process node | Stop-Process -Force
```

### MongoDB Connection Failed
- Check your MongoDB Atlas IP whitelist
- Verify credentials in `.env`
- Ensure internet connection is active

### Chrome Not Opening
- Make sure Chrome is installed
- System will try Edge as fallback
- Manually open http://localhost:5173 in your browser

---

## Security & UI Enhancements (2025-11)

Recent improvements were added to strengthen backend security and enrich frontend animations.

### Backend Security Upgrades
- Added middleware: Helmet (with CSP), hpp (parameter pollution), xss-clean (XSS sanitization), express-rate-limit (enhanced headers), express-mongo-sanitize (NoSQL injection protection), compression, cookie-parser.
- Hardened CORS: only allows the configured `FRONTEND_URL` origin.
- Enabled `trust proxy` for accurate IP handling when behind a reverse proxy.
- JWT tokens now include `issuer` and `audience` claims (prep for RS256 key rotation).
- Added TODOs for migrating to secure HttpOnly cookies and rotating keys.

### Frontend Animation Upgrades
- Integrated `framer-motion` for smooth page transitions, staggered form field reveals, and animated dashboard/stat/job cards.
- Removed duplicated legacy React code from `App.jsx`.
- Preserved existing CSS while layering in motion-based transitions.

### Post-Update Steps
Run the following once to install new dependencies:
```powershell
cd backend; npm install; cd ../frontend; npm install
```

### Optional Hardening Next
- Migrate auth storage from `localStorage` to secure, HttpOnly, same-site cookies.
- Implement brute-force detection on login & register routes.
- Introduce per-user rate limiting and WebSocket auth hardening.
- Adopt RS256 JWT with JWKS endpoint for key rotation.

---

## Responsive & Cross-Device Testing

The UI now uses fluid typography (`clamp`), enhanced small-screen breakpoints and accessible focus states.

### Test on Desktop
1. Run frontend: `npm run dev` in `frontend`.
2. Resize browser between 320px and full width; stat cards should wrap cleanly.
3. Verify focus outlines appear when tabbing through form fields & buttons.

### Test on Mobile / Emulation
1. Open Chrome DevTools (F12) > Toggle Device Toolbar.
2. Try presets: iPhone SE, Pixel 7, iPad.
3. Ensure headings fit (no horizontal scroll) and job cards stack vertically.

### Real Device
1. Optionally expose via `ngrok http 5173` for external phone testing.
2. Confirm gradient readability in bright light; adjust if needed in `App.css`.

### Accessibility Quick Checks
- Press Tab: visible purple outline should appear.
- Check prefers-reduced-motion: set OS reduced motion; animations should minimize.
- Contrast: ensure button gradient text is legible (WCAG AA ~ contrast > 4.5).

### Future Responsive Ideas
- Replace custom CSS grid with CSS container queries once widely supported.
- Add a collapsible mobile nav & persistent footer actions.
- Implement dark/light theme toggle using `prefers-color-scheme` fallback.

---

## Support

For issues or questions, check:
- Backend logs in backend terminal
- Frontend logs in frontend terminal
- Browser console (F12) for React errors

---

**Enjoy your Interview Management System!** 🚀
