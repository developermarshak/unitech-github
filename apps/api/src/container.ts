import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AppDataSource } from './config/database';
import { CreateSessionUserCommand } from './handlers/user/commands/createSessionUserCommand';
import { UserRepository } from './repositories/userRepository';
import { RepositoryRepository } from './repositories/repositoryRepository';
import { PasswordHasher } from './security/passwordHasher';
import { CreateUserCommand } from './handlers/user/commands/createUserCommand';
import { CreateRepositoryCommand } from './handlers/repository/commands/createRepositoryCommand';
import { GetRepositoriesByUserIdQuery } from './handlers/repository/queries/getRepositoriesByUserIdQuery';
import { GetRepositoryInfoFromGitHubQuery } from './handlers/repository/queries/getRepositoryInfoFromGitHubQuery';
import { RepositoryController } from './http/controllers/repositoryController';
import { GitHubService } from './services/githubService';

// Initialize TypeORM DataSource
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error: unknown) => {
    console.error('Database connection failed:', error);
  });

container.register<DataSource>('DataSource', { useValue: AppDataSource });
container.register<UserRepository>('UserRepository', {
  useClass: UserRepository,
});
container.register<RepositoryRepository>('RepositoryRepository', {
  useClass: RepositoryRepository,
});
container.register<PasswordHasher>('PasswordHasher', {
  useClass: PasswordHasher,
});
container.register<CreateSessionUserCommand>('CreateSessionUserCommand', {
  useClass: CreateSessionUserCommand,
});

container.register<CreateUserCommand>('CreateUserCommand', {
  useClass: CreateUserCommand,
});

container.register<CreateRepositoryCommand>('CreateRepositoryCommand', {
  useClass: CreateRepositoryCommand,
});

container.register<GetRepositoriesByUserIdQuery>('GetRepositoriesByUserIdQuery', {
  useClass: GetRepositoriesByUserIdQuery,
});

container.register<GetRepositoryInfoFromGitHubQuery>('GetRepositoryInfoFromGitHubQuery', {
  useClass: GetRepositoryInfoFromGitHubQuery,
});

container.register<GitHubService>('GitHubService', {
  useClass: GitHubService,
});

container.register<RepositoryController>('RepositoryController', {
  useClass: RepositoryController,
});

//todo: Some solution to auto register all commands and queries



export { container };
