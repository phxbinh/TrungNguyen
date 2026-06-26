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