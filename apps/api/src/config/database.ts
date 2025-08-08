import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import dotenv from "dotenv";
import { Repository } from "../entities/Repository.js";
dotenv.config(); //todo: use sep config class

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: isDev,
  logging: isDev,
  entities: [User, Repository],
  migrations: [
    isProd ? "dist/migrations/*.{js,cjs,mjs}" : "src/migrations/*.ts",
  ],
});
