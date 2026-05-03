const colors: Record<string, string> = {
  active: "bg-emerald-500",
  online: "bg-emerald-500",
  idle: "bg-yellow-500",
  degraded: "bg-yellow-500",
  error: "bg-red-500",
  offline: "bg-zinc-600",
  completed: "bg-emerald-500",
  in_progress: "bg-blue-500",
};

export default function StatusDot({ status, pulse }: { status: string; pulse?: boolean }) {
  const color = colors[status] ?? "bg-zinc-500";
  return (
    <span className="relative flex h-2.5 w-2.5 items-center justify-center flex-shrink-0">
      {pulse && (status === "active" || status === "online" || status === "in_progress") && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${color}`} />
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
    </span>
  );
}
