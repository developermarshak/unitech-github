import { inject, injectable } from 'tsyringe';
import { ulid } from 'ulid';
import { DataSource, Repository } from 'typeorm';
import { Repository as RepositoryEntity } from '../../../entities/Repository';
import { GitHubRepositoryInfo } from '../../../services/githubService';

@injectable()
export class CreateRepositoryCommand {
  private repositoryRepository: Repository<RepositoryEntity>;

  constructor(@inject('DataSource') private readonly dataSource: DataSource) {
    this.repositoryRepository = this.dataSource.getRepository(RepositoryEntity);
  }

  async execute(data: { userId: string; repoInfo: GitHubRepositoryInfo }) {
    const id = ulid();
    const repository = this.repositoryRepository.create({
      id,
      userId: data.userId,
      projectPath: data.repoInfo.projectPath,
      stars: data.repoInfo.stars,
      forks: data.repoInfo.forks,
      issues: data.repoInfo.issues,
      notExist: data.repoInfo.notExist
    });
    this.repositoryRepository.save(repository);
  }
} 