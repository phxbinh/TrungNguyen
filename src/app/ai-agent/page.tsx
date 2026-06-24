/*
import React from 'react';
import Link from 'next/link'; // 1. Import Link từ next/link

export default function AgentPage() {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Khám phá AI Agent langchain ai-sdk</h1>
      <Link href="/" style={linkStyle}>
        Back to Home →
      </Link>
    </div>
  );
}

// Cấu hình style
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column', // Đổi sang column để chữ và link xếp theo chiều dọc
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f0f2f5',
  fontFamily: 'system-ui, sans-serif',
  gap: '20px', // Tạo khoảng cách giữa h1 và link
};

const headingStyle: React.CSSProperties = {
  fontSize: '3rem',
  color: '#333',
  fontWeight: 'bold',
  margin: 0, // Xóa margin mặc định để gap hoạt động chuẩn
};

const linkStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  color: '#0070f3',
  textDecoration: 'none',
  fontWeight: '500',
  padding: '10px 20px',
  border: '1px solid #0070f3',
  borderRadius: '8px',
  backgroundColor: '#fff',
  transition: 'all 0.2s ease',
};
*/


'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function ChatbotTest() {
  // Tự quản lý state input theo chuẩn AI SDK v6
  const [inputValue, setInputValue] = useState('');
  
  // useChat bản mới chỉ trả về danh sách messages và hàm sendMessage
  const { messages, sendMessage } = useChat();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Gửi tin nhắn đi theo cấu trúc mới
    sendMessage({ text: inputValue });
    
    // Xóa trống ô nhập sau khi gửi
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
            <span className="font-bold block text-xs text-gray-500">
              {m.role === 'user' ? 'Bạn' : 'AI'}
            </span>
            <p className="whitespace-pre-wrap">{m.content}</p>
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









