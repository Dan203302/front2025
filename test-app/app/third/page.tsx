'use client';
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Chat from '@/app/components/Chat';

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
});


const GET_BASIC_PRODUCTS = gql`
  query GetBasicProducts {
    productBasicInfo {
      id
      name
      price
    }
  }
`;

export default function ThirdPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await client.query({
        query: GET_BASIC_PRODUCTS
      });
      setProducts(data.productBasicInfo);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Каталог товаров</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} 
               className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 
                        hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
            <p className="text-lg font-bold">{product.price} ₽</p>
          </div>
        ))}
      </div>
      <Chat />
    </main>
  );
} 