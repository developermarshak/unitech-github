import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { Repository as RepositoryEntity } from '../../../entities/Repository';

@injectable()
export class GetRepositoriesByUserIdQuery {
  private repositoryRepository: Repository<RepositoryEntity>;

  constructor(@inject('DataSource') private readonly dataSource: DataSource) {
    this.repositoryRepository = this.dataSource.getRepository(RepositoryEntity);
  }

  async execute(userId: string) {
    return this.repositoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }
} 