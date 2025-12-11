import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../src/schema.js";
import resolvers from "../src/resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

await server.start();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Parse body if it's a string
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  // Handle GraphQL request
  const result = await server.executeOperation({
    query: body.query,
    variables: body.variables,
    operationName: body.operationName,
  });

  res.status(200).json(result.body);
}
