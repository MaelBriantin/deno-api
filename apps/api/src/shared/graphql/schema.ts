import { createSchema, createYoga } from "graphql-yoga";
import { userResolvers } from "../../domains/users/resolver.ts";
import { graphqlTypesExtractor } from "./graphqlTypesExtractor.ts";

const { rootTypes, userTypes, errorTypes } = graphqlTypesExtractor([
  { rootTypes: "_root.graphql" },
  { userTypes: "user.graphql" },
  { errorTypes: "error.graphql" },
]);

const typeDefs = `
  ${userTypes}
  ${errorTypes}
  ${rootTypes}
`;

const schema = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: {
      ...userResolvers,
    },
  }),
});

export default schema;
