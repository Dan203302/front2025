import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const chatFilePath = path.join(process.cwd(), 'app/data/chat.json');

async function readChatFile() {
  try {
    const data = await fs.readFile(chatFilePath, 'utf-8');
    return JSON.parse(data);
  } catch  {
    return { messages: [] };
  }
}

async function writeChatFile(messages: any[]) {
  await fs.writeFile(chatFilePath, JSON.stringify({ messages }, null, 2));
}

export async function GET() {
  const data = await readChatFile();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const message = await request.json();
    const data = await readChatFile();
    data.messages.push(message);
    await writeChatFile(data.messages);
    return NextResponse.json({ message: 'Message saved', messages: data.messages });
  } catch {
    return NextResponse.json({ error: 'Error saving message' }, { status: 400 });
  }
} 