import { Router, Request, Response } from "express";
import { AppDataSource } from "../datasource";
import { Newscards } from "../schema/newscard";

const newsRouter = Router();

newsRouter.get("/api/headlines", async (req: Request, res: Response) => {
  try {
    console.log("Request URL:", req.url);

    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const skip = (page - 1) * size;
    const newsCards = await AppDataSource.getRepository(Newscards).find({
      skip: skip,
      take: size,
    });

    res.status(200).json(newsCards);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

newsRouter.get("/api/headlines/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const newsCard = await AppDataSource.getRepository(Newscards).find({
      where: {
        id: id,
      },
    });

    if (newsCard) {
      res
        .setHeader("content-type", "application/json")
        .end(JSON.stringify(newsCard));
    } else {
      res.status(404).json({ error: "News card not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

newsRouter.post("/api/headlines", async (req: Request, res: Response) => {
  try {
    const addednewsCard = AppDataSource.getRepository(Newscards).create(
      req.body
    );
    const result = await AppDataSource.getRepository(Newscards).save(
      addednewsCard
    );

    console.log(`The new card is ${result}`);
    res.status(201).send("New card has been created");
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new card" });
  }
});

newsRouter.put("/api/headlines/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedNewsCard = await AppDataSource.getRepository(
      Newscards
    ).findOneBy({
      id: id,
    });

    if (updatedNewsCard) {
      try {
        AppDataSource.getRepository(Newscards).merge(updatedNewsCard, req.body);
        const result = await AppDataSource.getRepository(Newscards).save(
          updatedNewsCard
        );

        res
          .setHeader("content-type", "application/json")
          .status(200)
          .end(JSON.stringify(result));
      } catch (mergeError) {
        console.error("Error while merging data:", mergeError);
        res.status(500).json({ error: "Failed to update news card" });
      }
    } else {
      res.status(404).send("News Card not found");
    }
  } catch (error) {
    console.error("Error while fetching news card:", error);
    res.status(500).json({ error: "Failed to update news card" });
  }
});

newsRouter.delete("/api/headlines/:id", async (req: Request, res: Response) => {
  try {
    const result = await AppDataSource.getRepository(Newscards).delete(
      req.params.id
    );

    if (result.affected === 1) {
      res.status(200).json({ message: "News card deleted" });
    } else {
      res.status(404).json({ error: "News card not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default newsRouter;
