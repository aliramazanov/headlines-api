import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Newscards } from "./schema/newscard";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [Newscards],
  subscribers: [],
  migrations: [],
});
