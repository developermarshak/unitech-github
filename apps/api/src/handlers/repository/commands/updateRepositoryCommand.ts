import { inject, injectable } from "tsyringe";
import { DataSource, Repository } from "typeorm";
import { Repository as RepositoryEntity } from "../../../entities/Repository.js";
import { GitHubRepositoryInfo } from "../../../services/githubService.js";
import { RepositoryNotFoundError } from "../../../errors/RepositoryNotFoundError.js";

@injectable()
export class UpdateRepositoryCommand {
  private repositoryRepository: Repository<RepositoryEntity>;

  constructor(@inject("DataSource") private readonly dataSource: DataSource) {
    this.repositoryRepository = this.dataSource.getRepository(RepositoryEntity);
  }

  async execute(data: {
    id: string;
    userId: string;
    repoInfo: GitHubRepositoryInfo;
  }): Promise<void> {
    const repository = await this.repositoryRepository.findOne({
      where: { id: data.id, userId: data.userId },
    });

    if (!repository) {
      throw new RepositoryNotFoundError();
    }

    repository.projectPath = data.repoInfo.projectPath;
    repository.stars = data.repoInfo.stars;
    repository.forks = data.repoInfo.forks;
    repository.issues = data.repoInfo.issues;
    repository.notExist = data.repoInfo.notExist;

    await this.repositoryRepository.save(repository);
  }
}
