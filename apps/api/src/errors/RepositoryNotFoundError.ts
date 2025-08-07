export class RepositoryNotFoundError extends Error {
  constructor(message: string = 'Repository not found') {
    super(message);
    this.name = 'RepositoryNotFoundError';
  }
} 