export interface ContentBlock {
  id: string;
  type: 'todo' | 'note' | 'mood' | 'event';
  title: string;
  content?: string;
  completed?: boolean;
  subtasks?: SubTask[];
  mood?: string;
  moodText?: string;
  startTime?: string;
  endTime?: string;
  expanded?: boolean;
  createdAt: number;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface DayData {
  date: string;
  blocks: ContentBlock[];
}

export interface WeekData {
  [key: string]: DayData;
}

export type ContentType = 'todo' | 'note' | 'mood' | 'event';