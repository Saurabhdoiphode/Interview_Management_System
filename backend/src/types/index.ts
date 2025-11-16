export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  HR_MANAGER = 'hr_manager',
  HIRING_MANAGER = 'hiring_manager',
  INTERVIEWER = 'interviewer',
  CANDIDATE = 'candidate'
}

export enum JobStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  OPEN = 'open',
  CLOSED = 'closed',
  ON_HOLD = 'on_hold'
}

export enum ApplicationStatus {
  APPLIED = 'applied',
  SCREENING = 'screening',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  OFFER_EXTENDED = 'offer_extended',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_REJECTED = 'offer_rejected',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  RESCHEDULED = 'rescheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum InterviewType {
  PHONE_SCREEN = 'phone_screen',
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  TECHNICAL = 'technical',
  HR = 'hr',
  BEHAVIORAL = 'behavioral',
  PANEL = 'panel'
}

export enum AssessmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired'
}

export enum OfferStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired'
}

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
  PUSH = 'push'
}

export enum EventType {
  USER_CREATED = 'user_created',
  JOB_POSTED = 'job_posted',
  APPLICATION_SUBMITTED = 'application_submitted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEW_COMPLETED = 'interview_completed',
  FEEDBACK_SUBMITTED = 'feedback_submitted',
  OFFER_EXTENDED = 'offer_extended',
  OFFER_ACCEPTED = 'offer_accepted',
  CANDIDATE_HIRED = 'candidate_hired'
}

import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  title?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJob {
  _id: Types.ObjectId;
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  status: JobStatus;
  hiringManager: Types.ObjectId;
  recruiters: Types.ObjectId[];
  openings: number;
  applicationDeadline?: Date;
  customFields?: Record<string, any>;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICandidate {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resume?: string;
  resumeData?: {
    skills: string[];
    experience: any[];
    education: any[];
    summary?: string;
  };
  linkedIn?: string;
  portfolio?: string;
  currentPosition?: string;
  currentCompany?: string;
  totalExperience?: number;
  expectedSalary?: number;
  noticePeriod?: number;
  location?: string;
  skills: string[];
  source?: string;
  tags: string[];
  notes?: string;
  isInTalentPool: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication {
  _id: Types.ObjectId;
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  status: ApplicationStatus;
  resume?: string;
  coverLetter?: string;
  answers?: Record<string, any>;
  rating?: number;
  stage?: string;
  assignedTo?: Types.ObjectId[];
  notes?: Array<{
    text: string;
    author: Types.ObjectId;
    createdAt: Date;
  }>;
  timeline: Array<{
    status: ApplicationStatus;
    changedBy: Types.ObjectId;
    changedAt: Date;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterview {
  _id: Types.ObjectId;
  application: Types.ObjectId;
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  type: InterviewType;
  status: InterviewStatus;
  scheduledDate: Date;
  duration: number;
  timezone: string;
  location?: string;
  meetingLink?: string;
  interviewers: Types.ObjectId[];
  organizer: Types.ObjectId;
  interviewKit?: {
    questions: Array<{
      question: string;
      category: string;
      expectedAnswer?: string;
    }>;
    topics: string[];
    materials?: string[];
  };
  feedbackSubmitted: Types.ObjectId[];
  notes?: string;
  recording?: string;
  reminders: Array<{
    type: NotificationType;
    sentAt: Date;
    recipient: Types.ObjectId;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeedback {
  _id: Types.ObjectId;
  interview: Types.ObjectId;
  application: Types.ObjectId;
  submittedBy: Types.ObjectId;
  ratings: Array<{
    criteria: string;
    score: number;
    maxScore: number;
    weight?: number;
  }>;
  overallRating: number;
  strengths?: string[];
  weaknesses?: string[];
  comments?: string;
  recommendation: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no';
  isConfidential: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssessment {
  _id: Types.ObjectId;
  application: Types.ObjectId;
  candidate: Types.ObjectId;
  type: 'technical' | 'aptitude' | 'personality' | 'skills' | 'coding';
  title: string;
  description?: string;
  duration: number;
  status: AssessmentStatus;
  questions?: Array<{
    question: string;
    type: 'mcq' | 'coding' | 'descriptive';
    options?: string[];
    correctAnswer?: any;
    points: number;
  }>;
  answers?: Array<{
    questionId: string;
    answer: any;
    isCorrect?: boolean;
    pointsAwarded?: number;
  }>;
  score?: number;
  maxScore: number;
  startedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOffer {
  _id: Types.ObjectId;
  application: Types.ObjectId;
  candidate: Types.ObjectId;
  job: Types.ObjectId;
  status: OfferStatus;
  position: string;
  department: string;
  startDate?: Date;
  salary: number;
  currency: string;
  benefits?: string[];
  terms?: string;
  document?: string;
  approvalWorkflow: Array<{
    approver: Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    approvedAt?: Date;
  }>;
  sentAt?: Date;
  respondedAt?: Date;
  expiresAt?: Date;
  signature?: {
    candidateSignature?: string;
    companySignature?: string;
    signedAt?: Date;
  };
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface IEmailTemplate {
  _id: Types.ObjectId;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanySettings {
  _id: Types.ObjectId;
  companyName: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  timezone: string;
  currency: string;
  emailSettings: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
  };
  branding: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
  };
  integrations: {
    googleCalendar?: {
      enabled: boolean;
      apiKey?: string;
    };
    zoom?: {
      enabled: boolean;
      apiKey?: string;
    };
  };
  updatedBy: Types.ObjectId;
  updatedAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

import { Request } from 'express';
export interface RequestWithUser extends Request {
  user?: TokenPayload;
  file?: Express.Multer.File;
  files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}
