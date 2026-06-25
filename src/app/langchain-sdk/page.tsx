'use client';

import { useChat } from '@ai-sdk/react';

export default function LangchainSdkPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
  } = useChat({
    api: '/api/langchain-sdk',
  });

  return (
    <main className="mx-auto flex h-screen max-w-3xl flex-col p-4">
      <h1 className="mb-4 text-2xl font-bold">
        LangChain + AI SDK Test
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
            <div className="mb-1 text-xs font-semibold uppercase">
              {message.role}
            </div>

            {/* Text parts */}
            {message.parts?.map((part, index) => {
              if (part.type === 'text') {
                return (
                  <p key={index} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                );
              }

              if (part.type === 'tool-call') {
                return (
                  <div
                    key={index}
                    className="mt-2 rounded-lg border bg-yellow-50 p-2 text-sm"
                  >
                    <div>
                      Tool: <b>{part.toolName}</b>
                    </div>
                    <pre className="overflow-x-auto">
                      {JSON.stringify(part.input, null, 2)}
                    </pre>
                  </div>
                );
              }

              if (part.type === 'tool-result') {
                return (
                  <div
                    key={index}
                    className="mt-2 rounded-lg border bg-green-50 p-2 text-sm"
                  >
                    <div>Result:</div>
                    <pre className="overflow-x-auto">
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
        onSubmit={handleSubmit}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={handleInputChange}
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