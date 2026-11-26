import type { RosterExpert } from "@ai-panel/shared";
import ColorDot from "../common/ColorDot";

export default function ExpertCard({
  expert,
  onEdit,
}: {
  expert: RosterExpert;
  onEdit?: (e: RosterExpert) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <ColorDot color={expert.color} />
        <span className="truncate text-sm font-semibold text-slate-800">{expert.name}</span>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(expert)}
            className="ml-auto shrink-0 text-xs text-blue-600 hover:underline"
          >
            编辑
          </button>
        )}
      </div>
      <p className="mt-1 truncate text-xs text-slate-500">{expert.title}</p>
      <p className="mt-1 text-xs text-slate-600">{expert.stance}</p>
    </div>
  );
}
