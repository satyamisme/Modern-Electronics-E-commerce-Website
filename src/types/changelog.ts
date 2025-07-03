export interface ChangelogEntry {
  id: string;
  version: string;
  date: Date;
  author: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'security' | 'breaking';
  title: string;
  description: string;
  changes: ChangeItem[];
  tags?: string[];
}

export interface ChangeItem {
  id: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  component?: string;
  impact?: 'low' | 'medium' | 'high';
}

export interface ChangelogFilter {
  type?: string;
  author?: string;
  dateRange?: [Date, Date];
  tags?: string[];
}