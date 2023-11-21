import { Router, Request, Response } from "express";
import passport from "passport";
import { AppDataSource } from "../datasource";
import { User } from "../schema/user";
import { generateToken } from "../utils/jsonwebtoken";

const authRouter = Router();

authRouter.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || password !== confirmPassword) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const userRepository = AppDataSource.getRepository(User);

    if (!userRepository) {
      throw new Error("User repository not available");
    }

    const user = new User();
    user.email = email;
    await user.setPassword(password);

    const savedUser = await userRepository.save(user);

    if (!savedUser) {
      throw new Error("Failed to save user");
    }

    const token = generateToken(savedUser);
    res.status(201).json({ token });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

authRouter.post("/auth/login", (req, res, next) => {
  const userRepository = AppDataSource.getRepository(User);
  passport.authenticate(
    "local",
    (err: Error, user: User, info: { message: any }) => {
      try {
        console.log("err", err);
        if (err) {
          console.error("Passport authentication error:", err);
          // throw err;
        }
        console.log(2);

        if (!userRepository) {
          throw new Error("User repository not available");
        }
        console.log(3);

        // if (!user) {
        //   return res.status(401).json({
        //     error: "Authentication failed",
        //     details: info.message || "Invalid credentials",
        //   });
        // }
        console.log("user", user);
        const token = generateToken(user);
        res.json({ token });
        console.log(4);
      } catch (error: any) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    }
  )(req, res, next);
});

export default authRouter;
