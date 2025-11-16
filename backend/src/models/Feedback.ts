import mongoose, { Schema, Model } from 'mongoose';
import { IFeedback } from '../types';

const feedbackSchema = new Schema<IFeedback>(
  {
    interview: {
      type: Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratings: [
      {
        criteria: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
        },
        maxScore: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number,
          min: 0,
          max: 1,
          default: 1,
        },
      },
    ],
    overallRating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    strengths: [
      {
        type: String,
      },
    ],
    weaknesses: [
      {
        type: String,
      },
    ],
    comments: {
      type: String,
    },
    recommendation: {
      type: String,
      enum: ['strong_yes', 'yes', 'maybe', 'no', 'strong_no'],
      required: true,
    },
    isConfidential: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
feedbackSchema.index({ interview: 1, submittedBy: 1 }, { unique: true });
feedbackSchema.index({ application: 1 });
feedbackSchema.index({ submittedBy: 1 });
feedbackSchema.index({ createdAt: -1 });

// Calculate overall rating before save
feedbackSchema.pre('save', function (this: any, next) {
  if (this.ratings && this.ratings.length > 0) {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    this.ratings.forEach((rating: any) => {
      const normalizedScore = (rating.score / rating.maxScore) * 10;
      const weight = rating.weight || 1;
      totalWeightedScore += normalizedScore * weight;
      totalWeight += weight;
    });

    this.overallRating = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }
  next();
});

const Feedback: Model<IFeedback> = mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;
