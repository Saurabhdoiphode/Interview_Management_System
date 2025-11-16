import { Response, NextFunction } from 'express';
import { Job } from '../models';
import { sendSuccessResponse, NotFoundError, ForbiddenError } from '../utils/errors';
import { RequestWithUser, JobStatus, UserRole } from '../types';

export const createJob = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user?.userId,
      hiringManager: req.body.hiringManager || req.user?.userId,
    };

    const job = await Job.create(jobData);
    sendSuccessResponse(res, job, 'Job created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, department, location, page = 1, limit = 10, search } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (department) query.department = department;
    if (location) query.location = location;
    if (search) {
      query.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(query)
      .populate('hiringManager', 'firstName lastName email')
      .populate('recruiters', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    sendSuccessResponse(res, {
      jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('hiringManager', 'firstName lastName email department')
      .populate('recruiters', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName');

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    sendSuccessResponse(res, job);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Check permissions
    if (
      req.user?.role !== UserRole.SUPER_ADMIN &&
      req.user?.role !== UserRole.HR_MANAGER &&
      job.createdBy.toString() !== req.user?.userId
    ) {
      throw new ForbiddenError('You do not have permission to update this job');
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    sendSuccessResponse(res, updatedJob, 'Job updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Check permissions
    if (req.user?.role !== UserRole.SUPER_ADMIN && req.user?.role !== UserRole.HR_MANAGER) {
      throw new ForbiddenError('You do not have permission to delete this job');
    }

    await Job.findByIdAndDelete(req.params.id);

    sendSuccessResponse(res, null, 'Job deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body;

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    sendSuccessResponse(res, job, 'Job status updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getJobStats = async (_req: RequestWithUser, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Job.countDocuments();
    const open = await Job.countDocuments({ status: JobStatus.OPEN });
    const closed = await Job.countDocuments({ status: JobStatus.CLOSED });

    sendSuccessResponse(res, {
      total,
      open,
      closed,
      byStatus: stats,
    });
  } catch (error) {
    _next(error as any);
  }
};
