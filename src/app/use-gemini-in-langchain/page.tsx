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
        text: 'Xin chào! Tôi là trợ lý AI có sử dụng LangChain. Hôm nay bạn cần hỗ trợ gì?',
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
        api: '/api/langchain-sdk/use-gemini-in-langchain',
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
    /* DÙNG FIXED KHÓA CHẶT BỐ CỤC TOÀN MÀN HÌNH KHÔNG CHO CHẠY LUNG TUNG */
    <div className="fixed inset-0 flex flex-col max-w-4xl mx-auto bg-slate-50 font-sans shadow-2xl md:border-x border-slate-200/50 overflow-hidden">
      
      {/* Header - Ghim trên cùng */}
      <div className="backdrop-blur-md bg-white/80 border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-xs shrink-0 z-10">
        <div className="flex items-center gap-3 mx-auto">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            AI Assistant
          </h1>
        </div>
      </div>

      {/* Messages - Chiếm trọn vùng giữa, tự động cuộn */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
        {messages.map((message) => {
          const isUser =
            message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md select-none shrink-0 mt-0.5">
                  AI
                </div>
              )}

              <div
                className={`max-w-[75%] px-5 py-3.5 whitespace-pre-wrap transition-all duration-200 ${
                  isUser
                    ? 'bg-slate-900 text-slate-50 rounded-2xl rounded-tr-xs shadow-md shadow-slate-900/10'
                    : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-xs shadow-xs'
                }`}
              >
{message.parts.map((part, index) => {
  if (part.type === 'text') {
    return (
      <span
        key={index}
        className="text-[15px] leading-relaxed"
      >
        {part.text}
      </span>
    );
  }

  if (
    part.type === 'tool-searchProducts' &&
    part.state === 'output-available'
  ) {
    return (
      <pre key={index}>
        {JSON.stringify(part.output, null, 2)}
      </pre>
    );
  }

  if (
    part.type === 'tool-askLangchain' &&
    part.state === 'output-available'
  ) {
    return (
      <pre key={index}>
        {JSON.stringify(part.output, null, 2)}
      </pre>
    );
  }

  return null;
})}

              </div>
            </div>
          );
        })}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0 mt-0.5">
              AI
            </div>
            <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
              <span className="text-[15px] text-slate-500 font-medium">Đang suy nghĩ</span>
              <span className="flex gap-1 items-center pt-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form - Nằm tự nhiên ở dưới cùng nhờ cấu trúc flex-col của khung fixed */}
      <div className="shrink-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent p-4 md:p-6 pb-safe z-10">
        {error && (
          <div className="pb-3">
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-xs">
              <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Lỗi: {error.message || 'Có lỗi kết nối xảy ra.'}</span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-lg focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200"
        >
          <input
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={
              isLoading ||
              !input.trim()
            }
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-medium rounded-xl shadow-md hover:shadow-lg disabled:shadow-none transition-all duration-200 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
