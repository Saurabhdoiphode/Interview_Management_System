const jwt = require('jsonwebtoken');
const config = require('../config');

const accessOptions = { expiresIn: config.jwt.expire };
const refreshOptions = { expiresIn: config.jwt.refreshExpire };

const generateAccessToken = (payload) =>
  jwt.sign({ ...payload }, config.jwt.secret, accessOptions);

const generateRefreshToken = (payload) =>
  jwt.sign({ ...payload }, config.jwt.refreshSecret, refreshOptions);

const verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.secret);

const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret);

const generateTokens = (payload) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens,
};
