import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Simple in-memory database
let users = [];
let jobs = [];
let applications = [];

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const user = {
    id: Date.now().toString(),
    firstName: firstName || 'User',
    lastName: lastName || '',
    email,
    password,
    role: role || 'candidate',
    createdAt: new Date(),
  };

  users.push(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: { ...user, password: undefined },
      accessToken: 'token_' + user.id,
      refreshToken: 'refresh_' + user.id,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { ...user, password: undefined },
      accessToken: 'token_' + user.id,
      refreshToken: 'refresh_' + user.id,
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'hiring_manager',
    },
  });
});

// Jobs endpoints
app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    data: {
      jobs: [
        {
          _id: '1',
          title: 'Senior Developer',
          description: 'Looking for experienced developer',
          department: 'Engineering',
          location: 'New York',
          status: 'open',
        },
        {
          _id: '2',
          title: 'Product Manager',
          description: 'Product management role',
          department: 'Product',
          location: 'San Francisco',
          status: 'open',
        },
      ],
      pagination: { page: 1, limit: 10, total: 2, pages: 1 },
    },
  });
});

app.post('/api/jobs', (req, res) => {
  const job = { _id: Date.now().toString(), ...req.body, createdAt: new Date() };
  jobs.push(job);

  res.status(201).json({
    success: true,
    message: 'Job created',
    data: job,
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Interview Management System API', version: '1.0.0', status: 'running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
