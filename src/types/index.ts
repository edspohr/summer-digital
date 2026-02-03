export type UserRole = "Subscriber" | "Participant" | "Admin" | "SuperAdmin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  oasisScore: number; // 1-100
  avatarUrl?: string;
  lastConnection: string; // ISO Date
}

export type NodeType = "video" | "quiz" | "workshop" | "article" | "challenge";
export type NodeStatus = "locked" | "available" | "completed" | "in-progress";

export interface JourneyNode {
  id: string;
  title: string;
  description: string;
  type: NodeType;
  status: NodeStatus;
  x: number; // For map coordinate
  y: number; // For map coordinate
  connections: string[]; // IDs of nodes this node connects TO
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  nodes: JourneyNode[];
}

// CRM Types
export interface NavItem {
  label: string;
  href: string;
  icon?: any;
}
