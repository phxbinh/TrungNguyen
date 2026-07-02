import { useState } from "react";
import { Loader2, Search, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const SAMPLE_INPUTS = [
  "áo thun nam category ao-thun",
  "áo thun nam dưới 200k màu đỏ",
  "quần jean nữ màu tím giá dưới 100k",
  "cho tôi xem áo thun",
  "áo màu tím",
];

//src/app/claude-code-test-agent-loop/page.tsx
export default function AgentTester() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function runTest(testInput) {
    const value = testInput ?? input;
    if (!value.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/claude-code-test-agent-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value }),
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || "Có lỗi xảy ra khi gọi API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Product Search Agent Tester</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Nhập yêu cầu tìm sản phẩm, xem agent tự loop qua từng bước.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runTest()}
            placeholder="vd: áo thun nam dưới 200k màu đỏ"
            className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            onClick={() => runTest()}
            disabled={loading}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Chạy
          </button>
        </div>

        {/* Sample inputs */}
        <div className="flex flex-wrap gap-2">
          {SAMPLE_INPUTS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
                runTest(s);
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Step count */}
            <div className="text-xs text-neutral-500">
              Số bước đã dùng: <span className="font-medium text-neutral-800">{data.stepCount}</span>
            </div>

            {/* Trace timeline */}
            <div className="space-y-3">
              {data.trace.map((t, i) =>
                t.type === "tool_call" ? (
                  <div key={i} className="bg-white border border-neutral-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-2">
                      <ArrowRight className="w-3.5 h-3.5" />
                      GỌI TOOL: {t.name}
                    </div>
                    <pre className="text-xs bg-neutral-50 rounded p-2 overflow-x-auto">
                      {JSON.stringify(t.args, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div
                    key={i}
                    className={`border rounded-lg p-3 ${
                      t.content.resultCount === 0
                        ? "bg-amber-50 border-amber-200"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-medium mb-2">
                      {t.content.resultCount === 0 ? (
                        <XCircle className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      KẾT QUẢ: {t.content.resultCount} sản phẩm
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{t.content.hint}</p>
                    {t.content.results?.length > 0 && (
                      <ul className="text-xs text-neutral-700 space-y-1">
                        {t.content.results.map((p) => (
                          <li key={p.id}>
                            • {p.name} — {p.price.toLocaleString()}đ — {p.color}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Final answer */}
            <div className="bg-neutral-900 text-white rounded-lg p-4">
              <div className="text-xs text-neutral-400 mb-1">CÂU TRẢ LỜI CUỐI</div>
              <div className="text-sm">{data.finalAnswer}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}