const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { PubSub } = require('graphql-subscriptions');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

const app = express();

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected');
    await server.start();
    server.applyMiddleware({ app });
    return app.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at http://localhost:5000${server.graphqlPath}`);
  })
  .catch(err => {
    console.error(err)
  })
