import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { generateTokens } from '../utils/jwt';
import { generateRandomToken, hashToken } from '../utils/crypto';
import { sendSuccessResponse, UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors';
import { RequestWithUser, UserRole } from '../types';
import emailService from '../services/emailService';
import redisClient from '../config/redis';
import config from '../config';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create verification token
    const verificationToken = generateRandomToken();
    const hashedToken = hashToken(verificationToken);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || UserRole.CANDIDATE,
      emailVerificationToken: hashedToken,
    });

    // Send verification email
    const verificationLink = `${config.clientUrl}/verify-email?token=${verificationToken}`;
    await emailService.sendWelcomeEmail(email, firstName, verificationLink);

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccessResponse(
      res,
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        ...tokens,
      },
      'Registration successful. Please check your email for verification.',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccessResponse(res, {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.substring(7);
    
    if (token) {
      // Blacklist the token
      await redisClient.set(`blacklist:${token}`, '1', 900); // 15 minutes
    }

    sendSuccessResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    // Verify refresh token (implement verifyRefreshToken)
    // For now, simple implementation
    const tokens = generateTokens(req.body.user);

    sendSuccessResponse(res, tokens);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body;
    const hashedToken = hashToken(token);

    const user = await User.findOne({ emailVerificationToken: hashedToken });
    if (!user) {
      throw new NotFoundError('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    sendSuccessResponse(res, null, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      sendSuccessResponse(res, null, 'If an account exists, a password reset email has been sent');
      return;
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    const hashedToken = hashToken(resetToken);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset email
    const resetLink = `${config.clientUrl}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(email, user.firstName, resetLink);

    sendSuccessResponse(res, null, 'Password reset email sent');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new NotFoundError('Invalid or expired reset token');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendSuccessResponse(res, null, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccessResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, phone, department, title } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { firstName, lastName, phone, department, title },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccessResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
