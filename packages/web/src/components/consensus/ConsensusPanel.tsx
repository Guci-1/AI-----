import type { ConsensusSnapshot } from "@ai-panel/shared";
import ConsensusItemView from "./ConsensusItemView";

export default function ConsensusPanel({ consensus }: { consensus: ConsensusSnapshot | null }) {
  if (!consensus) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-slate-400">
        讨论尚未产生共识
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-green-700">共识</h3>
        {consensus.consensus.length === 0 ? (
          <p className="text-xs text-slate-400">暂无共识</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {consensus.consensus.map((item, i) => (
              <ConsensusItemView key={i} item={item} kind="consensus" />
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3 className="mb-2 text-sm font-semibold text-orange-700">分歧</h3>
        {consensus.divergences.length === 0 ? (
          <p className="text-xs text-slate-400">暂无分歧</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {consensus.divergences.map((item, i) => (
              <ConsensusItemView key={i} item={item} kind="divergence" />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
