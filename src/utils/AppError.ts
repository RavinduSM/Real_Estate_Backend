/* Custom error so services/controllers can throw with an HTTP status code.
 `isOperational` separates expected failures (not found, forbidden, bad input) from genuine bugs; the error handler only shows operational
 messages to clients in production.*/
export default class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: 'fail' | 'error';
  public readonly isOperational = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}
