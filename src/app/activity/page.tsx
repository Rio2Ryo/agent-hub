"use client";
import { activities, agents } from "@/lib/data";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import StatusDot from "@/components/StatusDot";

const activityIcons: Record<string, string> = {
  "email-check": "📧", "ad-monitor": "📈", heartbeat: "💓", relay: "🔀",
  healthcheck: "🛡", coding: "💻", "pr-review": "👁", "pr-creation": "🔀",
  webhook: "🪝", query: "💬", development: "🚀",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}
function fmtDuration(sec?: number) {
  if (!sec) return "-";
  if (sec < 60) return `${sec}秒`;
  if (sec < 3600) return `${Math.floor(sec / 60)}分`;
  return `${Math.floor(sec / 3600)}時間`;
}

export default function ActivityPage() {
  const [filterAgent, setFilterAgent] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const sorted = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((a) => {
      if (filterAgent !== "all" && a.agentId !== filterAgent) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      return true;
    });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">アクティビティ</h1>
        <p className="text-sm text-zinc-500 mt-1">全エージェントの活動履歴</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="all">全エージェント</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="all">全ステータス</option>
          <option value="completed">完了</option>
          <option value="error">エラー</option>
          <option value="in_progress">実行中</option>
        </select>
        <span className="text-xs text-zinc-600 ml-2">{sorted.length}件</span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-xs text-zinc-500">
              <th className="text-left px-4 py-3 font-medium w-10"></th>
              <th className="text-left px-4 py-3 font-medium">サマリー</th>
              <th className="text-left px-4 py-3 font-medium">エージェント</th>
              <th className="text-left px-4 py-3 font-medium">タイプ</th>
              <th className="text-left px-4 py-3 font-medium">時間</th>
              <th className="text-left px-4 py-3 font-medium">日時</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((act) => {
              const agent = agents.find((a) => a.id === act.agentId);
              const icon = activityIcons[act.type] ?? "⚡";
              return (
                <tr key={act.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 text-sm">{icon}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusDot status={act.status} />
                      <span className="text-sm text-zinc-300 line-clamp-1">{act.summary}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{agent?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">{act.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500 font-mono">{fmtDuration(act.duration)}</td>
                  <td className="px-4 py-3 text-xs text-zinc-600">{fmtDate(act.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
