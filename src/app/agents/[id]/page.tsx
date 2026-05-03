import { agents, devices, skills, activities, sessions } from "@/lib/data";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import StatusDot from "@/components/StatusDot";
import SkillBadge from "@/components/SkillBadge";
import { Monitor, Calendar, MessageSquare, Cpu, Clock } from "lucide-react";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function fmtDuration(sec?: number) {
  if (!sec) return "-";
  if (sec < 60) return `${sec}秒`;
  if (sec < 3600) return `${Math.floor(sec / 60)}分`;
  return `${Math.floor(sec / 3600)}時間`;
}
function fmtTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

const typeLabels: Record<string, string> = {
  orchestrator: "オーケストレーター", coder: "コーダー", gateway: "ゲートウェイ",
  assistant: "アシスタント", monitor: "モニター",
};

const activityIcons: Record<string, string> = {
  "email-check": "📧", "ad-monitor": "📈", heartbeat: "💓", relay: "🔀",
  healthcheck: "🛡", coding: "💻", "pr-review": "👁", "pr-creation": "🔀",
  webhook: "🪝", query: "💬", development: "🚀",
};

export async function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = agents.find((a) => a.id === params.id);
  if (!agent) notFound();
  const device = devices.find((d) => d.id === agent.deviceId);
  const agentSkills = skills.filter((s) => agent.skillIds.includes(s.id));
  const agentActivities = activities
    .filter((a) => a.agentId === agent.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const agentSessions = sessions
    .filter((s) => s.agentId === agent.id)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  const totalTokens = agentSessions.reduce((s, x) => s + x.tokenUsed, 0);

  return (
    <div className="p-8">
      {/* Hero */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusDot status={agent.status} pulse />
              <h1 className="text-2xl font-bold text-zinc-100">{agent.name}</h1>
              <StatusBadge status={agent.status} />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">{typeLabels[agent.type]}</span>
              <span className="text-sm font-mono text-zinc-500">{agent.llm}</span>
            </div>
            {agent.description && <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">{agent.description}</p>}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
              <Monitor size={14} />
              <span>{device?.name}</span>
              <StatusBadge status={device?.status ?? "offline"} />
            </div>
            <div className="text-xs text-zinc-600">{device?.hostname} · {device?.platform}</div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-zinc-800">
          {[
            { label: "総トークン", value: fmtTokens(totalTokens), icon: Cpu },
            { label: "セッション数", value: agentSessions.length, icon: Calendar },
            { label: "アクティビティ", value: agentActivities.length, icon: Clock },
            { label: "メッセージ数", value: agentSessions.reduce((s, x) => s + x.messages, 0), icon: MessageSquare },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon size={16} className="text-zinc-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-zinc-200">{value}</div>
              <div className="text-xs text-zinc-600">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">スキル ({agentSkills.length})</h2>
        <div className="flex flex-wrap gap-2">
          {agentSkills.map((sk) => (
            <SkillBadge key={sk.id} name={sk.name} category={sk.category} />
          ))}
          {agentSkills.length === 0 && <p className="text-sm text-zinc-600">スキルなし</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Activity timeline */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">アクティビティ履歴</h2>
          {agentActivities.length === 0 ? (
            <p className="text-sm text-zinc-600">記録なし</p>
          ) : (
            <div className="space-y-4">
              {agentActivities.map((act, i) => (
                <div key={act.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      act.status === "error" ? "bg-red-500/20" : act.status === "in_progress" ? "bg-blue-500/20" : "bg-emerald-500/10"
                    }`}>
                      {activityIcons[act.type] ?? "⚡"}
                    </div>
                    {i < agentActivities.length - 1 && <div className="w-px flex-1 bg-zinc-800 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-zinc-300 leading-snug">{act.summary}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-600">{fmtDate(act.createdAt)}</span>
                      {act.duration && <span className="text-xs text-zinc-600">· {fmtDuration(act.duration)}</span>}
                      {act.status === "error" && <span className="text-xs text-red-400">⚠ エラー</span>}
                      {act.status === "in_progress" && <span className="text-xs text-blue-400">● 実行中</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sessions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">セッション</h2>
          {agentSessions.length === 0 ? (
            <p className="text-sm text-zinc-600">記録なし</p>
          ) : (
            <div className="space-y-3">
              {agentSessions.map((ses) => (
                <div key={ses.id} className="border border-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={ses.status} />
                    <span className="text-xs text-zinc-600">{fmtDate(ses.startedAt)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm font-semibold text-zinc-200">{fmtTokens(ses.tokenUsed)}</div>
                      <div className="text-xs text-zinc-600">トークン</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-200">{ses.messages}</div>
                      <div className="text-xs text-zinc-600">メッセージ</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-200">
                        {ses.endedAt ? fmtDuration((new Date(ses.endedAt).getTime() - new Date(ses.startedAt).getTime()) / 1000) : "継続中"}
                      </div>
                      <div className="text-xs text-zinc-600">時間</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
