import type { RequestHandler } from 'express';
import type Joi from 'joi';
import AppError from '../utils/AppError';

export default function validate(
  schema: Joi.ObjectSchema,
  property: 'body' | 'params' | 'query' = 'body'
): RequestHandler {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // report every problem, not just the first
      stripUnknown: true, // drop fields the schema doesn't declare
    });

    if (error) {
      const message = error.details.map((d) => d.message).join('; ');
      return next(new AppError(`Validation error: ${message}`, 400));
    }

    req[property] = value;
    next();
  };
}

