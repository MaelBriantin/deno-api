import { Client } from "mysql";
import * as repo from "./repository.ts";
import { User } from "./model.ts";
import { hash } from "../../shared/services/hashService.ts";
import { UserError, UserErrorCode } from "./error.ts";

interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const getAllUsersService = async (client: Client) => {
  const users = await repo.getAllUsers(client);
  if (!users || users.length === 0) {
    return {
      users: [],
      error: new UserError(
        "No users found",
        UserErrorCode.USERS_NOT_FOUND,
      ).toJson(),
    };
  }
  return {
    users: users,
    error: null,
  };
};

export const getUserByIdService = async (client: Client, id: string) => {
  const user = await repo.getUserById(client, id);
  if (!user) {
    return {
      user: null,
      error: new UserError(
        "User not found",
        UserErrorCode.USER_NOT_FOUND,
      ).toJson(),
    };
  }
  return {
    user: user,
    error: null,
  };
};

export const getUserByEmailService = async (client: Client, email: string) => {
  const user = await repo.getUserByEmail(client, email);
  if (!user) {
    return {
      user: null,
      error: new UserError(
        "User not found",
        UserErrorCode.USER_NOT_FOUND,
      ).toJson(),
    };
  }
  return {
    user: user,
    error: null,
  };
};

export const createUserService = async (
  client: Client,
  { firstName, lastName, email, password }: CreateUserInput,
) => {
  const validationError = validateUserInput(
    firstName,
    lastName,
    email,
    password,
  );
  if (validationError) {
    return {
      user: null,
      error: validationError.toJson(),
    };
  }
  const userInput: User = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
  };
  const isExistingUser = await repo.getUserByEmail(client, email);
  if (isExistingUser) {
    return {
      user: null,
      error: new UserError("Email already in use", UserErrorCode.EMAIL_CONFLICT)
        .toJson(),
    };
  }
  const { salt, hashedPassword } = hash(password);
  const user = await repo.insertUser(client, userInput, hashedPassword, salt);
  return { user };
};

const validateUserInput = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): UserError | null => {
  if (!firstName || typeof firstName !== "string") {
    return new UserError(
      "Invalid user first name",
      UserErrorCode.INVALID_FIRST_NAME,
    );
  }
  if (!lastName || typeof lastName !== "string") {
    return new UserError(
      "Invalid user last name",
      UserErrorCode.INVALID_LAST_NAME,
    );
  }
  if (!password || typeof password !== "string") {
    return new UserError(
      "Invalid user password",
      UserErrorCode.INVALID_PASSWORD,
    );
  }
  if (!email || typeof email !== "string") {
    return new UserError(
      "Invalid user email",
      UserErrorCode.INVALID_EMAIL,
    );
  }
  return null;
};
