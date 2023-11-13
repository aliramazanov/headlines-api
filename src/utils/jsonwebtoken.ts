import jwt from "jsonwebtoken";
import { User } from "../schema/user";

export function generateToken(user: User): string {
  const secretKey = process.env.JWT_SECRET_KEY || "default_secret_key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "12h";

  const token = jwt.sign(
    { userId: user.id, userEmail: user.email },
    secretKey,
    {
      expiresIn,
    }
  );

  return token;
}
