import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import resolvers from "./resolvers.js";

console.log("Loaded KEY:", process.env.API_NINJAS_KEY);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`GraphQL Server ready at ${url}`);
