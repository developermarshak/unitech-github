import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ZodError } from 'zod';
import { ValidationError } from '../../errors/ValidationError';
import { createRepositoryRequestSchema } from '@repo/contracts';
import { CreateRepositoryCommand } from '../../handlers/repository/commands/createRepositoryCommand';
import { GetRepositoriesByUserIdQuery } from '../../handlers/repository/queries/getRepositoriesByUserIdQuery';

@injectable()
export class RepositoryController {
  constructor(
    @inject('CreateRepositoryCommand') private readonly createRepositoryCommand: CreateRepositoryCommand,
    @inject('GetRepositoriesByUserIdQuery') private readonly getRepositoriesByUserIdQuery: GetRepositoriesByUserIdQuery,
  ) {}

  async addRepository(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRepositoryRequestSchema.parse(req.body);
      
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      await this.createRepositoryCommand.execute({
        userId,
        projectPath: data.path,
      });
      
      res.status(201);
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ValidationError('Invalid request data', error.errors));
      }
      next(error);
    }
  }

  async getRepositoriesByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const repositories = await this.getRepositoriesByUserIdQuery.execute(userId);
      
      res.status(200).json(repositories);
    } catch (error) {
      next(error);
    }
  }
} 