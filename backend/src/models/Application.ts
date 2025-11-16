import mongoose, { Schema, Model } from 'mongoose';
import { ApplicationStatus, IApplication } from '../types';

const applicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
    },
    resume: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    answers: {
      type: Schema.Types.Mixed,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    stage: {
      type: String,
      trim: true,
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    notes: [
      {
        text: {
          type: String,
          required: true,
        },
        author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    timeline: [
      {
        status: {
          type: String,
          enum: Object.values(ApplicationStatus),
          required: true,
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ job: 1, status: 1 });

// Add to timeline when status changes
applicationSchema.pre('save', function (this: any, next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      changedBy: this.assignedTo?.[0] as any,
      changedAt: new Date(),
    });
  }
  next();
});

const Application: Model<IApplication> = mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
