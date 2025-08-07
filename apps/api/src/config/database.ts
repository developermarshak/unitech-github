import { DataSource } from 'typeorm';
import { User } from '../entities/User.js';
import dotenv from 'dotenv';
import { Repository } from '../entities/Repository.js';
dotenv.config(); //todo: use sep config class

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Repository],
  migrations: ['src/migrations/*.ts']
});