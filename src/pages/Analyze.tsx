import { useState } from "react";

interface ApiResponse {
  label: "Scam" | "Safe";
  risk_score: number;
  matched_keywords: string[];
}

const res = await fetch(`${API_URL}/analyze`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
});

export default function Analyze() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  const analyzeMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data: ApiResponse = await res.json();
      setResult(data);

      // Save to history
      const history = JSON.parse(localStorage.getItem("scan-history") || "[]");

      localStorage.setItem(
        "scan-history",
        JSON.stringify(
          [
            {
              text: message,
              label: data.label,
              score: data.risk_score,
              time: new Date().toISOString(),
            },
            ...history,
          ].slice(0, 10)
        )
      );
    } catch (err) {
      setError("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Analyze a message</h1>
      <p className="text-slate-400 mb-8 max-w-xl">
        Paste an SMS or email to detect scam and phishing indicators.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* INPUT */}
        <div className="bg-slate-800 border border-white/10 rounded-xl p-6">
          <label className="text-xs uppercase tracking-wide text-slate-400">
            Message content
          </label>

          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-3 w-full resize-none bg-slate-900 border border-white/10 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Urgent! Verify your account immediately..."
          />

          <button
            onClick={analyzeMessage}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-indigo-500 text-white py-2.5 text-sm hover:bg-indigo-400 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze message"}
          </button>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        {/* RESULT */}
        {result && (
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-300">
              Analysis result
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <span
                className={`text-xl ${
                  result.label === "Scam" ? "text-red-400" : "text-green-400"
                }`}
              >
                {result.label === "Scam" ? "⚠" : "✔"}
              </span>

              <p>
                {result.label === "Scam"
                  ? "Scam indicators detected"
                  : "Message appears safe"}
              </p>
            </div>

            {/* Risk Bar */}
            <div className="mt-5">
              <div className="h-2 bg-slate-700 rounded">
                <div
                  className={`h-2 rounded ${
                    result.risk_score > 60
                      ? "bg-red-500"
                      : result.risk_score > 30
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${result.risk_score}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Risk score: {result.risk_score} / 100
              </p>
            </div>

            {/* Explainability */}
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-300 mb-2">
                Detected indicators
              </p>

              {result.matched_keywords.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No suspicious keywords found
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.matched_keywords.map((k) => (
                    <span
                      key={k}
                      className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
