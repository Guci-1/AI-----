import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RosterExpert } from "@ai-panel/shared";
import { api } from "../lib/api";
import HostCard from "../components/lineup/HostCard";
import ExpertGrid from "../components/lineup/ExpertGrid";
import ExpertEditDialog, {
  type ExpertEditFields,
} from "../components/lineup/ExpertEditDialog";

export default function LineupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["discussion", id],
    queryFn: () => api.getDiscussion(id!),
    enabled: !!id,
  });

  const [experts, setExperts] = useState<RosterExpert[]>([]);
  const [editing, setEditing] = useState<RosterExpert | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data?.lineup) setExperts(data.lineup.experts);
  }, [data?.lineup]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-slate-500">加载中…</div>;
  }
  if (error || !data) {
    return <div className="flex h-screen items-center justify-center text-red-500">加载失败</div>;
  }
  if (data.status === "generating" || !data.lineup) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">阵容生成中…</div>
    );
  }

  const handleSave = async (fields: ExpertEditFields) => {
    if (!editing) return;
    setExperts((prev) => prev.map((e) => (e.id === editing.id ? { ...e, ...fields } : e)));
    try {
      await api.editLineup(id!, editing.id, fields);
    } catch {
      // 持久化失败时保留本地视觉，不阻断
    }
  };

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await api.confirm(id!);
      navigate(`/d/${id}/studio`);
    } catch {
      setBusy(false);
    }
  };

  const handleRegenerate = async () => {
    setBusy(true);
    try {
      await api.regenerate(id!);
      await queryClient.invalidateQueries({ queryKey: ["discussion", id] });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-xl font-bold text-slate-900">{data.topic}</h1>
        <p className="mb-4 text-sm text-slate-500">确认你的专家阵容</p>
        <HostCard host={data.lineup.host} />
        <div className="mt-4">
          <ExpertGrid experts={experts} onEdit={setEditing} />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            确认阵容
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={busy}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            重新生成
          </button>
        </div>
      </div>
      {editing && (
        <ExpertEditDialog
          expert={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
