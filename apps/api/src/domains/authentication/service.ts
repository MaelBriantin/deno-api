import jwt from "jsonwebtoken";
import { Client } from "mysql";
import { getAuthenticationRowByEmail } from "./repository.ts";
import { compare as checkPassword } from "../../shared/services/hashService.ts";
import { getUserByEmail } from "../users/repository.ts";
import { getSecretKey } from "../../shared/config/secret.ts";

const SECRET_KEY = getSecretKey();

const getJwtTokenDuration = (): number => {
  const duration = Deno.env.get("JWT_TOKEN_DURATION");
  if (!duration) {
    throw new Error("JWT_TOKEN_DURATION is not defined in the environment variables");
  }
  const parsedDuration = parseInt(duration, 10);
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    throw new Error("JWT_TOKEN_DURATION must be a positive integer");
  }
  return parsedDuration;
};

export const generateJwtToken = (email: string): string => {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: getJwtTokenDuration() });
};

export const validateUserCredentials = async (
  client: Client,
  email: string,
  password: string,
) => {
  const authRow = await getAuthenticationRowByEmail(client, email);
  if (!authRow) {
    throw new Error("User not found");
  }

  const isPasswordValid = checkPassword(password, authRow.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return authRow;
};

export const fetchUserByEmail = async (client: Client, email: string) => {
  const user = await getUserByEmail(client, email);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
