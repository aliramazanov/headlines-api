import express from "express";
import dotenv from "dotenv";
import { Request, Response } from "express";

const app = express();
dotenv.config();

app.get("/api/headlines", (req: Request, res: Response) => {});

const port: number = parseInt(process.env.PORT || "4000", 10);
const hostname: string = process.env.HOST || "localhost";

app.listen(port, hostname, () => {
  console.log(`Server is up & running on http://${hostname}:${port}`);
});
