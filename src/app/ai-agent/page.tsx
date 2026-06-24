
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';


//export default 
function ChatbotTest__() {
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
    <div className="flex flex-col w-full max-w-2xl h-[85vh] mx-auto my-8 p-4 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-xl font-bold text-center text-gray-800">Gemini Chatbot v6 Test</h1>
      </div>
      
      {/* Khung hiển thị tin nhắn */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scroll-behavior-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <p className="text-sm">Hãy nhập gì đó để bắt đầu kiểm tra...</p>
          </div>
        )}
        
        {messages.map(m => {
          const isUser = m.role === 'user';
          return (
            <div 
              key={m.id} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Tên người gửi */}
              <span className="text-xs font-semibold text-gray-400 mb-1 px-1">
                {isUser ? 'Bạn' : 'AI'}
              </span>
              
              {/* Bong bóng chat */}
              <div 
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm whitespace-pre-wrap text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                }`}
              >
                {/* CẤU TRÚC MỚI: Quét qua mảng parts để lấy nội dung text */}
                <div>
                  {m.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return <span key={index}>{part.text}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form nhập liệu */}
      <form onSubmit={handleFormSubmit} className="flex gap-2 items-center pt-2 border-t">
        <input
          className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
          value={inputValue}
          placeholder="Hỏi AI bất cứ điều gì..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button 
          type="submit" 
          className="px-5 py-3 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md shadow-blue-100"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}



export default function ChatbotTest() {
  const [inputValue, setInputValue] = useState('');
  
  // CẤU TRÚC SỬA ĐỔI: Chỉ định rõ api endpoint và cho phép chạy nhiều bước (maxSteps) để gọi Tool
  const { messages, sendMessage } = useChat({
    api: '/api/chat', // Đảm bảo luôn gọi chính xác đến file src/app/api/chat/route.ts
    maxSteps: 5,      // BẮT BUỘC CÓ: Cho phép AI Agent chạy tiếp bước 2 sau khi Tool trả về kết quả
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage({ text: inputValue });
    setInputValue('');
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">Gemini Chatbot v6 Test</h1>
      
      {/* Khung hiển thị tin nhắn */}
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
              {/* Kiểm tra m.parts có tồn tại trước khi map để tránh lỗi runtime */}
              {m.parts?.map((part, index) => {
                // 1. Hiển thị văn bản AI trả lời
                if (part.type === 'text') {
                  return <span key={index} className="block">{part.text}</span>;
                }

                // 2. Hiển thị khi AI đang gọi Tool (Hữu ích để người dùng biết hệ thống đang xử lý)
                if (part.type === 'tool-call') {
                  return (
                    <div key={index} className="text-xs text-amber-600 bg-amber-50 p-1 rounded border border-amber-200">
                      ⚙️ Đang gọi công cụ: <strong>{part.toolName}</strong>...
                    </div>
                  );
                }

                // 3. Hiển thị dữ liệu thô từ Tool nếu bạn muốn debug
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

      {/* Form nhập liệu */}
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





// Chạy được --------------------------------
/*
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
*/

//export default 
function ChatbotTest___() {
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








