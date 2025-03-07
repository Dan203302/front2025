'use client';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

interface ChatProps {
  isAdmin?: boolean;
}

export default function Chat({ isAdmin = false }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Загрузка истории сообщений при первом рендере
  useEffect(() => {
    fetch('/api/chat')
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages);
      })
      .catch(error => console.error('Error loading chat history:', error));
  }, []);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001');
    
    websocket.onopen = () => {
      console.log('Connected to chat');
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    websocket.onclose = () => {
      console.log('Disconnected from chat');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: isAdmin ? 'Администратор' : 'Пользователь',
      timestamp: Date.now()
    };

    // Отправляем сообщение через WebSocket
    ws.send(JSON.stringify(message));
    
    // Сохраняем сообщение в JSON через API
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }).catch(error => console.error('Error saving message:', error));

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-zinc-900 rounded-lg shadow-lg flex flex-col" 
         style={{ maxHeight: 'calc(100vh - 2rem)' }}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Чат поддержки {isAdmin && '(Админ)'}
        </h3>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
        >
          {isCollapsed ? (
            <svg className="w-6 h-6 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed 
            ? 'max-h-0 opacity-0' 
            : 'max-h-96 opacity-100'
        } flex flex-col overflow-hidden`}
      >
        <div className="flex-1 overflow-y-auto p-4 min-h-[18rem]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === (isAdmin ? 'Администратор' : 'Пользователь')
                  ? 'text-right'
                  : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === (isAdmin ? 'Администратор' : 'Пользователь')
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {message.sender} • {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded 
                       bg-white dark:bg-zinc-800 min-w-0 transition-colors duration-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                       whitespace-nowrap transition-colors duration-200"
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 