'use client';

import { useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function HomePage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      {
        role: 'user',
        content: input,
      },
    ];

    // optimistic update
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/test-agent-langchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      const data = await res.json();

      console.log(data);

      const agentMessages = data?.messages ?? [];
      const lastMessage = agentMessages[agentMessages.length - 1];

      let assistantContent = '';

      if (typeof lastMessage?.content === 'string') {
        assistantContent = lastMessage.content;
      } else if (Array.isArray(lastMessage?.content)) {
        assistantContent = lastMessage.content
          .map((c: any) => c.text || '')
          .join('\n');
      }

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: assistantContent || 'Không có phản hồi',
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'Có lỗi xảy ra.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col p-6">
        <section className="flex flex-1 flex-col rounded-2xl border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 p-4">
            <h1 className="text-xl font-bold">LangChain Agent Playground</h1>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'ml-auto bg-blue-600'
                    : 'bg-neutral-800'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">
                  {message.content}
                </p>
              </div>
            ))}

            {loading && (
              <div className="w-fit rounded-xl bg-neutral-800 px-4 py-3 text-sm text-neutral-400">
                Thinking...
              </div>
            )}
          </div>

          <div className="border-t border-neutral-800 p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Nhập câu hỏi..."
                className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="rounded-xl bg-white px-5 py-3 font-medium text-black disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}