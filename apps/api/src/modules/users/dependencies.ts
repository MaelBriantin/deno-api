import { createDbClient } from "#common/config/db.ts";
import { createUserController } from "#modules/users/api/userController.ts";
import { createUserService } from "#modules/users/application/userService.ts";
import { createUserRepository } from "#modules/users/infrastructure/userRespository.ts";

export const getUserService = async () => {
  const client = await createDbClient();
  const userRepository = createUserRepository(client);
  return createUserService(userRepository);
};

export const getUserRepository = async () => {
  const client = await createDbClient();
  return createUserRepository(client);
};

export const getUserController = async () => {
  const userService = await getUserService();
  return createUserController(userService);
};
