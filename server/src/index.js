import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import resolvers from "./resolvers.js";

// console.log("Loaded KEY:", process.env.API_NINJAS_KEY);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Use PORT from environment (Render provides this) or fallback to 4000
const PORT = process.env.PORT || 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  cors: {
    origin: true, // Allow all origins for now, you can restrict later
    credentials: true,
  },
});

console.log(`GraphQL Server ready at ${url}`);
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
