'use client';

import { useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function extractAssistantContent(data: any): string {
  const allMessages = data?.messages ?? [];

  if (!allMessages.length) return '';

  // tìm AIMessage trong serialized LangChain response
  const lastAIMessage =
    [...allMessages]
      .reverse()
      .find(
        (m: any) =>
          m?.id?.includes?.('AIMessage') ||
          m?.type === 'ai'
      ) || allMessages[allMessages.length - 1];

  if (!lastAIMessage) return '';

  // trường hợp serialized chuẩn:
  // { kwargs: { content: "..." } }
  if (typeof lastAIMessage?.kwargs?.content === 'string') {
    return lastAIMessage.kwargs.content;
  }

  // fallback nếu content nằm trực tiếp
  if (typeof lastAIMessage?.content === 'string') {
    return lastAIMessage.content;
  }

  // fallback nếu content là array blocks
  if (Array.isArray(lastAIMessage?.kwargs?.content)) {
    return lastAIMessage.kwargs.content
      .map((block: any) => {
        if (typeof block === 'string') return block;
        if (block?.text) return block.text;
        if (block?.type === 'text' && block?.text) return block.text;
        return '';
      })
      .join('\n');
  }

  return '';
}

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
        content: input.trim(),
      },
    ];

    // optimistic render user message
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

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      console.log('RAW RESPONSE:', data);

      const assistantContent = extractAssistantContent(data);

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
          content: 'Có lỗi xảy ra khi gọi agent.',
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
          {/* Header */}
          <div className="border-b border-neutral-800 p-4">
            <h1 className="text-xl font-bold">
              LangChain Agent Playground
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Test agent + tools + conversation history
            </p>
          </div>

          {/* Chat messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-700 p-4 text-sm text-neutral-400">
                Ví dụ:
                <ul className="mt-2 space-y-2">
                  <li>• Hello</li>
                  <li>• Thời tiết ở Hà Nội thế nào?</li>
                  <li>• Bạn giúp tôi được gì?</li>
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

          {/* Input */}
          <div className="border-t border-neutral-800 p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
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