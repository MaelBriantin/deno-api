import { getUserService } from "../dependencies.ts";

const userService = await getUserService();

export const userResolvers = {
  Query: {
    allUsers: async () => {
      return await userService.getAllUsers();
    },
    userById: async (_parent: unknown, args: { id: string }) => {
      return await userService.getUserById(args.id);
    },
    userByEmail: async (_parent: unknown, args: { email: string }) => {
      return await userService.getUserByEmail(args.email);
    },
  },
  Mutation: {
    createUser: async (
      _parent: unknown,
      userInput: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      },
    ) => {
      return await userService.createUser(userInput);
    },
  },
};
