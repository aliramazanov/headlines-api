import * as passportLocal from "passport-local";
import { Repository, getRepository, getConnection } from "typeorm";
import { User } from "../schema/user";

const LocalStrategy = passportLocal.Strategy;

export const LocalStrategyInstance = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const connection = getConnection();

      console.log("Is TypeORM connected?", connection.isConnected);

      if (!connection.isConnected) {
        throw new Error("TypeORM connection is not established.");
      }

      const userRepository: Repository<User> = getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }

      const passwordMatch = await user.checkPassword(password);

      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error: any) {
      if (error.name === "ConnectionNotFoundError") {
        console.error("LocalStrategy error: TypeORM connection not found");
      } else {
        console.error("LocalStrategy error:", error);
      }
      return done(error, false, {
        message: "Server error during authentication",
      });
    }
  }
);

export default LocalStrategyInstance;
