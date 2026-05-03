export interface Device {
  id: string;
  name: string;
  hostname: string;
  platform: string;
  ip?: string;
  status: "online" | "offline" | "degraded";
  lastSeen: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  type: "orchestrator" | "coder" | "gateway" | "assistant" | "monitor";
  llm: string;
  status: "active" | "idle" | "error" | "offline";
  description?: string;
  avatar?: string;
  deviceId: string;
  skillIds: string[];
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  category: string;
}

export interface Activity {
  id: string;
  agentId: string;
  type: string;
  summary: string;
  details?: string;
  status: "completed" | "error" | "in_progress";
  duration?: number;
  createdAt: string;
}

export interface Session {
  id: string;
  agentId: string;
  startedAt: string;
  endedAt?: string;
  status: "active" | "completed" | "error";
  tokenUsed: number;
  messages: number;
}

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalDevices: number;
  onlineDevices: number;
  totalActivities: number;
  activeSessions: number;
  totalTokensUsed: number;
}
