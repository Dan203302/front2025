'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/app/components/Modal";
import Chat from "@/app/components/Chat";

async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    getProducts().then(data => setProducts(data.products));
  }, []);

  const refreshProducts = async () => {
    const data = await getProducts();
    setProducts(data.products);
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      categories: (formData.get('categories') as string).split(',').map(c => c.trim())
    };

    try {
      await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: { 'Content-Type': 'application/json' }
      });
      setIsAddModalOpen(false);
      await refreshProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updateData = {
      id: Number(formData.get('id')),
      name: formData.get('name'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      categories: (formData.get('categories') as string).split(',').map(c => c.trim())
    };

    await fetch('http://localhost:3000/api/products', {
      method: 'PUT',
      body: JSON.stringify(updateData),
      headers: { 'Content-Type': 'application/json' }
    });
    setIsEditModalOpen(false);
    await refreshProducts();
  };

  const handleDeleteProduct = async (id: number) => {
    await fetch('http://localhost:3000/api/products', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    });
    await refreshProducts();
  };

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

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-8 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Добавить товар
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} 
               className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 
                        hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setIsEditModalOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
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

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Добавить товар"
      >
        <form onSubmit={handleAddProduct}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Название"
              className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Цена"
              className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Описание"
              className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800"
              required
            />
            <input
              type="text"
              name="categories"
              placeholder="Категории (через запятую)"
              className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Добавить
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактировать товар"
      >
        {editingProduct && (
          <form onSubmit={handleUpdateProduct}>
            <input type="hidden" name="id" value={editingProduct.id} />
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                defaultValue={editingProduct.name}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800"
                required
              />
              <input
                type="number"
                name="price"
                defaultValue={editingProduct.price}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800"
                required
              />
              <input
                type="text"
                name="description"
                defaultValue={editingProduct.description}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800"
                required
              />
              <input
                type="text"
                name="categories"
                defaultValue={editingProduct.categories.join(', ')}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Сохранить
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Chat isAdmin={true} />
    </main>
  );
}
