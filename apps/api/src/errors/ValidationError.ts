export class ValidationError extends Error {
  constructor(message: string = 'Validation failed', public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
} 