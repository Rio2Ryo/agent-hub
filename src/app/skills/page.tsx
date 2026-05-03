import { skills, agents } from "@/lib/data";
import SkillBadge from "@/components/SkillBadge";
import StatusDot from "@/components/StatusDot";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  integration: "インテグレーション", development: "開発", ai: "AI",
  utility: "ユーティリティ", productivity: "生産性", marketing: "マーケティング",
  ops: "Ops", meta: "メタ",
};

export default function SkillsPage() {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">スキル</h1>
        <p className="text-sm text-zinc-500 mt-1">全{skills.length}スキルの管理</p>
      </div>
      <div className="space-y-6">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat);
          return (
            <div key={cat}>
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{categoryLabels[cat] ?? cat}</h2>
              <div className="grid grid-cols-3 gap-3">
                {catSkills.map((sk) => {
                  const owners = agents.filter((a) => a.skillIds.includes(sk.id));
                  return (
                    <div key={sk.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <SkillBadge name={sk.name} category={sk.category} />
                      </div>
                      {sk.description && (
                        <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{sk.description}</p>
                      )}
                      {owners.length > 0 && (
                        <div>
                          <p className="text-xs text-zinc-600 mb-1.5">使用エージェント</p>
                          <div className="flex flex-wrap gap-1.5">
                            {owners.map((ag) => (
                              <Link
                                key={ag.id}
                                href={`/agents/${ag.id}`}
                                className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors"
                              >
                                <StatusDot status={ag.status} />
                                {ag.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
