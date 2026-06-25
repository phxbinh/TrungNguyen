'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function LangchainSdkPage() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    api: '/api/langchain-sdk',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      text: input,
    });

    setInput('');
  };

  return (
    <main className="mx-auto flex h-screen max-w-3xl flex-col p-4">
      <h1 className="mb-4 text-2xl font-bold">
        LangChain + AI SDK v6
      </h1>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl p-3 ${
              message.role === 'user'
                ? 'bg-blue-100'
                : 'bg-gray-100'
            }`}
          >
            <div className="mb-2 text-xs font-semibold uppercase">
              {message.role}
            </div>

            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return (
                  <p
                    key={index}
                    className="whitespace-pre-wrap"
                  >
                    {part.text}
                  </p>
                );
              }

              if (part.type === 'tool-call') {
                return (
                  <div
                    key={index}
                    className="mt-2 rounded border bg-yellow-50 p-2 text-sm"
                  >
                    <div>
                      Tool: <b>{part.toolName}</b>
                    </div>

                    <pre>
                      {JSON.stringify(part.input, null, 2)}
                    </pre>
                  </div>
                );
              }

              if (part.type === 'tool-result') {
                return (
                  <div
                    key={index}
                    className="mt-2 rounded border bg-green-50 p-2 text-sm"
                  >
                    <div>Result:</div>

                    <pre>
                      {JSON.stringify(part.output, null, 2)}
                    </pre>
                  </div>
                );
              }

              return null;
            })}
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi gì đó..."
          className="flex-1 rounded-xl border px-4 py-2"
        />

        <button
          type="submit"
          disabled={status === 'streaming'}
          className="rounded-xl border px-4 py-2"
        >
          {status === 'streaming' ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>
    </main>
  );
}