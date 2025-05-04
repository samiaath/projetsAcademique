// project-details.component.ts
import { Component, type OnInit, ViewChild, type ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { GroupService } from "../services-enseignant/group.service";
import { ProjectDetailsService } from "../services-enseignant/project-details.service";
import { TeamProject, Task, Submission, FileType } from "../models/project2.model";
@Component({
  selector: "app-project-details-e",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./project-details-e.component.html",
  styleUrls: ["./project-details-e.component.scss"],
})
export class ProjectDetailsEComponent implements OnInit {
  project: TeamProject | null = null;
  groupId: number | null = null;
  projectId: number | null = null;
  newMessage = "";
  messages: string[] = [];

  @ViewChild("chatContainer") chatContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private projectDetailsService: ProjectDetailsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.groupId = params["groupId"];
      this.projectId = params["projectId"];

      if (this.groupId && this.projectId) {
        this.loadProject();
      }
    });
  }

  loadProject(): void {
    if (!this.groupId || !this.projectId) return;

    this.groupService.getGroupById(this.groupId).subscribe((group) => {
      if (group) {
        const foundProject = group.projects.find((p) => p.id === this.projectId);
        if (foundProject) {
          this.project = foundProject;
          // Mettre à jour les projectId pour les tâches
          this.projectDetailsService.updateTasksProjectId(this.projectId!);
        }
      }
    });
  }

  // Getter pour accéder aux tâches depuis le service
  get tasks(): Task[] {
    return this.projectDetailsService.getTasks();
  }

  // Getter pour accéder à la tâche actuellement développée
  get expandedTask(): number | null {
    return this.projectDetailsService.getExpandedTask();
  }

  toggleTask(taskId: number): void {
    this.projectDetailsService.toggleTask(taskId);
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      // Ajouter le message à la liste locale pour affichage immédiat
      this.messages.push(this.newMessage);
      
      // Ajouter le message via le service (pour une utilisation future avec backend)
      this.projectDetailsService.addMessage(this.newMessage);
      
      console.log("Message sent:", this.newMessage);
      this.newMessage = "";
      
      // Faire défiler vers le bas après l'envoi du message
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      });
    }
  }

  // Méthodes d'utilitaires de fichiers déléguées au service
  getFileIcon(fileType: string): string {
    return this.projectDetailsService.getFileIcon(fileType);
  }

  getFileColor(fileType: string): string {
    return this.projectDetailsService.getFileColor(fileType);
  }

  getActionLabel(fileType: string): string {
    return this.projectDetailsService.getActionLabel(fileType);
  }

  getActionIcon(fileType: string): string {
    return this.projectDetailsService.getActionIcon(fileType);
  }
}