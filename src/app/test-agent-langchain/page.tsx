"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await res.json();

      // LangChain agent thường trả messages[]
      const aiMessage =
        data.messages?.[data.messages.length - 1]?.content ||
        "Không có phản hồi";

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: aiMessage,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Lỗi gọi API",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Agent</h1>

      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100"
            }`}
          >
            <p className="text-sm font-semibold mb-1">
              {msg.role === "user" ? "Bạn" : "Agent"}
            </p>
            <p>{msg.content}</p>
          </div>
        ))}

        {loading && (
          <div className="bg-gray-100 p-3 rounded-lg">
            Agent đang suy nghĩ...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded-lg px-4 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 border rounded-lg"
        >
          Gửi
        </button>
      </div>
    </main>
  );
}