
export interface Activity {
  id: string;
  name: string;
  time: string;
  description?: string;
  timestamp: number;
}

export interface AIInsight {
  summary: string;
  suggestions: string[];
}
