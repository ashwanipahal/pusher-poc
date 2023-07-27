import { gql } from "apollo-server";

export const typeDefs = gql`
 type ToDoItem {
    id: ID!
    item: String!
    publishedAt: String!
    
  }

  type Query {
    todoItems: [ToDoItem]
  } 

  type Mutation {
    addTodo(item: String!): ToDoItem
  }
`;
