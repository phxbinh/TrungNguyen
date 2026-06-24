'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export default function ChatbotTest() {
  const [inputValue, setInputValue] = useState('');

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',           // Đường dẫn đến route bạn đã tạo
    }),
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage({ text: inputValue });
    setInputValue('');
  };

  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Gemini Chatbot (AI SDK v6)</h1>

      {/* Khung chat */}
      <div className="flex-1 border border-gray-200 rounded-2xl bg-gray-50 p-6 mb-6 overflow-y-auto max-h-[600px] space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện...
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="text-xs opacity-70 mb-1">
                {message.role === 'user' ? 'Bạn' : 'AI Assistant'}
              </div>

              {/* Render các parts (quan trọng nhất ở v6) */}
              <div className="whitespace-pre-wrap text-[15px]">
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return <span key={index}>{part.text}</span>;
                  }
                  if (part.type === 'tool-call') {
                    return (
                      <div key={index} className="text-amber-600 text-sm mt-2">
                        🔧 Đang gọi tool: <strong>{part.toolName}</strong>
                      </div>
                    );
                  }
                  if (part.type === 'tool-result') {
                    return (
                      <div key={index} className="text-green-600 text-sm mt-2 bg-green-50 p-2 rounded">
                        ✅ Tool result: {JSON.stringify(part.result, null, 2)}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border p-4 rounded-2xl">
              AI đang suy nghĩ...
            </div>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleFormSubmit} className="flex gap-3">
        <input
          className="flex-1 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={inputValue}
          placeholder="Nhập tin nhắn của bạn..."
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-2xl font-medium transition"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}