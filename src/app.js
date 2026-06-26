import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/index.js';
import { API_PREFIX } from './config/constants.js';
import cache from './config/cache.js';
import movieRoutes from './routes/movie.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

const app = express();

// ---------------------------------------------------------------------------
// Security
// ---------------------------------------------------------------------------
app.use(helmet());

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: config.cors.origin,
    methods: config.cors.methods,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ---------------------------------------------------------------------------
// Compression
// ---------------------------------------------------------------------------
app.use(compression());

// ---------------------------------------------------------------------------
// Body parsing
// ---------------------------------------------------------------------------
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------
if (config.server.isProduction) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// ---------------------------------------------------------------------------
// Root health check
// ---------------------------------------------------------------------------
app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Cymor Movie API',
      version: '1.0.0',
      author: 'Legendary Smiley Cymor',
      status: 'running',
      docs: `${API_PREFIX}/health`,
      cache: cache.stats(),
    },
  });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use(API_PREFIX, movieRoutes);

// ---------------------------------------------------------------------------
// 404 catch-all
// ---------------------------------------------------------------------------
app.use(notFound);

// ---------------------------------------------------------------------------
// Centralised error handler
// ---------------------------------------------------------------------------
app.use(errorHandler);

export default app;
