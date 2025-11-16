import mongoose, { Schema, Model } from 'mongoose';
import { AssessmentStatus, IAssessment } from '../types';

const assessmentSchema = new Schema<IAssessment>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    type: {
      type: String,
      enum: ['technical', 'aptitude', 'personality', 'skills', 'coding'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(AssessmentStatus),
      default: AssessmentStatus.PENDING,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['mcq', 'coding', 'descriptive'],
          required: true,
        },
        options: [String],
        correctAnswer: Schema.Types.Mixed,
        points: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        answer: Schema.Types.Mixed,
        isCorrect: Boolean,
        pointsAwarded: {
          type: Number,
          min: 0,
        },
      },
    ],
    score: {
      type: Number,
      min: 0,
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
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
assessmentSchema.index({ application: 1 });
assessmentSchema.index({ candidate: 1 });
assessmentSchema.index({ status: 1 });
assessmentSchema.index({ expiresAt: 1 });

// Calculate max score before save
assessmentSchema.pre('save', function (this: any, next) {
  if (this.questions && this.questions.length > 0 && !this.maxScore) {
    this.maxScore = this.questions.reduce((total: number, q: any) => total + q.points, 0);
  }
  next();
});
const Assessment: Model<IAssessment> = mongoose.model<IAssessment>('Assessment', assessmentSchema);

export default Assessment;
