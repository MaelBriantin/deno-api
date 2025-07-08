import jwt from "jsonwebtoken";
import { Client } from "mysql";
import { getAuthenticationRowByEmail } from "./repository.ts";
import { compare as checkPassword } from "../../shared/services/hashService.ts";
import { getUserByEmail } from "../users/repository.ts";
import { getSecretKey } from "../../shared/config/secret.ts";

const SECRET_KEY = getSecretKey();

export const generateJwtToken = (email: string): string => {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
};

export const generateCsrfToken = (): string => {
  return crypto.randomUUID();
};

export const isValidCsrfToken = (
  csrfToken: string | undefined,
  cookieToken: string | undefined,
): boolean => {
  if (!csrfToken || !cookieToken) {
    return false;
  }
  return csrfToken === cookieToken;
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
