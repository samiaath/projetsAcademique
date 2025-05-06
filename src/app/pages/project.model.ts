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
  userId: number;      
  projectId: number;    // Global project ID
  teamProjectId: number; // Team project being voted on
  rating: number;       // 1-5 stars
  createdAt: Date;      // When vote was cast
}
export interface supervisor{
    id: number;
    name:string;
}

export interface Project {
  id:number;
  title: string;
  supervisors: supervisor[] ;
  category: string;
  description: string;
  dueDate: string;
  status: string;
  tasks?: Task[];
  votingEnabled: boolean; // Master switch for voting
}

export interface TeamProject extends Project {
  teamProjectId: number;
  teamProjectName: string;
  members: string[];
  // These will be calculated
  voteCount?: number;
  averageRating?: number;
}

export interface Notification {
  id?: number
  sender: string
  destination: string
  message: string
  date: string
  time: string
  type?: "task" | "message"
  isRead?: boolean
  action?: string // URL to navigate to when notification is clicked
  supervisorId?: number // For message notifications, to identify which supervisor to chat with
  teamProjectId?: number // For task notifications, to identify which team project to view
}



 export enum DeliverableType {
  PDF = "pdf",
  GITHUB = "github",
  VIDEO = "video",
}

export interface Deliverable {
  id?: number
  taskId: number
  teamProjectId: number
  type: DeliverableType
  content: string // File name, URL, or link
  submittedAt: Date
  submittedBy: string
}

export interface TaskSubmission {
  taskId: number
  teamProjectId: number
  isCompleted: boolean
  submittedAt: Date
  deliverables: Deliverable[]
}