import mongoose, { Schema, Model } from 'mongoose';
import { OfferStatus, IOffer } from '../types';

const offerSchema = new Schema<IOffer>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OfferStatus),
      default: OfferStatus.DRAFT,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    benefits: [
      {
        type: String,
      },
    ],
    terms: {
      type: String,
    },
    document: {
      type: String,
    },
    approvalWorkflow: [
      {
        approver: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        comments: String,
        approvedAt: Date,
      },
    ],
    sentAt: {
      type: Date,
    },
    respondedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    signature: {
      candidateSignature: String,
      companySignature: String,
      signedAt: Date,
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

// Indexes (remove duplicate on unique field 'application')
offerSchema.index({ candidate: 1 });
offerSchema.index({ status: 1 });
offerSchema.index({ createdAt: -1 });

const Offer: Model<IOffer> = mongoose.model<IOffer>('Offer', offerSchema);

export default Offer;
