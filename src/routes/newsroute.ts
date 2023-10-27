import { Router, Request, Response } from "express";
import { AppDataSource } from "../datasource";
import { Newscards } from "../schema/newscard";

const newsrouter = Router();

newsrouter.get("/api/headlines", async (req: Request, res: Response) => {
  const newscards = await AppDataSource.getRepository(Newscards).find();
  res
    .setHeader("content-type", "application/json")
    .end(JSON.stringify(newscards));
});

export default newsrouter;
