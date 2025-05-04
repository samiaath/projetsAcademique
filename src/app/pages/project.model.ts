// project.model.ts

export interface Task {
  id: number;
  name: string;
  description: string;
  deliverables: string;
  dueDate: string;
  status: string;
  isCompleted?: boolean  
}

export interface Vote {
  userId: string;       // User who voted
  projectId: string;    // Global project ID
  teamProjectId: string; // Team project being voted on
  rating: number;       // 1-5 stars
  createdAt: Date;      // When vote was cast
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  dueDate: string;
  status: string;
  tasks?: Task[];
  votingEnabled: boolean; // Master switch for voting
}

export interface TeamProject extends Project {
  teamProjectId: string;
  teamProjectName: string;
  members: string[];
  // These will be calculated
  voteCount?: number;
  averageRating?: number;
}

export interface Notification {
  sender: string;
  message: string;
  date: string;
  time: string;
  
}

