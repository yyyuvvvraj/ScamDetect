import { useState } from "react";
import { API_URL } from "../config";

interface ApiResponse {
  label: "Scam" | "Safe";
  risk_score: number;
  matched_keywords?: string[];
}

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
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data: ApiResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-6">Scam Message Analyzer</h1>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-white/10 bg-slate-900 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Paste an SMS or email message here..."
      />

      <button
        onClick={analyzeMessage}
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-8 rounded-xl border border-white/10 bg-slate-800 p-6">
          <p className="text-lg font-medium">
            Result:{" "}
            <span
              className={
                result.label === "Scam" ? "text-red-400" : "text-green-400"
              }
            >
              {result.label}
            </span>
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Risk Score: {result.risk_score} / 100
          </p>

          {result.matched_keywords && result.matched_keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {result.matched_keywords.map((k) => (
                <span
                  key={k}
                  className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400"
                >
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
