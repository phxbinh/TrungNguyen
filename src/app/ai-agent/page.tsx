
'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

//export default 
function ChatbotTest__() {
  const [inputValue, setInputValue] = useState('');

  const { messages, sendMessage, status } = useChat({
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

  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Gemini Chatbot (AI SDK v6)</h1>

      {/* Chat Messages Area */}
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

              <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return <span key={index}>{part.text}</span>;
                  }

                  if (part.type === 'tool-call' || part.type.startsWith('tool-')) {
                    const toolName = (part as any).toolName || part.type.replace('tool-', '');
                    return (
                      <div
                        key={index}
                        className="text-amber-600 text-sm mt-3 bg-amber-50 p-3 rounded-xl border border-amber-200"
                      >
                        🔧 Đang gọi tool: <strong>{toolName}</strong>
                      </div>
                    );
                  }

                  if (part.type === 'tool-result' || part.type.startsWith('tool-')) {
                    const toolName = (part as any).toolName || part.type.replace('tool-', '');
                    const result = (part as any).output || (part as any).result;

                    return (
                      <div
                        key={index}
                        className="text-green-700 text-sm mt-3 bg-green-50 p-3 rounded-xl border border-green-200"
                      >
                        ✅ Kết quả tool <strong>{toolName}</strong>:
                        <pre className="mt-2 text-xs bg-white p-3 rounded-lg overflow-auto border">
                          {JSON.stringify(result, null, 2)}
                        </pre>
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
            <div className="bg-white border p-4 rounded-2xl text-sm flex items-center gap-2">
              <span className="animate-pulse">●</span>
              AI đang suy nghĩ...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-3">
        <input
          className="flex-1 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
          value={inputValue}
          placeholder="Nhập tin nhắn của bạn..."
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-2xl font-medium transition-all"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}


// Chạy được --------------------------------
/*
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
*/

export default function ChatbotTest() {
  // Tự quản lý trạng thái input theo chuẩn AI SDK v6
  const [inputValue, setInputValue] = useState('');
  
  // useChat chỉ trả về danh sách messages và hàm sendMessage
  const { messages, sendMessage } = useChat();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Gửi tin nhắn đi dưới cấu trúc object mới
    sendMessage({ text: inputValue });
    
    // Xóa sạch ô nhập sau khi gửi
    setInputValue('');
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4 text-center">Gemini Chatbot v6 Test</h1>
      
      {/* Khung hiển thị tin nhắn */}
      <div className="space-y-4 mb-4 overflow-y-auto max-h-[500px] border p-4 rounded bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center">Hãy nhập gì đó để bắt đầu kiểm tra...</p>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-green-100 text-left'}`}>
            <span className="font-bold block text-xs text-gray-500 mb-1">
              {m.role === 'user' ? 'Bạn' : 'AI'}
            </span>
            
            {/* CẤU TRÚC MỚI: Quét qua mảng parts để lấy nội dung text */}
            <div className="whitespace-pre-wrap">
              {m.parts.map((part, index) => {
                if (part.type === 'text') {
                  return <span key={index}>{part.text}</span>;
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Form nhập liệu */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={inputValue}
          placeholder="Hỏi AI bất cứ điều gì..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Gửi
        </button>
      </form>
    </div>
  );
}