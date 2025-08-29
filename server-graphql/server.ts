import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { format, subDays } from 'date-fns';

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products: [Product!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`;

interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

interface KPI {
  date: string;
  stock: number;
  demand: number;
}

const resolvers = {
  Query: {
    products: (): Product[] => {
      return [
        { "id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120 },
        { "id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80 },
        { "id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80 },
        { "id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120 }
      ];
    },
    kpis: (parent: any, { range }: { range: string }): KPI[] => {
      const kpiData: KPI[] = [];
      let daysToGenerate = 0;

      switch (range) {
        case '7d':
          daysToGenerate = 7;
          break;
        case '14d':
          daysToGenerate = 14;
          break;
        case '30d':
          daysToGenerate = 30;
          break;
        default:
          return [];
      }

      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const formattedDate = format(date, 'yyyy-MM-dd');

        const stock = 15000 + Math.floor(Math.random() * 2000) - 1000;
        const demand = 12500 + Math.floor(Math.random() * 1500) - 750;

        kpiData.push({
          date: formattedDate,
          stock,
          demand,
        });
      }

      return kpiData;
    },
  },
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const app : any = express();
  await server.start();
  app.use(cors());
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer();