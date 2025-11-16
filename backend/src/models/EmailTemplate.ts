import mongoose, { Schema, Model } from 'mongoose';
import { IEmailTemplate } from '../types';

const emailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    variables: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (avoid duplicate index on unique field 'name')
emailTemplateSchema.index({ category: 1 });
emailTemplateSchema.index({ isActive: 1 });

const EmailTemplate: Model<IEmailTemplate> = mongoose.model<IEmailTemplate>('EmailTemplate', emailTemplateSchema);

export default EmailTemplate;
