import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ValidationError } from '../../errors/ValidationError';
import { createRepositoryRequestSchema, updateRepositoryRequestSchema, getRepositoriesResponseSchema, GetRepositoriesResponse } from '@repo/contracts';
import { CreateRepositoryCommand } from '../../handlers/repository/commands/createRepositoryCommand';
import { UpdateRepositoryCommand } from '../../handlers/repository/commands/updateRepositoryCommand';
import { DeleteRepositoryCommand } from '../../handlers/repository/commands/deleteRepositoryCommand';
import { GetRepositoriesByUserIdQuery } from '../../handlers/repository/queries/getRepositoriesByUserIdQuery';
import { GetRepositoryInfoFromGitHubQuery } from '../../handlers/repository/queries/getRepositoryInfoFromGitHubQuery';
import { InvalidProjectPathError } from '../../errors/InvalidProjectPathError';
import { GetRepositoryByIdAndUserIdQuery } from '../../handlers/repository/queries/getRepositoryByIdAndUserIdQuery';

@injectable()
export class RepositoryController {
  constructor(
    @inject('CreateRepositoryCommand') private readonly createRepositoryCommand: CreateRepositoryCommand,
    @inject('UpdateRepositoryCommand') private readonly updateRepositoryCommand: UpdateRepositoryCommand,
    @inject('DeleteRepositoryCommand') private readonly deleteRepositoryCommand: DeleteRepositoryCommand,
    @inject('GetRepositoriesByUserIdQuery') private readonly getRepositoriesByUserIdQuery: GetRepositoriesByUserIdQuery,
    @inject('GetRepositoryInfoFromGitHubQuery') private readonly getRepositoryInfoFromGitHubQuery: GetRepositoryInfoFromGitHubQuery,
    @inject('GetRepositoryByIdAndUserIdQuery') private readonly getRepositoryByIdAndUserIdQuery: GetRepositoryByIdAndUserIdQuery,
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
        projectPath: data.path
      });

      return res.status(201).send();

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

      const repository = await this.getRepositoryByIdAndUserIdQuery.execute({ id: data.id, userId });

      if (!repository) {
        return res.status(404).json({ error: 'Repository not found' });
      }

      const repoInfo = await this.getRepositoryInfoFromGitHubQuery.execute(repository.projectPath);

      await this.updateRepositoryCommand.execute({
        id: data.id,
        userId,
        repoInfo: repoInfo,
      });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async deleteRepository(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await this.deleteRepositoryCommand.execute({ id, userId });
      res.status(204).send();
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
      
      const repoEntities = await this.getRepositoriesByUserIdQuery.execute(userId);

      const repositories: GetRepositoriesResponse = getRepositoriesResponseSchema.parse(
        repoEntities.map(({ id, projectPath, stars, forks, issues, notExist, createdAt }) => ({
          id,
          projectPath,
          stars,
          forks,
          issues,
          notExist,
          createdAt: createdAt.toISOString(),
        }))
      );
      
      res.status(200).json(repositories);
    } catch (error) {
      next(error);
    }
  }
} 