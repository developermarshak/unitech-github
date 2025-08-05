import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AppDataSource } from './config/database';
import { UserRepository } from './repositories/userRepository';

// Initialize TypeORM DataSource
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error: unknown) => {
    console.error('Database connection failed:', error);
  });

container.register<DataSource>('DataSource', { useValue: AppDataSource });
container.register<UserRepository>('UserRepository', { useClass: UserRepository });

export { container };