import { Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { RequestWithUser } from '../types';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: RequestWithUser, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('You do not have permission to perform this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
