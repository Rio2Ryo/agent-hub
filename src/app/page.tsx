import { agents, devices, activities, sessions } from "@/lib/data";
import { Bot, Monitor, Zap, MessageSquare, Cpu } from "lucide-react";
import StatusDot from "@/components/StatusDot";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

function fmtTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}

function fmtTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

const activityIcons: Record<string, string> = {
  "email-check": "📧",
  "ad-monitor": "📈",
  heartbeat: "💓",
  relay: "🔀",
  healthcheck: "🛡",
  coding: "💻",
  "pr-review": "👁",
  "pr-creation": "🔀",
  webhook: "🪝",
  query: "💬",
  development: "🚀",
  default: "⚡",
};

export default function Dashboard() {
  const activeAgents = agents.filter((a) => a.status === "active").length;
  const onlineDevices = devices.filter((d) => d.status === "online").length;
  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const totalTokens = sessions.reduce((sum, s) => sum + s.tokenUsed, 0);
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const stats = [
    { label: "エージェント", value: agents.length, sub: `${activeAgents}稼働中`, icon: Bot, color: "text-violet-400" },
    { label: "デバイス", value: devices.length, sub: `${onlineDevices}オンライン`, icon: Monitor, color: "text-blue-400" },
    { label: "セッション", value: sessions.length, sub: `${activeSessions}アクティブ`, icon: Zap, color: "text-yellow-400" },
    { label: "メッセージ", value: sessions.reduce((s, x) => s + x.messages, 0), sub: "累計", icon: MessageSquare, color: "text-emerald-400" },
    { label: "トークン使用量", value: fmtTokens(totalTokens), sub: "全セッション合計", icon: Cpu, color: "text-pink-400" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">ダッシュボード</h1>
        <p className="text-sm text-zinc-500 mt-1">エージェント・デバイス稼働状況の概要</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <div className="text-2xl font-bold text-zinc-100">{value}</div>
            <div className="text-xs text-zinc-500 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Agent grid */}
        <div className="col-span-3">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">エージェント一覧</h2>
          <div className="grid grid-cols-2 gap-3">
            {agents.map((agent) => {
              const device = devices.find((d) => d.id === agent.deviceId);
              return (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusDot status={agent.status} pulse />
                      <span className="text-sm font-medium text-zinc-200 group-hover:text-white">{agent.name}</span>
                    </div>
                    <StatusBadge status={agent.status} />
                  </div>
                  <div className="text-xs text-zinc-500 mb-2 font-mono">{agent.llm}</div>
                  <div className="flex items-center gap-1 text-xs text-zinc-600">
                    <Monitor size={11} />
                    {device?.name ?? "不明"}
                  </div>
                  <div className="mt-2 text-xs text-zinc-600">{agent.skillIds.length} スキル</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Activity feed */}
        <div className="col-span-2">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">最近のアクティビティ</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
            {recentActivities.map((act) => {
              const agent = agents.find((a) => a.id === act.agentId);
              const icon = activityIcons[act.type] ?? activityIcons.default;
              return (
                <div key={act.id} className="px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm mt-0.5">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-300 leading-snug line-clamp-2">{act.summary}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-600">{agent?.name}</span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-xs text-zinc-600">{fmtTime(act.createdAt)}</span>
                        {act.status === "error" && (
                          <span className="text-xs text-red-400">⚠ エラー</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
