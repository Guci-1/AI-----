import { useState, type FormEvent } from "react";
import type { RosterExpert } from "@ai-panel/shared";

export interface ExpertEditFields {
  name?: string;
  title?: string;
  stance?: string;
  color?: string;
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none";

export default function ExpertEditDialog({
  expert,
  onSave,
  onClose,
}: {
  expert: RosterExpert;
  onSave: (fields: ExpertEditFields) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(expert.name);
  const [title, setTitle] = useState(expert.title);
  const [stance, setStance] = useState(expert.stance);
  const [color, setColor] = useState(expert.color);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, title, stance, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-800">编辑专家</h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            姓名
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            头衔
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            立场
            <input value={stance} onChange={(e) => setStance(e.target.value)} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            色块（十六进制）
            <input value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
