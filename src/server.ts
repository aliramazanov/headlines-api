import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import { LocalStrategyInstance } from "./auth/localstrategy";
import { AppDataSource } from "./datasource";
import { authMiddleware } from "./middleware/authMiddleware";
import { loggingMiddleware } from "./middleware/loggingMiddleware";
import authRouter from "./routes/authroute";
import newsRouter from "./routes/newsroute";

const initializeTypeORMConnection = async () => {
  try {
    console.log("Initializing TypeORM connection...");
    await AppDataSource.initialize();
    console.log("TypeORM connection established!");
  } catch (error: any) {
    console.error("Error in connection to database:", error);
    console.error(error.stack);
    throw error;
  }
};

const initializeServer = async () => {
  try {
    console.log("Initializing server...");

    dotenv.config();

    const requiredEnvVars = ["PORT", "HOST", "JWT_SECRET_KEY"];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`Error: ${envVar} is not defined in the environment.`);
        process.exit(1);
      }
    }

    await initializeTypeORMConnection();
    console.log("TypeORM connection status:", AppDataSource.isConnected);

    const app = express();
    app.use(express.json());

    console.log("Setting up passport serialization and deserialization...");

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

    console.log("Setting up middleware...");

    app.use(passport.initialize());
    app.use((req, res, next) => {
      if (req.path === "/auth/login" || req.path === "/auth/register") {
        next();
      } else {
        authMiddleware(req, res, next);
      }
    });

    console.log("Setting up Passport LocalStrategy...");

    passport.use("local", LocalStrategyInstance);

    console.log("Setting up logging middleware...");

    app.use(loggingMiddleware);

    console.log("Setting up routes...");

    app.use(authRouter);
    app.use(newsRouter);

    const port: number = parseInt(process.env.PORT || "9595", 10);
    const hostname: string = process.env.HOST || "localhost";

    console.log("Starting server...");

    app.listen(port, hostname, () => {
      console.log(`Server is up & running on http://${hostname}:${port}`);
    });
  } catch (error: any) {
    console.error("Error during server initialization:", error);
  }
};

initializeServer();
