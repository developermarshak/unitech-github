import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AppDataSource } from './config/database';
import { CreateSessionUserCommand } from './handlers/user/commands/createSessionUserCommand';
import { UserRepository } from './repositories/userRepository';
import { PasswordHasher } from './security/passwordHasher';
import { CreateUserCommand } from './handlers/user/commands/createUserCommand';

// Initialize TypeORM DataSource
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error: unknown) => {
    console.error('Database connection failed:', error);
  });

container.register<DataSource>('DataSource', { useValue: AppDataSource });
container.register<UserRepository>('UserRepository', {
  useClass: UserRepository,
});
container.register<PasswordHasher>('PasswordHasher', {
  useClass: PasswordHasher,
});
container.register<CreateSessionUserCommand>('CreateSessionUserCommand', {
  useClass: CreateSessionUserCommand,
});

container.register<CreateUserCommand>('CreateUserCommand', {
  useClass: CreateUserCommand,
});

//todo: Some solution to auto register all commands and queries



export { container };
