import express from 'express';
import { config } from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';
import genreRoutes from './routes/genre.routes.js';
import reviewRoutes from './routes/review.routes.js';
import likeRoutes from './routes/like.routes.js';
import errorHandler from './middleware/errorHandler.js';
import { createError } from './utils/error-response.js';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';

config();

const app = express();
const PORT = +process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      skip: (req, res) => res.statusCode < 400,
    })
  );
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/genres', genreRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/likes', likeRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((req, res, next) => {
  next(createError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

export default app;
