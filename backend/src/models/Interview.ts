import mongoose, { Schema, Model } from 'mongoose';
import { InterviewStatus, InterviewType, NotificationType, IInterview } from '../types';

const interviewSchema = new Schema<IInterview>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
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
    type: {
      type: String,
      enum: Object.values(InterviewType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InterviewStatus),
      default: InterviewStatus.SCHEDULED,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
      default: 60,
    },
    timezone: {
      type: String,
      required: true,
      default: 'UTC',
    },
    location: {
      type: String,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    interviewers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewKit: {
      questions: [
        {
          question: {
            type: String,
            required: true,
          },
          category: {
            type: String,
            required: true,
          },
          expectedAnswer: String,
        },
      ],
      topics: [String],
      materials: [String],
    },
    feedbackSubmitted: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    notes: {
      type: String,
    },
    recording: {
      type: String,
    },
    reminders: [
      {
        type: {
          type: String,
          enum: Object.values(NotificationType),
        },
        sentAt: {
          type: Date,
        },
        recipient: {
          type: Schema.Types.ObjectId,
          ref: 'User',
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
interviewSchema.index({ scheduledDate: 1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ candidate: 1 });
interviewSchema.index({ interviewers: 1 });
interviewSchema.index({ application: 1 });

// Virtual for feedback
interviewSchema.virtual('feedback', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'interview',
});

const Interview: Model<IInterview> = mongoose.model<IInterview>('Interview', interviewSchema);

export default Interview;
