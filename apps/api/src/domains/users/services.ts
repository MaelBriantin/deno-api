import { Client } from "mysql";
import * as repo from "./repository.ts";
import { User } from "./model.ts";
import { generateSalt, hash } from "../../shared/services/hashService.ts";

interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const getAllUsersService = async (client: Client) => {
  return await repo.getAllUsers(client);
};

export const getUserByIdService = async (client: Client, id: string) => {
  return await repo.getUserById(client, id);
};

export const getUserByEmailService = async (client: Client, email: string) => {
  return await repo.getUserByEmail(client, email);
};

export const createUserService = async (
  client: Client,
  { firstName, lastName, email, password }: CreateUserInput,
) => {
  const userInput: User = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
  };
  const { salt, hashedPassword } = hash(password);
  const user = await repo.insertUser(client, userInput, hashedPassword, salt);
  return user;
};
