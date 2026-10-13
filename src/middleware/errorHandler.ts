import type { ErrorRequestHandler } from 'express';
import AppError from '../utils/AppError';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

  const message =
    err instanceof Error && !(err instanceof AppError)
      ? err.message
      : err instanceof AppError
        ? err.message
        : 'Something went wrong';

  res.status(statusCode).json({
    status,
    message: process.env.NODE_ENV === 'production' && statusCode >= 500 ? 'Something went wrong' : message,
  });
};

export default errorHandler;
