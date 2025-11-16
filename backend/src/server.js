import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory fallback storage
const inMemoryStore = {
  users: [],
  jobs: [],
};

let mongoConnected = false;
let User, Job;

// MongoDB Connection with fallback
async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not configured');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    mongoConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    // Define MongoDB models
    const userSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: { type: String, unique: true, sparse: true },
      password: String,
      role: String,
      createdAt: { type: Date, default: Date.now },
    });

    const jobSchema = new mongoose.Schema({
      title: String,
      description: String,
      department: String,
      location: String,
      status: { type: String, default: 'open' },
      createdAt: { type: Date, default: Date.now },
    });

    User = mongoose.model('User', userSchema);
    Job = mongoose.model('Job', jobSchema);
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.log('📦 Using in-memory storage (data will be lost on restart)');
    mongoConnected = false;
  }
}

await connectDB();

// API Functions (work with both MongoDB and in-memory)
async function findUserByEmail(email) {
  if (mongoConnected) {
    return await User.findOne({ email });
  }
  return inMemoryStore.users.find(u => u.email === email);
}

async function findUserByEmailPassword(email, password) {
  if (mongoConnected) {
    return await User.findOne({ email, password });
  }
  return inMemoryStore.users.find(u => u.email === email && u.password === password);
}

async function createUser(userData) {
  if (mongoConnected) {
    const user = new User(userData);
    await user.save();
    return user.toObject();
  }
  const user = { _id: Date.now().toString(), ...userData };
  inMemoryStore.users.push(user);
  return user;
}

async function findAllJobs() {
  if (mongoConnected) {
    return await Job.find();
  }
  return inMemoryStore.jobs;
}

async function createJob(jobData) {
  if (mongoConnected) {
    const job = new Job(jobData);
    await job.save();
    return job.toObject();
  }
  const job = { _id: Date.now().toString(), ...jobData, createdAt: new Date() };
  inMemoryStore.jobs.push(job);
  return job;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await createUser({
      firstName: firstName || 'User',
      lastName: lastName || '',
      email,
      password,
      role: role || 'candidate',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { ...user, password: undefined },
        accessToken: 'token_' + user._id,
        refreshToken: 'refresh_' + user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmailPassword(email, password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { ...user, password: undefined },
        accessToken: 'token_' + user._id,
        refreshToken: 'refresh_' + user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await findAllJobs();
    res.json({
      success: true,
      data: {
        jobs,
        pagination: { page: 1, limit: 10, total: jobs.length, pages: 1 },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const job = await createJob(req.body);

    res.status(201).json({
      success: true,
      message: 'Job created',
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    database: mongoConnected ? 'MongoDB' : 'In-Memory'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: 'Interview Management System API', 
    version: '1.0.0', 
    status: 'running',
    database: mongoConnected ? 'MongoDB' : 'In-Memory'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${mongoConnected ? 'MongoDB' : 'In-Memory Storage'}`);
});
