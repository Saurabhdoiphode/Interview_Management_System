import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import config from '../config';
import logger from '../utils/logger';
import { EmailTemplate } from '../models';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        html,
      });
      logger.info(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      logger.error('Error sending email:', error);
      return false;
    }
  }

  async sendTemplatedEmail(
    to: string,
    templateName: string,
    variables: Record<string, any>
  ): Promise<boolean> {
    try {
      const template = await EmailTemplate.findOne({ name: templateName, isActive: true });
      
      if (!template) {
        logger.error(`Email template not found: ${templateName}`);
        return false;
      }

      const subjectTemplate = handlebars.compile(template.subject);
      const bodyTemplate = handlebars.compile(template.body);

      const subject = subjectTemplate(variables);
      const html = bodyTemplate(variables);

      return await this.sendEmail(to, subject, html);
    } catch (error) {
      logger.error('Error sending templated email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, name: string, verificationLink: string): Promise<boolean> {
    const html = `
      <h1>Welcome to Interview Management System</h1>
      <p>Hello ${name},</p>
      <p>Thank you for joining our platform. Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;
    return await this.sendEmail(to, 'Welcome to IMS - Verify Your Email', html);
  }

  async sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<boolean> {
    const html = `
      <h1>Password Reset Request</h1>
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    return await this.sendEmail(to, 'Password Reset Request', html);
  }

  async sendInterviewInvitation(
    to: string,
    candidateName: string,
    jobTitle: string,
    interviewDate: Date,
    meetingLink?: string
  ): Promise<boolean> {
    const html = `
      <h1>Interview Invitation</h1>
      <p>Hello ${candidateName},</p>
      <p>We're pleased to invite you for an interview for the position of <strong>${jobTitle}</strong>.</p>
      <p><strong>Date & Time:</strong> ${interviewDate.toLocaleString()}</p>
      ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
      <p>We look forward to speaking with you!</p>
    `;
    return await this.sendEmail(to, `Interview Invitation - ${jobTitle}`, html);
  }

  async sendOfferLetter(
    to: string,
    candidateName: string,
    position: string,
    salary: number,
    startDate: Date
  ): Promise<boolean> {
    const html = `
      <h1>Job Offer</h1>
      <p>Dear ${candidateName},</p>
      <p>We are delighted to offer you the position of <strong>${position}</strong>.</p>
      <p><strong>Salary:</strong> $${salary.toLocaleString()}</p>
      <p><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</p>
      <p>Please review the attached offer letter and let us know your decision.</p>
      <p>Congratulations!</p>
    `;
    return await this.sendEmail(to, `Job Offer - ${position}`, html);
  }

  async sendApplicationStatusUpdate(
    to: string,
    candidateName: string,
    jobTitle: string,
    status: string
  ): Promise<boolean> {
    const html = `
      <h1>Application Status Update</h1>
      <p>Hello ${candidateName},</p>
      <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
      <p><strong>Current Status:</strong> ${status}</p>
      <p>You can view more details by logging into your account.</p>
    `;
    return await this.sendEmail(to, `Application Update - ${jobTitle}`, html);
  }
}

export default new EmailService();
