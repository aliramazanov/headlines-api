import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST as string;
const port = process.env.DB_PORT as string;
const username = process.env.DB_USERNAME as string;
const password = process.env.DB_PASSWORD as string;
const database = process.env.DB_DATABASE as string;

const NewsDataSource = new DataSource({
  type: "postgres",
  host,
  port: parseInt(port, 10),
  username,
  password,
  database,
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
});

export { NewsDataSource };
