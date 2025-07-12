import {
  createUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
} from "./services.ts";

export const userResolvers = {
  Query: {
    allUsers: async () => {
      return await getAllUsersService();
    },
    userById: async (_parent: unknown, args: { id: string }) => {
      return await getUserByIdService(args.id);
    },
    userByEmail: async (_parent: unknown, args: { email: string }) => {
      return await getUserByEmailService(args.email);
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
      return await createUserService(userInput);
    },
  },
};
