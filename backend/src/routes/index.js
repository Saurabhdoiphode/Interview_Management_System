const { Router } = require('express');

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes stub
router.post('/auth/login', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Login endpoint - implement backend auth',
    data: {
      user: { id: '1', email: req.body.email },
      accessToken: 'token',
      refreshToken: 'refresh',
    },
  });
});

router.post('/auth/register', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Register endpoint - implement backend registration',
    data: {
      user: req.body,
      accessToken: 'token',
      refreshToken: 'refresh',
    },
  });
});

router.get('/auth/me', (req, res) => {
  res.status(200).json({
    success: true,
    data: { id: '1', email: 'user@example.com', role: 'candidate' },
  });
});

// Jobs routes stub
router.get('/jobs', (req, res) => {
  res.status(200).json({
    success: true,
    data: { jobs: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
  });
});

router.post('/jobs', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Job created',
    data: req.body,
  });
});

module.exports = router;
