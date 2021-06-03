# apollo-graphql-stage1

Shows the moving parts of a GraphQL Server in a single file.  Coming from a backend-first bias, to try to understand and demonstrate how conventional, Java-centric, development model can be adapted in the GraphQL eco-system, to provide a clear separation of responsibilities, understandability, and extensibility, with a strong emphasis on avoiding n+1 query issues for queries that follow joins.
- Data models wrapped by a DataLoader, to retrieve data.
- Resolvers to map retreived data to the schema.
- A schema

Thanks to FongX777 here, https://codesandbox.io/u/FongX777, for the inspiration.
