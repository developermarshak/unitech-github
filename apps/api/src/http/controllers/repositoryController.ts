import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ValidationError } from '../../errors/ValidationError';
import { createRepositoryRequestSchema, updateRepositoryRequestSchema } from '@repo/contracts';
import { CreateRepositoryCommand } from '../../handlers/repository/commands/createRepositoryCommand';
import { UpdateRepositoryCommand } from '../../handlers/repository/commands/updateRepositoryCommand';
import { GetRepositoriesByUserIdQuery } from '../../handlers/repository/queries/getRepositoriesByUserIdQuery';
import { GetRepositoryInfoFromGitHubQuery } from '../../handlers/repository/queries/getRepositoryInfoFromGitHubQuery';
import { InvalidProjectPathError } from '../../errors/InvalidProjectPathError';

@injectable()
export class RepositoryController {
  constructor(
    @inject('CreateRepositoryCommand') private readonly createRepositoryCommand: CreateRepositoryCommand,
    @inject('UpdateRepositoryCommand') private readonly updateRepositoryCommand: UpdateRepositoryCommand,
    @inject('GetRepositoriesByUserIdQuery') private readonly getRepositoriesByUserIdQuery: GetRepositoriesByUserIdQuery,
    @inject('GetRepositoryInfoFromGitHubQuery') private readonly getRepositoryInfoFromGitHubQuery: GetRepositoryInfoFromGitHubQuery,
  ) {}

  async addRepository(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRepositoryRequestSchema.parse(req.body);
      
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const repoInfo = await this.getRepositoryInfoFromGitHubQuery.execute(data.path);

      await this.createRepositoryCommand.execute({
        userId,
        repoInfo,
      });

    } catch (error) {
      if (error instanceof InvalidProjectPathError) {
        return next(new ValidationError('Invalid project path', [error.message]));
      }
      
      next(error);
    }
  }

  async updateRepository(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateRepositoryRequestSchema.parse(req.body);

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const repoInfo = await this.getRepositoryInfoFromGitHubQuery.execute(data.path);

      await this.updateRepositoryCommand.execute({
        id: data.id,
        userId,
        repoInfo: repoInfo,
      });
    } catch (error) {
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