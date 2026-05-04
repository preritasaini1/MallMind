import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Recommendation {
    store: String
    location: String
    product: String
    price: Int
  }

  type Navigation {
    distance: Int
    path: [String]
  }

  type ShoppingResult {
    product: String
    color: String
    budget: String
    additional_request: String
    recommendations: [Recommendation]
    navigation: Navigation
  }

  type Query {
    shop(input: String!): ShoppingResult
  }
`);