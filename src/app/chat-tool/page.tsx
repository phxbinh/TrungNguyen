/*
'use client';

import { useState } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 border rounded-lg"
        placeholder="Nhập câu hỏi..."
        rows={4}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        {loading ? 'Đang nghĩ...' : 'Gửi'}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <strong>Kết quả:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
*/


'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    error 
  } = useChat({
    api: '/api/chat-tool',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Xin chào! Tôi là trợ lý AI. Bạn muốn hỏi gì hôm nay?',
      },
    ],
    onError: (err) => console.error('Chat error:', err),
  });

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <h1 className="text-2xl font-semibold text-center">AI Chat</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 rounded-2xl text-[17px] leading-relaxed ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl">
              Đang suy nghĩ
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 pb-4">
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
            Lỗi: {error.message || 'Không thể kết nối với server'}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Nhập tin nhắn của bạn..."
            className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-[17px]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-full transition-colors"
          >
            {isLoading ? '...' : 'Gửi'}
          </button>
        </form>
      </div>
    </div>
  );
}








