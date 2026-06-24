'use client';

import { useState } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 border rounded-lg"
        placeholder="Nhập câu hỏi..."
        rows={4}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        {loading ? 'Đang nghĩ...' : 'Gửi'}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <strong>Kết quả:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}