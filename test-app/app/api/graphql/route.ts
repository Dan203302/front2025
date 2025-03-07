import { createYoga } from 'graphql-yoga';
import { createSchema } from 'graphql-yoga';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/products.json');

async function readProductsFile() {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categories: string[];
}

const schema = createSchema({
  typeDefs: `
    type Product {
      id: Int!
      name: String!
      price: Float!
      description: String!
      categories: [String!]!
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

    type Query {
      products: [Product!]!
      productBasicInfo: [ProductBasicInfo!]!
      productDetails: [ProductDetails!]!
    }
  `,
  resolvers: {
    Query: {
      products: async () => {
        const data = await readProductsFile();
        return data.products;
      },
      productBasicInfo: async () => {
        const data = await readProductsFile();
        return data.products.map(({ id, name, price }: Product) => ({
          id,
          name,
          price
        }));
      },
      productDetails: async () => {
        const data = await readProductsFile();
        return data.products.map(({ id, name, description }: Product) => ({
          id,
          name,
          description
        }));
      }
    }
  }
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql'
});

export { handleRequest as GET, handleRequest as POST }; 