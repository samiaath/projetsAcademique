// project-details.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TeamProject, Task, Submission, FileType } from "../models/project2.model";
import { ChatMessage, FileUtility } from '../models/project2.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService implements FileUtility {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();
  
  private expandedTaskSubject = new BehaviorSubject<number | null>(null);
  expandedTask$: Observable<number | null> = this.expandedTaskSubject.asObservable();
  
  private projectTasksSubject = new BehaviorSubject<Task[]>([]);
  projectTasks$: Observable<Task[]> = this.projectTasksSubject.asObservable();

  constructor() {
    // Initialiser avec les tâches d'exemple
    this.initializeSampleTasks();
  }

  initializeSampleTasks(): void {
    const sampleTasks: Task[] = [
      {
        id: 1,
        name: "User Research & Analysis",
        description: "Understanding target users' needs, preferences, and pain points.",
        deliverables: "Research report",
        dueDate: "2024-05-20",
        isCompleted: false,
        submissions: [
          {
            id: 1,
            fileName: "user-journey.pdf",
            fileType: "pdf",
            fileSize: "4 MB",
            submissionDate: "12/03/2023",
            submittedBy: "Samia THAMEUR",
            fileUrl: "assets/documents/user-journey.pdf",
          },
        ],
      },
      {
        id: 2,
        name: "Concept Development",
        description: "Initial design concepts and component structure.",
        deliverables: "Concept documents",
        dueDate: "2024-06-10",
        isCompleted: false,
        submissions: [
          {
            id: 2,
            fileName: "design-concept.docx",
            fileType: "word",
            fileSize: "2.3 MB",
            submissionDate: "18/03/2023",
            submittedBy: "Eya BOUDIDAH",
            fileUrl: "assets/documents/design-concept.docx",
          },
        ],
      },
      {
        id: 3,
        name: "Prototyping & Testing",
        description: "Create prototypes and conduct user testing",
        deliverables: "Prototype files and test results",
        dueDate: "2024-07-01",
        isCompleted: false,
        submissions: [
          {
            id: 3,
            fileName: "github.com/team/prototype",
            fileType: "git",
            submissionDate: "25/03/2023",
            submittedBy: "Mohamed Ali CHIBANI",
            fileUrl: "https://github.com/team/prototype",
          },
          {
            id: 4,
            fileName: "usability-test.mp4",
            fileType: "video",
            fileSize: "28 MB",
            submissionDate: "27/03/2023",
            submittedBy: "Samia THAMEUR",
            fileUrl: "assets/videos/usability-test.mp4",
          },
        ],
      },
    ];
    
    this.projectTasksSubject.next(sampleTasks);
  }

  // Méthodes pour gérer les tâches
  getTasks(): Task[] {
    return this.projectTasksSubject.value;
  }
  
  updateTasksProjectId(projectId: number): void {
    const tasks = this.projectTasksSubject.value.map(task => ({
      ...task,
      projectId
    }));
    this.projectTasksSubject.next(tasks);
  }
  
  toggleTask(taskId: number): void {
    const currentExpandedTask = this.expandedTaskSubject.value;
    this.expandedTaskSubject.next(currentExpandedTask === taskId ? null : taskId);
  }
  
  getExpandedTask(): number | null {
    return this.expandedTaskSubject.value;
  }

  // Méthodes pour gérer les messages du chat
  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }
  
  addMessage(content: string, sender?: string): void {
    if (content.trim()) {
      const newMessage: ChatMessage = {
        content,
        timestamp: new Date(),
        sender
      };
      
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, newMessage]);
    }
  }
  
  // Utilitaires de fichiers
  getFileIcon(fileType: string): string {
    switch (fileType) {
      case "pdf":
        return "assets/icons/pdf-icon.svg";
      case "word":
        return "assets/icons/word-icon.svg";
      case "git":
        return "assets/icons/git-icon.svg";
      case "video":
        return "assets/icons/video-icon.svg";
      default:
        return "assets/icons/file-icon.svg";
    }
  }

  getFileColor(fileType: string): string {
    switch (fileType) {
      case "pdf":
        return "text-red-500";
      case "word":
        return "text-blue-500";
      case "git":
        return "text-purple-500";
      case "video":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  }

  getActionLabel(fileType: string): string {
    return fileType === "git" ? "Open" : "Download";
  }

  getActionIcon(fileType: string): string {
    return fileType === "git" ? "assets/icons/external-link.svg" : "assets/icons/download.svg";
  }
}