export interface Task {
  id: number; 
  name: string;
  description?: string;
  status?: string;
  startDate?: Date; 
  deliverables?: string;
  dueDate: string; 
  isCompleted?: boolean  
  submissions?: Submission[]; 
}

export type FileType = "pdf" | "word" | "git" | "video"
export interface Submission {
  id: number
  fileName: string
  fileType: FileType
  fileSize?: string
  submissionDate: string
  submittedBy: string
  fileUrl: string
}
export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}
export interface Group {
  id: number;
  title: string;
  projects: TeamProject[];
}
export interface Project {
  id?: number;
  title: string; 
  category?: string;
  description?: string;
  dueDate?: string; 
  maxStudents?: number; 
  tasks?: Task[];  
  assignedTo?: string[]; 
  status?: string;
  date?: string; 
  year?: string; 
  domain?: string; 
}
export interface TeamProject extends Project {
  teamProjectId: number; 
  teamProjectName: string; 
  members: string[]; 
}
export interface Notification {
  id?: number; 
  title: string; 
  sender: string; 
  destination?: string;
  message: string; 
  isRead?: boolean;
  createdAt?: Date; 
  time: string; 
  date: string; 
  type?: "task" | "message"; 
  action?: string  
  groupId?: number
  teamProjectId?: number;
}
export interface ChatMessage {
  content: string;
  timestamp: Date;
  sender?: string;
}
// Interface pour les utilitaires de fichiers
export interface FileUtility {
  getFileIcon(fileType: string): string;
  getFileColor(fileType: string): string;
  getActionLabel(fileType: string): string;
  getActionIcon(fileType: string): string;
}