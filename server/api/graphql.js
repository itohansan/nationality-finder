import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../src/schema.js";
import resolvers from "../src/resolvers.js";

let serverInstance;

async function getServer() {
  if (!serverInstance) {
    serverInstance = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
    });
    await serverInstance.start();
  }
  return serverInstance;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Handle GET requests (browser visits)
  if (req.method === "GET") {
    res.status(200).json({
      message: "GraphQL Server is running",
      endpoint: "/api/graphql",
      method: "POST",
      note: "Send POST requests with GraphQL queries to this endpoint",
    });
    return;
  }

  // Handle POST requests (actual GraphQL queries)
  if (req.method === "POST") {
    try {
      const server = await getServer();

      // Parse body
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      // Check if body has query
      if (!body || !body.query) {
        res.status(400).json({
          errors: [{ message: "GraphQL query is required" }],
        });
        return;
      }

      // Execute GraphQL operation
      const result = await server.executeOperation({
        query: body.query,
        variables: body.variables,
        operationName: body.operationName,
      });

      // Send response
      if (result.body.kind === "single") {
        res.status(200).json(result.body.singleResult);
      } else {
        res.status(200).json(result.body);
      }
    } catch (error) {
      console.error("GraphQL Error:", error);
      res.status(500).json({
        errors: [{ message: error.message }],
      });
    }
    return;
  }

  // Handle other methods
  res.status(405).json({ error: "Method not allowed" });
}
