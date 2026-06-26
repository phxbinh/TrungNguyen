'use client';

import { useState } from 'react';

type AgentState = {
  input: string;
  intent?: string;
  products?: any[];
  product?: any;
  docs?: any[];
  answer?: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function HomePage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentState, setAgentState] = useState<AgentState | null>(null);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat-langgraph', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
        },
      ]);

      setAgentState(data.state);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-[2fr_1fr]">
        
        {/* Left side */}
        <section className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 p-4">
            <h1 className="text-xl font-bold">LangGraph Playground</h1>
            <p className="text-sm text-neutral-400">
              Test deterministic AI workflow with routing + state.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-700 p-4 text-sm text-neutral-400">
                Try:
                <ul className="mt-2 space-y-2">
                  <li>• Tìm áo hoodie</li>
                  <li>• Cho xem chi tiết áo hoodie</li>
                  <li>• Hướng dẫn giặt áo hoodie</li>
                  <li>• Bạn giúp được gì?</li>
                </ul>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'ml-auto bg-blue-600'
                    : 'bg-neutral-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            ))}

            {loading && (
              <div className="w-fit rounded-xl bg-neutral-800 px-4 py-3 text-sm text-neutral-400">
                Running graph...
              </div>
            )}
          </div>

          <div className="border-t border-neutral-800 p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
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

        {/* Right side */}
        <section className="space-y-6">
          
          {/* Intent */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="mb-3 font-semibold">Detected Intent</h2>

            <div className="rounded-lg bg-neutral-950 p-3 text-sm">
              {agentState?.intent || 'No intent yet'}
            </div>
          </div>

          {/* Route Result */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="mb-3 font-semibold">Route Output</h2>

            <div className="space-y-2 text-sm">
              {agentState?.products && (
                <div className="rounded-lg bg-neutral-950 p-3">
                  Product Search Node executed
                </div>
              )}

              {agentState?.product && (
                <div className="rounded-lg bg-neutral-950 p-3">
                  Product Detail Node executed
                </div>
              )}

              {agentState?.docs && (
                <div className="rounded-lg bg-neutral-950 p-3">
                  Docs RAG Node executed
                </div>
              )}

              {!agentState?.products &&
                !agentState?.product &&
                !agentState?.docs &&
                agentState?.answer && (
                  <div className="rounded-lg bg-neutral-950 p-3">
                    General Chat Node executed
                  </div>
                )}
            </div>
          </div>

          {/* Full State */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="mb-3 font-semibold">Full Agent State</h2>

            <pre className="max-h-[500px] overflow-auto rounded-lg bg-neutral-950 p-3 text-xs text-neutral-300">
              {JSON.stringify(agentState, null, 2)}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}