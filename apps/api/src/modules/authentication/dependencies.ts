import { createDbClient } from "#common/config/db.ts";
import { createAuthenticationRepository } from "#modules/authentication/infrastructure/authenticationRepository.ts";
import { createAuthenticationService } from "#modules/authentication/application/authenticationService.ts";
import { createAuthenticationController } from "./api/authenticationController.ts";
import { getUserService } from "../users/dependencies.ts";

export const getAuthenticationRepository = async () => {
  const client = await createDbClient();
  return createAuthenticationRepository(client);
};

export const getAuthenticationService = async () => {
  const client = await createDbClient();
  const authRepository = createAuthenticationRepository(client);
  return createAuthenticationService(authRepository);
};

export const getAuthenticationController = async () => {
  const authService = await getAuthenticationService();
  const userService = await getUserService();
  return createAuthenticationController(authService, userService);
};
