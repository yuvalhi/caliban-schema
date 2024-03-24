# Full-Stack GraphQL Example with Scala and React

## Overview

This project provides a comprehensive example of building a full-stack GraphQL application using Scala on the server-side and React on the client-side. The focus of this project is to demonstrate an end-to-end flow of generating server and client code from a GraphQL schema, implementing the server logic in Scala using the Caliban library, and connecting to it from a React client application. 

The server is built with http4s and Caliban, showcasing how to set up a GraphQL server in Scala that automatically generates types and resolvers based on a GraphQL schema file. The React client uses Apollo Client to interact with the GraphQL server, demonstrating code generation for client-side queries and mutations.

This example is aimed at developers interested in the benefits of GraphQL for full-stack development, especially the powerful feature of generating type-safe code from a GraphQL schema, ensuring consistency between the frontend and backend and reducing the potential for errors.

## Project Structure

- **`/server`**: Contains the Scala http4s and Caliban server application.
  - `/src/main/scala`: Scala application source files.
  - `/src/main/resources/schema.graphql`: The GraphQL schema defining the API.
- **`/client`**: Contains the React client application.
  - `/src`: React application source files, including components and Apollo Client setup.
- **`README.md`**: This file, providing an overview of the project and setup instructions.

## Key Features

- **GraphQL Schema-First Development**: Demonstrates defining the API contract with a GraphQL schema and generating code on both server and client sides.
- **Scala Server with Caliban**: Showcases how to use Caliban for creating a type-safe GraphQL server in Scala that automatically generates resolvers and types from the GraphQL schema.
- **React Client with Apollo Client**: Demonstrates setting up Apollo Client in a React application for interacting with the GraphQL server, including query and mutation operations.
- **Automatic Code Generation**: Highlights the setup for generating Scala server code and TypeScript client code directly from the GraphQL schema, facilitating a seamless development workflow.

## Getting Started

### Prerequisites

- JDK 8 or higher for the Scala server
- sbt (Scala Build Tool) for building and running the Scala server
- Node.js and npm for the React client

### Running the Server

1. Navigate to the `/server` directory.
2. Run `sbt compile` to generate Scala types and resolvers from the GraphQL schema.
3. Start the server with `sbt run`.

### Running the Client

1. Navigate to the `/client` directory.
2. Install dependencies with `npm install`.
3. Run `npm start` to launch the React application.

# testing server side with curl/postman calls

use the following curl/postman calls to test server functionality

### get all books
```bash
curl --location 'http://localhost:8088/api/graphql' \
--header 'token: hello' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {\n    books {\n        id\n        title\n        ... @defer(label: \"authordelay\"){\n            author\n        }\n    }\n}","variables":{}}'
```

### get specific book 
```bash
curl --location 'http://localhost:8088/api/graphql' \
--header 'token: hello' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {\n    books(title: \"1984\") {\n        id\n        title\n        ... @defer(label: \"authordelay\"){\n            author\n        }\n    }\n}","variables":{}}'
```

### book not found error
```bash
curl --location 'http://localhost:8088/api/graphql' \
--header 'token: hello' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {\n    books(title: \"19841\") {\n        id\n        title\n        ... @defer(label: \"authordelay\"){\n            author\n        }\n    }\n}","variables":{}}'
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests, open issues, or suggest improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This README provides a basic template to get started. Feel free to customize it according to your project's specific needs and details.



