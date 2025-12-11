"use client";

import SearchForm from "./components/SearchForm";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloLink } from "@apollo/client/core";
import { HttpLink } from "@apollo/client/link/http";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
  cache: new InMemoryCache(),
});

export default function Page() {
  return (
    <ApolloProvider client={client}>
      <main className="p-10">
        {/* <h1 className="text-2xl font-bold mb-4">
          Nationality Finder (GraphQL)
        </h1> */}
        <SearchForm />
      </main>
    </ApolloProvider>
  );
}
// Updated Thu Dec 11 07:30:39 WAT 2025
