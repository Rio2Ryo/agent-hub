"use client";
import { agents, devices, skills } from "@/lib/data";
import { useState } from "react";
import Link from "next/link";
import { Bot, Monitor, Search, Zap } from "lucide-react";
import StatusDot from "@/components/StatusDot";
import StatusBadge from "@/components/StatusBadge";

const typeLabels: Record<string, string> = {
  orchestrator: "オーケストレーター",
  coder: "コーダー",
  gateway: "ゲートウェイ",
  assistant: "アシスタント",
  monitor: "モニター",
};

export default function AgentsPage() {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filtered = agents.filter((a) => {
    if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterType !== "all" && a.type !== filterType) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">エージェント</h1>
        <p className="text-sm text-zinc-500 mt-1">全{agents.length}エージェントの管理</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="名前で検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 w-56"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="all">全ステータス</option>
          <option value="active">稼働中</option>
          <option value="idle">待機中</option>
          <option value="error">エラー</option>
          <option value="offline">オフライン</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="all">全タイプ</option>
          <option value="orchestrator">オーケストレーター</option>
          <option value="coder">コーダー</option>
          <option value="gateway">ゲートウェイ</option>
          <option value="assistant">アシスタント</option>
          <option value="monitor">モニター</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((agent) => {
          const device = devices.find((d) => d.id === agent.deviceId);
          const agentSkills = skills.filter((s) => agent.skillIds.includes(s.id));
          return (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusDot status={agent.status} pulse />
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white">{agent.name}</h3>
                </div>
                <StatusBadge status={agent.status} />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">{typeLabels[agent.type]}</span>
                <span className="text-xs font-mono text-zinc-500">{agent.llm}</span>
              </div>
              {agent.description && (
                <p className="text-xs text-zinc-500 mb-3 line-clamp-2 leading-relaxed">{agent.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span className="flex items-center gap-1"><Monitor size={11} />{device?.name}</span>
                <span className="flex items-center gap-1"><Zap size={11} />{agentSkills.length} スキル</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
