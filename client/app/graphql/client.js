"use client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/",
});

console.log(
  "🔗 GraphQL URL being used:",
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/"
);

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
