'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
//import type { UIMessage } from 'ai';
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

/*
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
*/

type AgentState = {
  input: string;
  intent?: string;
  products?: any[];
  product?: any;
  docs?: any[];
  answer?: string;
};

export default function HomePage() {
  const [agentState, setAgentState] = useState<AgentState | null>(null);

  const { messages, sendMessage, status } = useChat({
    transport:
      new DefaultChatTransport({
        api: '/api/chat-langgraph-check',
      }),

    onData: (part) => {
      if (part.type === 'data-state') {
        setAgentState(part.data.state);
      }
    },
  });

  const loading = status === 'submitted' || status === 'streaming';

  async function handleSend(value: string) {
    if (!value.trim()) return;

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: value }],
    });
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-[2fr_1fr]">
        
        {/* Left */}
        <ChatPanel
          messages={messages}
          loading={loading}
          onSend={handleSend}
        />

        {/* Right */}
        <Sidebar agentState={agentState} />
      </div>
    </main>
  );
}

function ChatPanel({
  messages,
  loading,
  onSend,
}: {
  messages: UIMessage[];
  loading: boolean;
  onSend: (value: string) => void;
}) {
  const [input, setInput] = useState('');

  return (
    <section className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => {
          const text =
            message.parts
              ?.filter((p) => p.type === 'text')
              .map((p) => p.text)
              .join('') ?? '';

          return (
            <div
              key={message.id}
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                message.role === 'user'
                  ? 'ml-auto bg-blue-600'
                  : 'bg-neutral-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{text}</p>
            </div>
          );
        })}

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
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
          />

          <button
            onClick={() => {
              onSend(input);
              setInput('');
            }}
            disabled={loading}
            className="rounded-xl bg-white px-5 py-3 text-black"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

function Sidebar({ agentState }: { agentState: AgentState | null }) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-3 font-semibold">Detected Intent</h2>
        <div className="rounded-lg bg-neutral-950 p-3 text-sm">
          {agentState?.intent || 'No intent yet'}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-3 font-semibold">Full Agent State</h2>
        <pre className="max-h-[500px] overflow-auto rounded-lg bg-neutral-950 p-3 text-xs text-neutral-300">
          {JSON.stringify(agentState, null, 2)}
        </pre>
      </div>
    </section>
  );
}