import { inject, injectable } from 'tsyringe';
import { RepositoryRepository } from '../../../repositories/repositoryRepository';

@injectable()
export class GetRepositoriesByUserIdQuery {
  constructor(
    @inject('RepositoryRepository') private readonly repositoryRepository: RepositoryRepository,
  ) {}

  async execute(userId: string) {
    return this.repositoryRepository.findByUserId(userId);
  }
} 