import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export default function CreateDiscussionForm() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const d = await api.createDiscussion({ topic: topic.trim(), expertCount: count });
      navigate(`/d/${d.id}/lineup`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-600">话题</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={200}
            placeholder="输入讨论话题"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">专家人数</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} 位
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting || !topic.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "创建中…" : "开始讨论"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
}
