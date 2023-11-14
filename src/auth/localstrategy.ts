import passportLocal from "passport-local";
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
      // Ensure that the TypeORM connection is established before accessing the repository
      await getConnection();

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
    } catch (error) {
      console.error("LocalStrategy error:", error);
      return done(error);
    }
  }
);
