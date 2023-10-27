import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./datasource";
import newsrouter from "./routes/newsroute";

const app = express();
app.use(express.json());
dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log("Connection to databse established!");
  })
  .catch(() => {
    console.error("Error in connection to database!");
  });

app.use(newsrouter);

const port: number = parseInt(process.env.PORT || "4000", 10);
const hostname: string = process.env.HOST || "localhost";

app.listen(port, hostname, () => {
  console.log(`Server is up & running on http://${hostname}:${port}`);
});
