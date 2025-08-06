import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { ZodError } from 'zod';
import { ValidationError } from '../../errors/ValidationError';
import { createRepositoryRequestSchema } from '@repo/contracts';

@injectable()
export class RepositoryController {
  async addRepository(req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Validate and coerce request body
      const data = createRepositoryRequestSchema.parse(req.body);
      
      // Console log the request as requested
      console.log('Repository request:', data);
      
      // Log the authenticated user information
      console.log('Authenticated user:', req.user);
      
      res.status(201).send();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ValidationError('Invalid request data', error.errors));
      }
      next(error);
    }
  }
} 