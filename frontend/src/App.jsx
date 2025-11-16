import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

const fadeContainer = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: 'easeIn' } }
};

const staggerParent = {
  visible: { transition: { staggerChildren: 0.08 } }
};

const staggerChild = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } }
};

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('candidate');
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
      fetchJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs`);
      const json = await res.json();
      if (json.success) {
        setJobs(json.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        localStorage.setItem('user', JSON.stringify(json.data.user));
        localStorage.setItem('token', json.data.accessToken);
        setMessage('Registration successful!');
        setTimeout(() => {
          setPage('dashboard');
          fetchJobs();
        }, 600);
      } else setMessage(json.message);
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        localStorage.setItem('user', JSON.stringify(json.data.user));
        localStorage.setItem('token', json.data.accessToken);
        setMessage('Login successful!');
        setTimeout(() => {
          setPage('dashboard');
          fetchJobs();
        }, 500);
      } else setMessage(json.message);
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setJobs([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setPage('login');
    setShowPassword(false);
  };

  const LoginForm = () => (
    <motion.div className="container" variants={fadeContainer} initial="hidden" animate="visible" exit="exit">
      <motion.div className="form-box" variants={staggerParent}>
        <motion.h1 variants={staggerChild}>Login</motion.h1>
        {message && (
          <motion.div
            variants={staggerChild}
            className={`message ${message.includes('Error') || message.includes('Invalid') ? 'error' : 'success'}`}
          >
            {message}
          </motion.div>
        )}
        <form onSubmit={handleLogin}>
          <motion.input variants={staggerChild} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <motion.div variants={staggerChild} className="password-field">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
          </motion.div>
          <motion.button variants={staggerChild} type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</motion.button>
        </form>
        <motion.p variants={staggerChild}>Don't have an account? <a href="#" onClick={() => { setPage('register'); setMessage(''); }}>Register</a></motion.p>
      </motion.div>
    </motion.div>
  );

  const RegisterForm = () => (
    <motion.div className="container" variants={fadeContainer} initial="hidden" animate="visible" exit="exit">
      <motion.div className="form-box" variants={staggerParent}>
        <motion.h1 variants={staggerChild}>Register</motion.h1>
        {message && (
          <motion.div
            variants={staggerChild}
            className={`message ${message.includes('Error') || message.includes('already') ? 'error' : 'success'}`}
          >
            {message}
          </motion.div>
        )}
        <form onSubmit={handleRegister}>
          <motion.input variants={staggerChild} type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <motion.input variants={staggerChild} type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <motion.input variants={staggerChild} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <motion.div variants={staggerChild} className="password-field">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
          </motion.div>
          <motion.select variants={staggerChild} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="candidate">Candidate</option>
            <option value="interviewer">Interviewer</option>
            <option value="hiring_manager">Hiring Manager</option>
            <option value="hr">HR Manager</option>
          </motion.select>
          <motion.button variants={staggerChild} type="submit" disabled={loading}>{loading ? 'Registering…' : 'Register'}</motion.button>
        </form>
        <motion.p variants={staggerChild}>Already have an account? <a href="#" onClick={() => { setPage('login'); setMessage(''); }}>Login</a></motion.p>
      </motion.div>
    </motion.div>
  );

  const Dashboard = () => (
    <motion.div className="container" variants={fadeContainer} initial="hidden" animate="visible" exit="exit">
      <motion.div className="dashboard" variants={staggerParent}>
        <motion.div className="header" variants={staggerChild}>
          <div>
            <h1>Welcome, {user?.firstName}!</h1>
            <p>Role: <strong>{user?.role || 'N/A'}</strong></p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </motion.div>
        <motion.div className="stats" variants={staggerParent}>
          {[
            { label: 'Open Positions', value: jobs.length },
            { label: 'Candidates', value: 24 },
            { label: 'Interviews Today', value: 3 },
            { label: 'Offers Sent', value: 5 }
          ].map((s) => (
            <motion.div key={s.label} className="stat-card" variants={staggerChild} whileHover={{ scale: 1.03 }}>
              <h3>{s.label}</h3>
              <p className="stat-value">{s.value}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="jobs-section" variants={staggerChild}>
          <h2>Job Listings</h2>
          <motion.div className="jobs-grid" variants={staggerParent}>
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <motion.div
                  key={job._id}
                  className="job-card"
                  variants={staggerChild}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                >
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <p className="job-meta">{job.location} | {job.department}</p>
                  <span className={`badge ${job.status}`}>{job.status}</span>
                </motion.div>
              ))
            ) : (
              <p className="no-jobs">No jobs available at the moment</p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="app">
      <div className="navbar"><h1>Interview Management System</h1></div>
      <AnimatePresence mode="wait">
        {page === 'login' && <LoginForm key="login" />}
        {page === 'register' && <RegisterForm key="register" />}
        {page === 'dashboard' && user && <Dashboard key="dashboard" />}
      </AnimatePresence>
    </div>
  );
}

export default App;

