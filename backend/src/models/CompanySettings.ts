import mongoose, { Schema, Model } from 'mongoose';
import { ICompanySettings } from '../types';

const companySettingsSchema = new Schema<ICompanySettings>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    headquarters: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      required: true,
      default: 'UTC',
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    emailSettings: {
      fromName: {
        type: String,
        required: true,
      },
      fromEmail: {
        type: String,
        required: true,
      },
      replyTo: {
        type: String,
        required: true,
      },
    },
    branding: {
      primaryColor: String,
      secondaryColor: String,
      logo: String,
    },
    integrations: {
      googleCalendar: {
        enabled: {
          type: Boolean,
          default: false,
        },
        apiKey: String,
      },
      zoom: {
        enabled: {
          type: Boolean,
          default: false,
        },
        apiKey: String,
      },
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CompanySettings: Model<ICompanySettings> = mongoose.model<ICompanySettings>('CompanySettings', companySettingsSchema);

export default CompanySettings;
