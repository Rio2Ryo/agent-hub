import { devices, agents } from "@/lib/data";
import StatusDot from "@/components/StatusDot";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { Bot, Cpu } from "lucide-react";

const platformIcon: Record<string, string> = {
  macOS: "🍎", Linux: "🐧", Android: "🤖", Windows: "🪟",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function DevicesPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">デバイス</h1>
        <p className="text-sm text-zinc-500 mt-1">全{devices.length}デバイスの稼働状況</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {devices.map((device) => {
          const deviceAgents = agents.filter((a) => a.deviceId === device.id);
          const activeCount = deviceAgents.filter((a) => a.status === "active").length;
          return (
            <div key={device.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">
                    {platformIcon[device.platform] ?? "💻"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusDot status={device.status} pulse />
                      <h3 className="text-sm font-semibold text-zinc-200">{device.name}</h3>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">{device.hostname}</p>
                  </div>
                </div>
                <StatusBadge status={device.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                <div className="bg-zinc-800/60 rounded-lg p-2 text-center">
                  <div className="text-zinc-400 font-medium">{device.platform}</div>
                  <div className="text-zinc-600">OS</div>
                </div>
                <div className="bg-zinc-800/60 rounded-lg p-2 text-center">
                  <div className="text-zinc-400 font-medium">{device.ip ?? "—"}</div>
                  <div className="text-zinc-600">IP</div>
                </div>
                <div className="bg-zinc-800/60 rounded-lg p-2 text-center">
                  <div className="text-zinc-400 font-medium">{fmtTime(device.lastSeen)}</div>
                  <div className="text-zinc-600">最終確認</div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-500 mb-2">
                  <Bot size={12} />
                  <span>エージェント ({activeCount}稼働中 / {deviceAgents.length}合計)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {deviceAgents.map((ag) => (
                    <Link
                      key={ag.id}
                      href={`/agents/${ag.id}`}
                      className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                      <StatusDot status={ag.status} />
                      <span className="text-xs text-zinc-300">{ag.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
