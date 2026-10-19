export type Invention = {
  id: string;
  title: string;
  summary: string;
  category: string;
  stage: string;
  risk: "Low" | "Medium" | "High";
  license: string;
  interest: number;
  owner: { name: string; initials: string };
  updated: string;
  tags: string[];
  art: string;
  symbol: string;
  isSavedProject?: boolean;
  savedDocument?: Record<string, unknown>;
};

// Intentionally empty in the deployed generator; historical samples live in /archive.
export const inventions: Invention[] = [];
export const priorArt: Array<Record<string, unknown>> = [];
