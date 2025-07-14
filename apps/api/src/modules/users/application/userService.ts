import { User } from "../domain/userModel.ts";
import { UserRepositoryInterface } from "../domain/userRepositoryInterface.ts";
import { hash } from "../../../common/services/hashService.ts";
import { UserError, UserErrorCode } from "../../../common/errors/userError.ts";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function createUserService(repo: UserRepositoryInterface) {
  return {
    async getAllUsers() {
      const users = await repo.getAll();
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
        users,
        error: null,
      };
    },
    async getUserById(id: string) {
      const user = await repo.getById(id);
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
        user,
        error: null,
      };
    },
    async getUserByEmail(email: string) {
      const user = await repo.getByEmail(email);
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
        user,
        error: null,
      };
    },
    async createUser({ firstName, lastName, email, password }: CreateUserInput) {
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
      const isExistingUser = await repo.getByEmail(email);
      if (isExistingUser) {
        return {
          user: null,
          error: new UserError("Email already in use", UserErrorCode.EMAIL_CONFLICT)
            .toJson(),
        };
      }
      const { salt, hashedPassword } = hash(password);
      const userInput: User = new User({
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email,
      });
      const user = await repo.insert(userInput, hashedPassword, salt);
      return { user };
    },
  };
}

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