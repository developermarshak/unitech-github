import { inject, injectable } from 'tsyringe';
import { ulid } from 'ulid';
import { DataSource, Repository } from 'typeorm';
import { Repository as RepositoryEntity } from '../../../entities/Repository';
import { EventBus } from '../../../events/eventBus';

@injectable()
export class CreateRepositoryCommand {
  private repositoryRepository: Repository<RepositoryEntity>;
  
  constructor(
    @inject('DataSource') private readonly dataSource: DataSource,
    @inject('EventBus') private readonly eventBus: EventBus,
  ) {
    this.repositoryRepository = this.dataSource.getRepository(RepositoryEntity);
  }

  async execute(data: { userId: string; projectPath: string }) {
    const id = ulid();
    const repository = this.repositoryRepository.create({
      id,
      userId: data.userId,
      projectPath: data.projectPath,
    });

    await this.repositoryRepository.save(repository);

    this.eventBus.emit('repository.created', {
      id,
      userId: data.userId,
      projectPath: data.projectPath,
    });
  }
} 