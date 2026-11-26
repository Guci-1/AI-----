import type { ConsensusItem } from "@ai-panel/shared";

export default function ConsensusItemView({
  item,
  kind,
}: {
  item: ConsensusItem;
  kind: "consensus" | "divergence";
}) {
  const isConsensus = kind === "consensus";
  return (
    <li
      className={`rounded-lg border p-3 ${
        isConsensus ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
      }`}
    >
      <p className="text-sm text-slate-800">{item.statement}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {item.supporters.map((name) => (
          <span
            key={`s-${name}`}
            className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700"
          >
            支持 {name}
          </span>
        ))}
        {item.opponents.map((name) => (
          <span
            key={`o-${name}`}
            className="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-700"
          >
            反对 {name}
          </span>
        ))}
      </div>
    </li>
  );
}
