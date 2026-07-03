"use client";

import { useState } from "react";

type GraphResponse = {
  sum?: number;
  stopped?: boolean;
  __interrupt__?: {
    value: string;
  }[];
};

export default function SumInterruptForm() {
  const [threadId] = useState(() => crypto.randomUUID());

  const [question, setQuestion] = useState("");
  const [input, setInput] = useState("");
  const [sum, setSum] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const startWorkflow = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/interrupt-langgraph/sum-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
        }),
      });

      const data: GraphResponse = await res.json();

      console.log("start:", data);

      if (data.__interrupt__) {
        setQuestion(data.__interrupt__[0].value);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitValue = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/interrupt-langgraph/sum-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          resume: input,
        }),
      });

      const data: GraphResponse = await res.json();

      console.log("resume:", data);

      // Graph paused again
      if (data.__interrupt__) {
        setQuestion(data.__interrupt__[0].value);
        setInput("");
        return;
      }

      // Workflow finished
/*
      if (data.sum !== undefined) {
        setSum(data.sum);
        setQuestion("");
      }
*/
      if (!data.__interrupt__ && data.sum !== undefined) {
        setSum(data.sum);
        setQuestion("");
      }


    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetWorkflow = () => {
    window.location.reload();
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
      <h2>LangGraph Sum Workflow</h2>

      {!question && sum === null && (
        <button onClick={startWorkflow} disabled={loading}>
          {loading ? "Starting..." : "Start"}
        </button>
      )}

      {question && (
        <div>
          <p>{question}</p>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter number or stop"
          />

          <button onClick={submitValue} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {sum !== null && (
        <div>
          <h3>Workflow Finished</h3>
          <p>Total Sum: {sum}</p>

          <button onClick={resetWorkflow}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}