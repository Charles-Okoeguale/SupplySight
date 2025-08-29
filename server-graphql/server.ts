import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { typeDefs } from './typeDef.js';
import { resolvers } from './resolvers.js';
import { seedDatabase } from './seed.js';
import mongoose from 'mongoose';

async function startApolloServer() {
  await mongoose.connect("mongodb://localhost:27017/inventory");
  console.log("MongoDB connected");
  await seedDatabase();

  const server = new ApolloServer({ typeDefs, resolvers });
  const app : any = express();
  app.use(cors());

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startApolloServer();
