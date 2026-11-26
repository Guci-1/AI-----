import type { DiscussionSummary } from "@ai-panel/shared";
import DiscussionCard from "./DiscussionCard";

interface Section {
  title: string;
  items: DiscussionSummary[];
}

function group(discussions: DiscussionSummary[]): Section[] {
  return [
    {
      title: "进行中",
      items: discussions.filter((d) => d.status === "running" || d.status === "paused"),
    },
    {
      title: "待确认",
      items: discussions.filter((d) => d.status === "ready" || d.status === "generating"),
    },
    { title: "已完成", items: discussions.filter((d) => d.status === "finished") },
    { title: "已中断", items: discussions.filter((d) => d.status === "interrupted") },
  ];
}

export default function DiscussionList({ discussions }: { discussions: DiscussionSummary[] }) {
  const sections = group(discussions);
  return (
    <div className="flex flex-col gap-6">
      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="mb-2 text-sm font-semibold text-slate-600">{s.title}</h2>
          {s.items.length === 0 ? (
            <p className="text-sm text-slate-400">暂无讨论</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {s.items.map((d) => (
                <DiscussionCard key={d.id} d={d} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
