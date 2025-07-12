import { createSchema, createYoga } from "graphql-yoga";
import { Client } from "mysql";
import {
  createUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
} from "../../domains/users/services.ts";

interface Context {
  client: Client;
}

const schema = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
      }

      type UserResponse {
        user: User
        error: Error
      }

      type UsersResponse {
        users: [User]
        error: Error
      }

      type Query {
        allUsers: UsersResponse!
        userById(id: ID!): UserResponse!
        userByEmail(email: String!): UserResponse!
      }

      type Error {
        message: String!
        code: String
      }

      type CreateUserResult {
        data: User
        error: Error
      }

      type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): CreateUserResult!
      }
    `,
    resolvers: {
      Query: {
        allUsers: async (_parent, _args, context: Context) => {
          const result = await getAllUsersService(context.client);
          return result;
        },
        userById: async (_parent, { id }: { id: string }, context: Context) => {
          const result = await getUserByIdService(context.client, id);
          return result;
        },
        userByEmail: async (
          _parent,
          { email }: { email: string },
          context: Context,
        ) => {
          const user = await getUserByEmailService(context.client, email);
          return user;
        },
      },
      Mutation: {
        createUser: async (
          _parent,
          userInput: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          },
          context: Context,
        ) => {
          return await createUserService(context.client, userInput);
        },
      },
    },
  }),
});

export default schema;
