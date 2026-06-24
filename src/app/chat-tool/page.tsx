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

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  type UIMessage,
} from 'ai';

const initialMessages: UIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Xin chào! Tôi là trợ lý AI. Hôm nay bạn cần hỗ trợ gì?',
      },
    ],
  },
];

export default function Chat() {
  const [input, setInput] =
    useState('');

  const {
    messages,
    sendMessage,
    status,
    error,
  } = useChat({
    transport:
      new DefaultChatTransport({
        api: '/api/chat-tool',
      }),

    messages: initialMessages,
  });

  const isLoading =
    status === 'submitted' ||
    status === 'streaming';

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!input.trim() || isLoading)
      return;

    sendMessage({
      role: 'user',
      parts: [
        {
          type: 'text',
          text: input,
        },
      ],
    });

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <h1 className="text-2xl font-semibold text-center">
          AI Chat - SDK v6
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => {
          const isUser =
            message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex ${
                isUser
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] px-5 py-4 rounded-2xl whitespace-pre-wrap ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {message.parts.map(
                  (part, index) => {
                    if (
                      part.type !== 'text'
                    )
                      return null;

                    return (
                      <span key={index}>
                        {part.text}
                      </span>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border px-5 py-4 rounded-2xl">
              Đang suy nghĩ...
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-6 pb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            Lỗi:{' '}
            {error.message ||
              'Có lỗi xảy ra'}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form
          onSubmit={handleSubmit}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={
              isLoading ||
              !input.trim()
            }
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full transition"
          >
            {isLoading
              ? '...'
              : 'Gửi'}
          </button>
        </form>
      </div>
    </div>
  );
}


