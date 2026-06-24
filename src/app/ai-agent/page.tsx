
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

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








