import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
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
