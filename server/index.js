import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { ensureDirectories } from './utils/fileSystem.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { limiter, securityHeaders, compress } from './middleware/security.js';
import chaptersRouter from './routes/chapters.js';
import lessonsRouter from './routes/lessons.js';
import authRouter from './routes/auth.js';
import paymentRouter from './routes/payment.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize data before starting the server
await ensureDirectories();

const app = express();

// Security middleware
app.set('trust proxy', 1);
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));
app.use(securityHeaders);
app.use(limiter);
app.use(compress);

// Request parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use(requestLogger);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/chapters', chaptersRouter);
app.use('/api/chapters/:chapterId/lessons', lessonsRouter);
app.use('/api/payment', paymentRouter);

// Serve index.html for client-side routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Error handling
app.use(errorHandler);

// Start server
const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Data directory:', config.dataDir);
  console.log('CORS origins:', config.corsOrigins);
});