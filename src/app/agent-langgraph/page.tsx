
'use client';

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
        text: 'Xin chào 👋 Mình là agent test LangGraph. Hỏi gì thử đi.',
      },
    ],
  },
];

export default function AgentLangGraphPage() {
  const {
    messages,
    sendMessage,
    status,
  } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/agent-langgraph',
    }),
  });

  return (
    <main className="mx-auto flex h-screen max-w-4xl flex-col p-6">
      <h1 className="mb-4 text-2xl font-bold">
        LangGraph Agent Test
      </h1>

      <section className="flex-1 space-y-4 overflow-y-auto rounded-lg border p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-lg p-3 ${
              message.role === 'user'
                ? 'ml-auto max-w-[80%] bg-blue-100'
                : 'mr-auto max-w-[80%] bg-gray-100'
            }`}
          >
            <div className="mb-1 text-xs font-semibold uppercase opacity-70">
              {message.role}
            </div>

            <div className="whitespace-pre-wrap">
              {message.parts
                .filter((part) => part.type === 'text')
                .map((part, index) => (
                  <span key={index}>{part.text}</span>
                ))}
            </div>
          </div>
        ))}

        {status === 'streaming' && (
          <div className="text-sm opacity-70">
            Agent đang suy nghĩ...
          </div>
        )}
      </section>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();

          const form = e.currentTarget;
          const input = form.elements.namedItem(
            'message'
          ) as HTMLInputElement;

          const value = input.value.trim();
          if (!value) return;

          sendMessage({
            text: value,
          });

          input.value = '';
        }}
      >
        <input
          name="message"
          placeholder="Nhập câu hỏi..."
          className="flex-1 rounded-lg border px-4 py-2"
        />

        <button
          type="submit"
          disabled={status === 'streaming'}
          className="rounded-lg border px-4 py-2"
        >
          Gửi
        </button>
      </form>
    </main>
  );
}



/*
'use client';

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
        text: 'Xin chào 👋 Mình là agent test LangGraph. Hỏi gì thử đi.',
      },
    ],
  },
];
*/
//export default 
function AgentLangGraphPage_() {
  const {
    messages,
    sendMessage,
    status,
  } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/agent-langgraph',
    }),
  });

  const isLoading = status === 'streaming';

  return (
    /* DÙNG FIXED KHÓA CHẶT BỐ CỤC TOÀN MÀN HÌNH THEO MẪU */
    <div className="fixed inset-0 flex flex-col max-w-4xl mx-auto bg-slate-50 font-sans shadow-2xl md:border-x border-slate-200/50 overflow-hidden">
      
      {/* Header - Ghim trên cùng */}
      <div className="backdrop-blur-md bg-white/80 border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-xs shrink-0 z-10">
        <div className="flex items-center gap-3 mx-auto">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            LangGraph Agent Test
          </h1>
        </div>
      </div>

      {/* Messages - Vùng cuộn tin nhắn ở giữa */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Avatar AI hiển thị khi không phải là User */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md select-none shrink-0 mt-0.5">
                  AI
                </div>
              )}

              {/* Khung chứa text - Giữ nguyên logic render dữ liệu cũ */}
              <div
                className={`max-w-[75%] px-5 py-3.5 transition-all duration-200 ${
                  isUser
                    ? 'bg-slate-900 text-slate-50 rounded-2xl rounded-tr-xs shadow-md shadow-slate-900/10'
                    : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.parts
                    .filter((part) => part.type === 'text')
                    .map((part, index) => (
                      <span key={index} className="text-[15px] leading-relaxed">
                        {part.text}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Trạng thái Loading đang suy nghĩ đồng bộ theo mẫu */}
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

      {/* Input Form - Giữ nguyên cấu trúc lấy value từ form element không qua state của code gốc */}
      <div className="shrink-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent p-4 md:p-6 pb-safe z-10">
        <form
          className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-lg focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200"
          onSubmit={(e) => {
            e.preventDefault();

            const form = e.currentTarget;
            const input = form.elements.namedItem(
              'message'
            ) as HTMLInputElement;

            const value = input.value.trim();
            if (!value || isLoading) return;

            sendMessage({
              text: value,
            });

            input.value = '';
          }}
        >
          <input
            name="message"
            placeholder="Nhập câu hỏi..."
            className="flex-1 px-4 py-3 text-[15px] text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
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









