"use client";

import SearchForm from "./components/SearchForm";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./graphql/client";

export default function Page() {
  return (
    <ApolloProvider client={client}>
      <main className="p-10">
        <SearchForm />
      </main>
    </ApolloProvider>
  );
}
