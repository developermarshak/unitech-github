import { inject, injectable } from "tsyringe";
import { DataSource, Repository } from "typeorm";
import { Repository as RepositoryEntity } from "../../../entities/Repository.js";

@injectable()
export class GetRepositoryByIdAndUserIdQuery {
  private repositoryRepository: Repository<RepositoryEntity>;

  constructor(@inject("DataSource") private readonly dataSource: DataSource) {
    this.repositoryRepository = this.dataSource.getRepository(RepositoryEntity);
  }

  async execute(data: { id: string; userId: string }) {
    return this.repositoryRepository.findOne({
      where: { id: data.id, userId: data.userId },
    });
  }
}
