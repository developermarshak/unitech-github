import { inject, injectable } from 'tsyringe';
import { ulid } from 'ulid';
import { RepositoryRepository } from '../../../repositories/repositoryRepository';

@injectable()
export class CreateRepositoryCommand {
  constructor(
    @inject('RepositoryRepository') private readonly repositoryRepository: RepositoryRepository,
  ) {}

  async execute(data: { userId: string; projectPath: string }) {
    const id = ulid();
    return this.repositoryRepository.create({ id, ...data });
  }
} 