"use client";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/";

console.log("🔗 GraphQL URL being used:", graphqlUrl);

export const client = new ApolloClient({
  uri: graphqlUrl,
  cache: new InMemoryCache(),
});
