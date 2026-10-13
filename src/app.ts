import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import errorHandler from './middleware/errorHandler';
import routes from './routes';
import AppError from './utils/AppError';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check 
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

//  API routes 
app.use('/api/v1', routes);

//  Unmatched routes 
app.use((req, _res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

//  Global error handler 
app.use(errorHandler);

export default app;

