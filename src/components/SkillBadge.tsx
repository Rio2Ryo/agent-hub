const categoryColors: Record<string, string> = {
  integration: "bg-blue-500/10 text-blue-400",
  development: "bg-violet-500/10 text-violet-400",
  ai: "bg-pink-500/10 text-pink-400",
  utility: "bg-cyan-500/10 text-cyan-400",
  productivity: "bg-orange-500/10 text-orange-400",
  marketing: "bg-yellow-500/10 text-yellow-400",
  ops: "bg-red-500/10 text-red-400",
  meta: "bg-zinc-500/10 text-zinc-400",
};

export default function SkillBadge({ name, category }: { name: string; category?: string }) {
  const cls = category ? categoryColors[category] ?? "bg-zinc-700 text-zinc-300" : "bg-zinc-700 text-zinc-300";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium ${cls}`}>
      {name}
    </span>
  );
}
