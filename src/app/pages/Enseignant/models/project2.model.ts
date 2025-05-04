// project.model.ts
/* -------Debut--------*/

export interface Task {
  id: number; //li aandi type string a changer
  name: string; //andi title
  description?: string;
  status?: string;
  startDate?: Date; //zeyed aali aand samia
  deliverables?: string;
  dueDate: string; //deadline
  isCompleted?: boolean  
  submissions?: Submission[]; //zeyda aala samia
}

///////////////////

export type FileType = "pdf" | "word" | "git" | "video"

/**
 * Représente une soumission pour une tâche
 */
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

//zeyda aala samia
export interface Group {
  id: number;
  title: string;
  projects: TeamProject[];
}
/////////////

export interface Project {
  id: number;
  title: string; //namefl home fl archive shiha title
  category: string;
  description: string;
  dueDate: string; //deadline
  maxStudents: number; //zeyda aala li aand samia
  tasks?: Task[];  
  assignedTo: string; //zeyda moch logique jimla 
  status?: string;
  date?: string; //zeydin aala samia
  year?: string; //zeydin aala samia
  domain?: string; //zeyda aala samia
}
export interface TeamProject extends Project {
  teamProjectId: number; //andi id ena
  teamProjectName: string; // aandi name
  members: string[]; //name aandi li chtawali members[] fi oudh l avatar 
}

export interface Notification {
  id?: number; // Identifiant unique de la notification
  title: string; // Titre de la notification
  sender: string; // Expéditeur de la notification
  destination?: string;
  message: string; // Contenu du message
  isRead?: boolean // Statut de lecture (true = lu, false = non lu)
  createdAt?: Date; // Date de création de la notification
  time: string; // Heure formatée (par exemple, "14:30")
  date: string; // Date formatée (par exemple, "12/05/2025")
  type?: "task" | "message"; // Type optionnel pour getIconBgColor (par exemple, 'assignment', 'message', 'task')
  action?: string // URL to navigate to when notification is clicked
  groupId?: number // For message notifications, to identify which supervisor to chat with
  teamProjectId?: number // For task notifications, to identify which team project to view
}

/* -------Fin--------*/








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