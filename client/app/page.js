"use client";

import SearchForm from "./components/SearchForm";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./graphql/client"; // Import from your client.js file

console.log("🚀 Page loaded, Apollo Client URI:", client.link.options.uri);

export default function Page() {
  return (
    <ApolloProvider client={client}>
      <main className="p-10">
        <SearchForm />
      </main>
    </ApolloProvider>
  );
}
