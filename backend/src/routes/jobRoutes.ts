import { Router } from 'express';
import { body, param } from 'express-validator';
import * as jobController from '../controllers/jobController';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validate from '../middleware/validate';
import { UserRole } from '../types';

const router = Router();

// Validation rules
const createJobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('employmentType').isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Invalid employment type'),
  body('experienceLevel').isIn(['entry', 'mid', 'senior', 'lead', 'executive']).withMessage('Invalid experience level'),
  body('salaryRange.min').isNumeric().withMessage('Minimum salary must be a number'),
  body('salaryRange.max').isNumeric().withMessage('Maximum salary must be a number'),
  body('openings').isInt({ min: 1 }).withMessage('Openings must be at least 1'),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid job ID')];

// Routes
router.post(
  '/',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.HR_MANAGER, UserRole.HIRING_MANAGER),
  validate(createJobValidation),
  jobController.createJob
);

router.get('/', authenticate, jobController.getAllJobs);
router.get('/stats', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.HR_MANAGER), jobController.getJobStats);
router.get('/:id', authenticate, validate(idValidation), jobController.getJobById);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.HR_MANAGER, UserRole.HIRING_MANAGER),
  validate(idValidation),
  jobController.updateJob
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.HR_MANAGER),
  validate(idValidation),
  jobController.updateJobStatus
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.HR_MANAGER),
  validate(idValidation),
  jobController.deleteJob
);

export default router;
