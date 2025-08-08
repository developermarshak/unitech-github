import { inject, injectable } from "tsyringe";
import { DataSource, Repository } from "typeorm";
import { Repository as RepositoryEntity } from "../../../entities/Repository.js";
import { RepositoryNotFoundError } from "../../../errors/RepositoryNotFoundError.js";

@injectable()
export class DeleteRepositoryCommand {
  private repositoryRepository: Repository<RepositoryEntity>;

  constructor(@inject("DataSource") private readonly dataSource: DataSource) {
    this.repositoryRepository = this.dataSource.getRepository(RepositoryEntity);
  }

  async execute(data: { id: string; userId: string }): Promise<void> {
    const result = await this.repositoryRepository.delete({
      id: data.id,
      userId: data.userId,
    });

    if (result.affected === 0) {
      throw new RepositoryNotFoundError();
    }
  }
}
