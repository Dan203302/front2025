import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/products.json');

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  categories: string[];
}

async function readProductsFile() {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

async function writeProductsFile(products: any) {
  await fs.writeFile(dataFilePath, JSON.stringify({ products }, null, 2));
}

export async function GET() {
  const data = await readProductsFile();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const data = await readProductsFile();
    const newProduct = await request.json();
    
    const updatedProducts = [
      ...data.products,
      { ...newProduct, id: Math.max(...data.products.map((p: Product) => p.id)) + 1 }
    ];

    await writeProductsFile(updatedProducts);
    return NextResponse.json({ message: 'Товар добавлен', products: updatedProducts });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при добавлении товара' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await readProductsFile();
    const updateData = await request.json();
    
    const updatedProducts = data.products.map((product: Product) => 
      product.id === updateData.id ? { ...product, ...updateData } : product
    );

    await writeProductsFile(updatedProducts);
    return NextResponse.json({ message: 'Товар обновлен', products: updatedProducts });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при обновлении товара' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await readProductsFile();
    const { id } = await request.json();
    
    const updatedProducts = data.products.filter((product: Product) => product.id !== id);

    await writeProductsFile(updatedProducts);
    return NextResponse.json({ message: 'Товар удален', products: updatedProducts });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при удалении товара' }, { status: 400 });
  }
}