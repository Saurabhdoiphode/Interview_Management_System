import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { RequestWithUser, TokenPayload } from '../types';
import { UnauthorizedError } from '../utils/errors';
import redisClient from '../config/redis';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedError('Token has been invalidated');
    }

    const decoded = verifyAccessToken(token) as TokenPayload;
    (req as RequestWithUser).user = decoded;

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export default authenticate;
