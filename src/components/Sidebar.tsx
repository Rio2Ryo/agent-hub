"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Monitor, Zap, Activity } from "lucide-react";

const nav = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/agents", label: "エージェント", icon: Bot },
  { href: "/devices", label: "デバイス", icon: Monitor },
  { href: "/skills", label: "スキル", icon: Zap },
  { href: "/activity", label: "アクティビティ", icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col z-50">
      <div className="px-4 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm text-zinc-100">Agent Hub</span>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-600">OpenClaw v2</p>
      </div>
    </aside>
  );
}
