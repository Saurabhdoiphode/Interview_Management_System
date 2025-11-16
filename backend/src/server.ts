import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-expect-error hpp types will resolve after installation
import hpp from 'hpp';
// xss-clean has no TS types; expect-error acceptable for build until custom d.ts added
// @ts-expect-error
import xss from 'xss-clean';
import config from './config';
import connectDB from './config/database';
import routes from './routes';
import errorHandler from './middleware/errorHandler';
import socketService from './sockets';
import logger from './utils/logger';

const app: Application = express();
const server = http.createServer(app);

// Initialize Socket.io
socketService.initialize(server);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", config.clientUrl],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false // disable if using Socket.io without COEP headers
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin or configured client; deny others explicitly
    if (!origin || origin === config.clientUrl) return callback(null, true);
    return callback(new Error('CORS not allowed from this origin'));
  },
  credentials: true,
}));
// Prevent HTTP parameter pollution
app.use(hpp());
// Sanitize user input against XSS
app.use(xss());

// Trust first proxy (for correct IP & secure cookies behind reverse proxy)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  max: config.rateLimit.max,
  windowMs: config.rateLimit.windowMs,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// Routes
app.use('/api', routes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    message: 'Interview Management System API',
    version: '1.0.0',
    status: 'running',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server running in ${config.env} mode on port ${PORT}`);
  logger.info(`Client URL: ${config.clientUrl}`);
});

// Future security enhancements (TODO):
// - Migrate JWT to RS256 with rotating keys (JWKS endpoint)
// - Implement per-user action rate limiting & brute-force protection
// - Add Web Application Firewall (WAF) style validation layer
// - Enforce secure cookies if moving auth from localStorage to HttpOnly cookies

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

export default app;
