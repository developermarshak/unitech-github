import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { ZodError } from 'zod';
import { ValidationError } from '../../errors/ValidationError';
import { createRepositoryRequestSchema } from '@repo/contracts';

@injectable()
export class RepositoryController {
  async addRepository(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRepositoryRequestSchema.parse(req.body);
      
      const userId = req.user?.id;
      const sessionId = req.user?.sessionId;
      
      console.log('Repository request:', data);
      console.log('User ID:', userId);
      console.log('Session ID:', sessionId);
      
      res.status(201).send();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ValidationError('Invalid request data', error.errors));
      }
      next(error);
    }
  }
} 