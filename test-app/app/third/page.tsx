'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default function ThirdPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data.products));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="relative flex place-items-center mb-16">
        <Image
          className="relative dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} 
               className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 
                        hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
            <p className="text-lg font-bold mb-2">{product.price} ₽</p>
            <p className="text-base mb-4">{product.description}</p>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category: string) => (
                <span 
                  key={category} 
                  className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 