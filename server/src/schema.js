import { gql } from "apollo-server";

export const typeDefs = gql`
  type Person {
    name: String!
    nationality: String
    fullName: String
    age: Int
    occupation: [String!]
    bio: String
    photo: String
  }

  type Query {
    getNationality(name: String!): Person
  }
`;
