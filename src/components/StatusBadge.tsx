const styles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  online: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  idle: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20",
  degraded: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20",
  error: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",
  offline: "bg-zinc-500/10 text-zinc-400 ring-1 ring-zinc-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  in_progress: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
};

const labels: Record<string, string> = {
  active: "稼働中",
  online: "オンライン",
  idle: "待機中",
  degraded: "低下",
  error: "エラー",
  offline: "オフライン",
  completed: "完了",
  in_progress: "実行中",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-zinc-700 text-zinc-300"}`}>
      {labels[status] ?? status}
    </span>
  );
}
