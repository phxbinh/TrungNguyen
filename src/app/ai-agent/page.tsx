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

import { useChat } from '@ai-sdk/react';

export default function ChatbotTest() {
  // useChat sẽ tự động kết nối tới API /api/chat ở Bước 2
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4 text-center">Gemini Chatbot Test</h1>
      
      {/* Khung hiển thị tin nhắn */}
      <div className="space-y-4 mb-4 overflow-y-auto max-h-[500px] border p-4 rounded bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center">Hãy nhập gì đó để bắt đầu kiểm tra...</p>
        )}
        {messages.map(m => (
          <div key={m.id} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-green-100 text-left'}`}>
            <span className="font-bold block text-xs text-gray-550">
              {m.role === 'user' ? 'Bạn' : 'AI'}
            </span>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
      </div>

      {/* Form nhập liệu */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 border border-gray-350 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="Hỏi AI bất cứ điều gì..."
          onChange={handleInputChange}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Gửi
        </button>
      </form>
    </div>
  );
}









