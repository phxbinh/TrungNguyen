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
*/



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
    <main className="mx-auto flex h-screen max-w-3xl flex-col bg-slate-50 px-4 py-6 md:px-6">
      {/* Header tinh tế và chuyên nghiệp */}
      <header className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          LangGraph Agent Test
        </h1>
      </header>

      {/* Khung chứa nội dung chat mượt mà, bo góc rộng và đổ bóng nhẹ */}
      <section className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Label vai trò nhỏ gọn, trực quan */}
            <span className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              {message.role === 'user' ? 'Bạn' : 'Agent'}
            </span>

            {/* Bong bóng chat bo góc kiểu hiện đại (Message Bubbles) */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm md:max-w-[75%] ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {message.parts
                  .filter((part) => part.type === 'text')
                  .map((part, index) => (
                    <span key={index}>{part.text}</span>
                  ))}
              </div>
            </div>
          </div>
        ))}

        {/* Trạng thái Loading giả lập ba dấu chấm nhấp nháy chuyên nghiệp */}
        {status === 'streaming' && (
          <div className="flex flex-col items-start">
            <span className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Agent
            </span>
            <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-3 border border-slate-200/50 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]">s</span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
            </div>
          </div>
        )}
      </section>

      {/* Form nhập liệu cân đối, hiệu ứng focus rõ ràng */}
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
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        <button
          type="submit"
          disabled={status === 'streaming'}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Gửi
        </button>
      </form>
    </main>
  );
}








