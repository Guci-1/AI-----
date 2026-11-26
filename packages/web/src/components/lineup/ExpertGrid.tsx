import type { RosterExpert } from "@ai-panel/shared";
import ExpertCard from "./ExpertCard";

export default function ExpertGrid({
  experts,
  onEdit,
}: {
  experts: RosterExpert[];
  onEdit?: (e: RosterExpert) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {experts.map((e) => (
        <ExpertCard key={e.id} expert={e} onEdit={onEdit} />
      ))}
    </div>
  );
}
