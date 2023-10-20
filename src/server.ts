import dotenv from "dotenv";
import express from "express";
import { NewsDataSource } from "./data-source.js";

dotenv.config();
const app = express();
app.use(express.json());

const port: number = parseInt(process.env.PORT || "4000", 10);
const hostname: string = process.env.HOST || "localhost";

NewsDataSource.initialize()
  .then(() => {
    console.log("Connected to the DB 📊");
  })
  .catch((err: any) => {
    console.log(`Error in DB connection ${err}`);
  });

app.get(["/api/newsposts", "/api", "/", ""], async (req, res) => {
  res.send("Hi there!");
});

app.listen(port, hostname, () => {
  console.log(`Server is 🚀 & running on http://${hostname}:${port}`);
});
