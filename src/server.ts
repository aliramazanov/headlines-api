import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import { LocalStrategyInstance } from "./auth/localstrategy";
import { AppDataSource } from "./datasource";
import { authMiddleware } from "./middleware/authMiddleware";
import { loggingMiddleware } from "./middleware/loggingMiddleware";
import authRouter from "./routes/authroute";
import newsRouter from "./routes/newsroute";
import { User } from "./schema/user";

const startServer = async () => {
  try {
    await AppDataSource.initialize();

    console.log("Connection to database established!");

    dotenv.config();
    const app = express();
    app.use(passport.initialize());
    app.use(express.json());
    app.use(loggingMiddleware);

    passport.serializeUser((user: any, done) => {
      try {
        if (!user || !user.id) {
          throw new Error("Invalid user object for serialization");
        }
        done(null, user.id);
      } catch (error) {
        console.error("Error during serialization:", error);
        done(error);
      }
    });

    passport.deserializeUser(async (id: number, done) => {
      try {
        const userRepository = AppDataSource.getRepository(User);

        if (!id) {
          throw new Error("Invalid user ID for deserialization");
        }

        const user = await userRepository.findOne({ where: { id } });

        if (user) {
          done(null, user);
        } else {
          console.error("User not found during deserialization");
          done(new Error("User does not exist"));
        }
      } catch (err) {
        console.error("Error during deserialization:", err);
        done(err);
      }
    });

    passport.use(LocalStrategyInstance);

    app.use((req, res, next) => {
      if (req.path === "/auth/login" || req.path === "/auth/register") {
        next();
      } else {
        authMiddleware(req, res, next);
      }
    });

    app.use(authRouter);
    app.use(newsRouter);

    const port: number = parseInt(process.env.PORT || "9595", 10);
    const hostname: string = process.env.HOST || "localhost";

    app.listen(port, hostname, () => {
      console.log(`Server is up & running on http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error("Error in connection to database:", error);
  }
};

startServer();
