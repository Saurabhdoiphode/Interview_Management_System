import mongoose, { Schema, Model } from 'mongoose';
import { ICandidate } from '../types';

const candidateSchema = new Schema<ICandidate>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    resume: {
      type: String,
    },
    resumeData: {
      skills: [String],
      experience: [Schema.Types.Mixed],
      education: [Schema.Types.Mixed],
      summary: String,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    currentPosition: {
      type: String,
      trim: true,
    },
    currentCompany: {
      type: String,
      trim: true,
    },
    totalExperience: {
      type: Number,
      min: 0,
    },
    expectedSalary: {
      type: Number,
      min: 0,
    },
    noticePeriod: {
      type: Number,
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    source: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
    },
    isInTalentPool: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
candidateSchema.index({ email: 1 });
candidateSchema.index({ skills: 1 });
candidateSchema.index({ location: 1 });
candidateSchema.index({ isInTalentPool: 1 });
candidateSchema.index({ createdAt: -1 });
candidateSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Virtual for full name
candidateSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for applications
candidateSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'candidate',
});

const Candidate: Model<ICandidate> = mongoose.model<ICandidate>('Candidate', candidateSchema);

export default Candidate;
