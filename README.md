# Apollo GraphQL Tutorial - stage1

Shows the moving parts of a GraphQL Server in a single file, to enable easy editing of resolvers, schema, queries, mutations etc.  Start the server as follows:
```console
git clone https://github.com/dav-rob/apollo-graphql-stage1
cd apollo-graphql-stage1/
yarn install
yarn start
```
Launch your browser at http://localhost:4000, to make queries to the GraphQL server. Edit index.js to see changes reflected as you code.

Coming from a backend-first bias, this series aims to help understanding and demonstrate how conventional, Java-centric, development model can be adapted in the GraphQL eco-system.  It aims to provide a clear separation of responsibilities, understandability, and extensibility, with a strong emphasis on avoiding n+1 query issues for queries that follow joins, while giving React developers the simplicity of a GraphQL API.

This code demonstrates the following:
- Back-end data models wrapped by a DataLoader, to retrieve data.
- A schema defining a front-end data model for queries and mutations.
- Resolvers to map retreived data to the schema.
- A context object containing data-models and other assets required by multiple resolvers. 


Thanks to FongX777 here, https://codesandbox.io/u/FongX777, for the inspiration.
