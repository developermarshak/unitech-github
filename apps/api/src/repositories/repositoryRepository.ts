import { injectable, inject } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Repository as RepositoryEntity } from '../entities/Repository';

@injectable()
export class RepositoryRepository {
  private repositoryRepository: Repository<RepositoryEntity>;

  constructor(@inject('DataSource') private readonly dataSource: DataSource) {
    this.repositoryRepository = this.dataSource.getRepository(RepositoryEntity);
  }

  create(data: { id: string; userId: string; projectPath: string }): Promise<RepositoryEntity> {
    const repository = this.repositoryRepository.create(data);
    return this.repositoryRepository.save(repository);
  }

  findByUserId(userId: string): Promise<RepositoryEntity[]> {
    return this.repositoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }
} 