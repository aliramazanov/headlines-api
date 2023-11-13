import passportLocal from "passport-local";
import { Repository, getRepository } from "typeorm";
import { User } from "../schema/user";

const LocalStrategy = passportLocal.Strategy;

export const LocalStrategyInstance = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const userRepository: Repository<User> = getRepository(User);

      const user = await userRepository
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .getOne();

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }

      const passwordMatch = await user.checkPassword(password);

      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
