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

export const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
      }

      type Query {
        users: [User!]!
        userById(id: ID!): User
        userByEmail(email: String!): User
      }

      type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): User!
      }
    `,
    resolvers: {
      Query: {
        users: async (_parent, _args, context: Context) => {
          const users = await getAllUsersService(context.client);
          return users;
        },
        userById: async (_parent, { id }: { id: string }, context: Context) => {
          const user = await getUserByIdService(context.client, id);
          return user;
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
          const user = await createUserService(context.client, userInput);
          return user;
        },
      },
    },
  }),
});
