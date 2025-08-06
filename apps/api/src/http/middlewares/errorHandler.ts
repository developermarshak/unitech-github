import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../errors/ValidationError';
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError';
import { AuthenticationError } from '../../errors/AuthenticationError';
import { ZodError } from 'zod';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error('Error:', error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof UserAlreadyExistsError) {
    return res.status(409).json({
      error: 'User Already Exists',
      message: error.message,
    });
  }

  if (error instanceof AuthenticationError) {
    return res.status(401).json({
      error: 'Authentication Failed',
      message: error.message,
    });
  }

  // Debug: log the error class type
  console.log('Error class:', error.constructor.name); //ZodError

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      details: error.errors,
    });
  }

  // Default error response
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
} 