import mongoose, { Schema, Model } from 'mongoose';
import { JobStatus, IJob } from '../types';

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: [true, 'Employment type is required'],
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      required: [true, 'Experience level is required'],
    },
    salaryRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.DRAFT,
    },
    hiringManager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recruiters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    openings: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    applicationDeadline: {
      type: Date,
    },
    customFields: {
      type: Schema.Types.Mixed,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
jobSchema.index({ status: 1 });
jobSchema.index({ department: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text' });

// Virtual for applications count
jobSchema.virtual('applicationsCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  count: true,
});

const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema);

export default Job;
