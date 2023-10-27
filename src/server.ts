import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./datasource";

const app = express();
dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log("Connection to databse established!");
  })
  .catch(() => {
    console.error("Error in connection to database!");
  });

app.get("/api/headlines", (req: Request, res: Response) => {});

const port: number = parseInt(process.env.PORT || "4000", 10);
const hostname: string = process.env.HOST || "localhost";

app.listen(port, hostname, () => {
  console.log(`Server is up & running on http://${hostname}:${port}`);
});
