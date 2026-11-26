import type { ExpertView } from "../../lib/types";
import ExpertStatusWindow from "./ExpertStatusWindow";

export default function ExpertStage({ experts }: { experts: ExpertView[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
      {experts.map((e) => (
        <ExpertStatusWindow key={e.id} expert={e} />
      ))}
    </div>
  );
}
