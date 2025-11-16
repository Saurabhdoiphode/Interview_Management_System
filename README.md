# Interview Management System

A comprehensive full-stack Interview Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Super Admin, HR Manager, Hiring Manager, Interviewer, Candidate)
- User profile management with avatar upload
- Password reset and email verification

### Role-Specific Dashboards
- **HR Dashboard**: Analytics for open positions, pipeline metrics, time-to-hire
- **Hiring Manager**: Team hiring metrics and department overview
- **Candidate Dashboard**: Application status and interview schedule
- Real-time charts and analytics

### Job Management
- Job requisition with approval workflows
- Rich text editor for job descriptions
- Custom application forms
- Multi-channel job posting
- Job status tracking (Draft, Open, Closed)

### Candidate Management
- Comprehensive candidate database with advanced filtering
- Resume parsing and data extraction
- Talent pool for future opportunities
- Bulk operations (email, status updates)
- Complete communication history

### Interview Scheduling
- Calendar integration (Google/Outlook)
- Automated scheduling with timezone support
- Panel interview coordination
- Conflict detection
- Automated email/SMS reminders

### Interview Execution
- Structured interview kits with question banks
- Digital scorecards with rating scales
- Collaborative feedback system
- Video integration (Zoom/Teams)
- Interview notes and recordings

### Assessments & Evaluation
- Pre-built assessment templates
- Skills testing integration
- Automated scoring and ranking
- Code evaluation for technical roles

### Offer & Onboarding
- Offer letter template builder
- Multi-level approval workflows
- E-signature integration
- Onboarding checklist
- Document collection and verification

### Analytics & Reporting
- EEO/OFCCP compliance reporting
- Hiring funnel analytics
- Source effectiveness tracking
- Export capabilities (PDF, Excel, CSV)

### Communication System
- Email templates with dynamic variables
- Bulk email campaigns
- SMS notifications
- Interview reminders
- Automated status update alerts

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Redux Toolkit for state management
- Material-UI components
- Tailwind CSS for styling
- Chart.js for analytics
- Socket.io-client for real-time updates

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time features
- Redis for caching and sessions
- Multer + Cloudinary for file uploads
- Nodemailer for email services

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis (v7 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd interview-management-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
- MongoDB connection string
- JWT secrets
- Email service credentials (SMTP)
- Cloudinary credentials
- Redis URL
- API keys for calendar and video integrations

### 4. Start MongoDB and Redis

**Using Docker:**
```bash
docker-compose up mongodb redis -d
```

**Or install locally and start services**

### 5. Run the application

**Development mode:**
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

**Production mode:**
```bash
npm run build
npm start
```

## 🐳 Docker Deployment

### Build and run all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

## 📁 Project Structure

```
interview-management-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── sockets/        # Socket.io handlers
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Input validation
│   │   └── server.ts       # Entry point
│   ├── uploads/            # Temporary file storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # React components
│   │   ├── features/       # Redux features
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # Entry point
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## 👥 Default Users

After seeding the database, you can login with:

**Super Admin:**
- Email: admin@ims.com
- Password: Admin@123

**HR Manager:**
- Email: hr@ims.com
- Password: HR@123

**Hiring Manager:**
- Email: manager@ims.com
- Password: Manager@123

**Interviewer:**
- Email: interviewer@ims.com
- Password: Interview@123

**Candidate:**
- Email: candidate@ims.com
- Password: Candidate@123

## 🔑 API Documentation

API documentation is available via Swagger UI when running the backend:
- Development: http://localhost:5000/api-docs
- Production: https://your-domain.com/api-docs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test --workspace=backend

# Run frontend tests
npm run test --workspace=frontend

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Variables

Ensure all environment variables are set in your production environment:
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production database URLs
- Set up email service credentials
- Configure Cloudinary for production

### Build

```bash
npm run build
```

### Database Migration

```bash
cd backend
npm run migrate
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For support, email support@interviewmanagement.com or open an issue in the repository.

## 🙏 Acknowledgments

- Material-UI for the component library
- Chart.js for analytics visualization
- Cloudinary for file management
- All open-source contributors
