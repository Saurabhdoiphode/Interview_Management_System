import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { TokenPayload } from '../types';

// Shared JWT options (HS256 currently; TODO migrate to RS256 with rotating keys & JWKS)
const commonOptions = {
  issuer: 'interview-mgmt',
  audience: 'interview-mgmt-client'
};

// Cast expiresIn to acceptable type to satisfy jsonwebtoken typings
const accessOptions: SignOptions = { expiresIn: config.jwt.expire as any, ...commonOptions };
const refreshOptions: SignOptions = { expiresIn: config.jwt.refreshExpire as any, ...commonOptions };

export const generateAccessToken = (payload: TokenPayload): string =>
  jwt.sign({ ...payload }, config.jwt.secret, accessOptions);

export const generateRefreshToken = (payload: TokenPayload): string =>
  jwt.sign({ ...payload }, config.jwt.refreshSecret, refreshOptions);

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, config.jwt.secret, commonOptions) as TokenPayload;

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, config.jwt.refreshSecret, commonOptions) as TokenPayload;

export const generateTokens = (payload: TokenPayload) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});
