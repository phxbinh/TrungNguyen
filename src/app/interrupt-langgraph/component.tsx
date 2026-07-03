"use client";

import { useState } from "react";

type GraphResponse = {
  age?: number | null;
  pendingQuestion?: string | null;
  __interrupt__?: {
    value: string;
  }[];
};

export default function AgeInterruptForm() {
  const [threadId] = useState(() =>
    crypto.randomUUID()
  );

  const [question, setQuestion] = useState("");
  const [input, setInput] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const startForm = async () => {
    setLoading(true);

    const res = await fetch("/api/interrupt-langgraph/age-form", {
      method: "POST",
      body: JSON.stringify({
        threadId,
      }),
    });

    const data: GraphResponse = await res.json();

    if (data.__interrupt__) {
      setQuestion(data.__interrupt__[0].value);
    }

    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!input.trim()) return;

    setLoading(true);

    const res = await fetch("/api/age-form", {
      method: "POST",
      body: JSON.stringify({
        threadId,
        resume: input,
      }),
    });

    const data: GraphResponse = await res.json();

    if (data.__interrupt__) {
      setQuestion(data.__interrupt__[0].value);
      setInput("");
    }

    if (data.age) {
      setAge(data.age);
      setQuestion("");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 12,
      }}
    >
      <h2>LangGraph Interrupt Demo</h2>

      {!question && age === null && (
        <button onClick={startForm} disabled={loading}>
          {loading ? "Starting..." : "Start Form"}
        </button>
      )}

      {question && (
        <div>
          <p>{question}</p>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter age"
          />

          <button
            onClick={submitAnswer}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {age !== null && (
        <div>
          <h3>Completed</h3>
          <p>Your age: {age}</p>
        </div>
      )}
    </div>
  );
}