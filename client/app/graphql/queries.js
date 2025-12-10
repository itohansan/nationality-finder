import { gql } from "@apollo/client";

export const GET_NATIONALITY = gql`
  query GetNationality($name: String!) {
    getNationality(name: $name) {
      name
      nationality
      fullName
      age
      occupation
      bio
      photo
    }
  }
`;
