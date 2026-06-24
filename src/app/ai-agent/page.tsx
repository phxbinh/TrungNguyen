'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export default function ChatbotTest() {
  const [inputValue, setInputValue] = useState('');
  
  // XÓA BỎ HOÀN TOÀN maxSteps Ở ĐÂY
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat', 
    }),
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage({ text: inputValue });
    setInputValue('');
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">Gemini Chatbot v6 Tool Test</h1>
      
      <div className="space-y-4 mb-4 overflow-y-auto max-h-[500px] border p-4 rounded bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center">Hỏi thử: "Thời tiết Hà Nội thế nào?"</p>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-green-100 text-left'}`}>
            <span className="font-bold block text-xs text-gray-500 mb-1">
              {m.role === 'user' ? 'Bạn' : 'AI'}
            </span>
            
            <div className="whitespace-pre-wrap text-sm space-y-2">
              {m.parts?.map((part, index) => {
                if (part.type === 'text') {
                  return <span key={index} className="block">{part.text}</span>;
                }

                if (part.type === 'tool-call') {
                  return (
                    <div key={index} className="text-xs text-amber-600 bg-amber-50 p-1 rounded border border-amber-200">
                      ⚙️ Đang gọi công cụ: <strong>{part.toolName}</strong>...
                    </div>
                  );
                }

                if (part.type === 'tool-result') {
                  return (
                    <div key={index} className="text-xs text-purple-700 bg-purple-50 p-1 rounded border border-purple-200">
                      📊 Kết quả {part.toolName}: {JSON.stringify(part.result)}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={inputValue}
          placeholder="Hỏi thời tiết hoặc chat bình thường..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Gửi
        </button>
      </form>
    </div>
  );
}
