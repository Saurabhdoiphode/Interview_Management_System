import { Router } from 'express';
import authRoutes from './authRoutes';
import jobRoutes from './jobRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
