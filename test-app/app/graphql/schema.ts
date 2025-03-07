import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Product {
    id: Int!
    name: String!
    price: Float!
    description: String!
    categories: [String!]!
  }

  type Query {
    products: [Product!]!
    productBasicInfo: [ProductBasicInfo!]!
    productDetails: [ProductDetails!]!
  }

  type ProductBasicInfo {
    id: Int!
    name: String!
    price: Float!
  }

  type ProductDetails {
    id: Int!
    name: String!
    description: String!
  }
`; 