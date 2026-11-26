import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import CreateDiscussionForm from "../components/home/CreateDiscussionForm";
import DiscussionList from "../components/home/DiscussionList";

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["discussions"],
    queryFn: api.listDiscussions,
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">AI 圆桌讨论</h1>
        <CreateDiscussionForm />
        <div className="mt-6">
          {isLoading ? (
            <p className="text-sm text-slate-400">加载中…</p>
          ) : error ? (
            <p className="text-sm text-red-500">加载失败</p>
          ) : (
            <DiscussionList discussions={data?.discussions ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
