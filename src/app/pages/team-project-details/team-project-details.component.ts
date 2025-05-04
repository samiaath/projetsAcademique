import { Component, type OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { ProjectService } from "../../services/project.service"
import type { TeamProject, Task } from "../project.model"
import { DeliverablesModalComponent } from "../delivrables-modal/delivrables-modal.component"

@Component({
  selector: "app-team-project-details",
  standalone: true,
  imports: [CommonModule, FormsModule, DeliverablesModalComponent],
  templateUrl: "./team-project-details.component.html",
  styleUrls: ["./team-project-details.component.scss"],
})
export class TeamProjectDetailsComponent implements OnInit {
  teamProject?: TeamProject
  showSubmissionModal = false
  selectedTask?: Task
  uploadedFiles: { name: string; size: number; type: string }[] = []

  // New property for deliverables modal
  showDeliverablesModal = false

  // Properties for deliverable submission
  deliverableType: "pdf" | "github" | "video" = "pdf"
  githubLink = ""
  videoLink = ""

  // Track which deliverables have been added
  hasPdfFile = false
  hasGithubLink = false
  hasVideoFile = false

  // Track if we're editing an existing submission
  isEditing = false

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    console.log("Team Project ID:", id)
    if (id) {
      this.projectService.getAllTeamProjects().subscribe((projects) => {
        this.teamProject = projects.find((tp) => tp.teamProjectId === id)

        // Initialize isCompleted property for each task if it doesn't exist
        if (this.teamProject && this.teamProject.tasks) {
          this.teamProject.tasks = this.teamProject.tasks.map((task) => ({
            ...task,
            isCompleted: task.isCompleted || false,
          }))
        }

        console.log("Team project loaded:", this.teamProject)
      })
    }
  }

  getCurrentDate(): string {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
  }

  getTaskStatusClass(status: string): string {
    if (status.includes("Left")) {
      return "bg-red-100 text-red-800"
    } else if (status.includes("Week")) {
      return "bg-yellow-100 text-yellow-800"
    } else if (status.includes("Start")) {
      return "bg-green-100 text-green-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  openTaskSubmissionModal(task: Task): void {
    this.selectedTask = task
    this.showSubmissionModal = true
    this.isEditing = task.isCompleted || false

    // Reset deliverable state
    this.deliverableType = "pdf"
    this.githubLink = ""
    this.videoLink = ""
    this.uploadedFiles = []
    this.hasPdfFile = false
    this.hasGithubLink = false
    this.hasVideoFile = false

    // If we're editing, populate the form with existing data
    if (this.isEditing && task.deliverables) {
      const deliverables = task.deliverables.split(/[|,]/).map((d) => d.trim())

      deliverables.forEach((d) => {
        if (d.toLowerCase().includes("github")) {
          this.deliverableType = "github"
          this.githubLink = d.split(":")[1]?.trim() || ""
          this.hasGithubLink = true
        } else if (d.toLowerCase().includes("video")) {
          this.deliverableType = "video"
          if (d.includes("http")) {
            this.videoLink = d.split(":")[1]?.trim() || ""
          } else {
            this.uploadedFiles = [{ name: d.split(":")[1]?.trim() || "Video file", size: 0, type: "video/mp4" }]
          }
          this.hasVideoFile = true
        } else if (d.toLowerCase().includes("pdf")) {
          this.deliverableType = "pdf"
          this.uploadedFiles = [{ name: d.split(":")[1]?.trim() || "PDF file", size: 0, type: "application/pdf" }]
          this.hasPdfFile = true
        }
      })
    }
  }

  closeSubmissionModal(): void {
    this.showSubmissionModal = false
    this.selectedTask = undefined
    this.uploadedFiles = []
    this.isEditing = false
  }
// Add these properties to your component class
uploadedPdfFile: File | null = null;
uploadedVideoFile: File | null = null;
pdfUrl: string | null = null;
videoUrl: string | null = null;

// Update your onFileSelected method
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    if (this.deliverableType === "pdf") {
      this.uploadedPdfFile = file;
      this.hasPdfFile = true;
      this.pdfUrl = URL.createObjectURL(file);
      console.log("PDF file uploaded:", file.name);
    } else if (this.deliverableType === "video") {
      this.uploadedVideoFile = file;
      this.hasVideoFile = true;
      this.videoUrl = URL.createObjectURL(file);
      console.log("Video file uploaded:", file.name);
    }
  }
}

// Update removeDeliverable method
removeDeliverable(type: "pdf" | "github" | "video"): void {
  if (type === "pdf") {
    this.hasPdfFile = false;
    this.uploadedPdfFile = null;
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = null;
    }
  } else if (type === "github") {
    this.hasGithubLink = false;
    this.githubLink = "";
  } else if (type === "video") {
    this.hasVideoFile = false;
    this.videoLink = "";
    this.uploadedVideoFile = null;
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
      this.videoUrl = null;
    }
  }
}



  addGithubLink(): void {
    if (this.githubLink && this.githubLink.trim() !== "") {
      this.hasGithubLink = true
      console.log("GitHub link added:", this.githubLink)
    }
  }

  addVideoLink(): void {
    if (this.videoLink && this.videoLink.trim() !== "") {
      this.hasVideoFile = true
      console.log("Video link added:", this.videoLink)
    }
  }

  

  // Check if the task deadline has passed
  isDeadlinePassed(dueDate: string): boolean {
    const today = new Date()
    const deadline = new Date(dueDate)
    return today > deadline
  }

  // Delete a submission
  deleteSubmission(): void {
    if (this.selectedTask && this.teamProject && this.teamProject.tasks) {
      const taskIndex = this.teamProject.tasks.findIndex((t) => t.id === this.selectedTask!.id)
      if (taskIndex !== -1) {
        this.teamProject.tasks[taskIndex] = {
          ...this.teamProject.tasks[taskIndex],
          isCompleted: false,
          deliverables: "",
        }
      }
    }
    this.closeSubmissionModal()
  }

  // Submit or update a task
  submitTask(): void {
    if (!this.selectedTask || !this.teamProject || !this.teamProject.tasks) {
      return;
    }
  
    const deliverables = [];
  
    // Handle PDF
    if (this.hasPdfFile && this.uploadedPdfFile) {
      deliverables.push(`PDF: ${this.uploadedPdfFile.name}`);
    }
  
    // Handle GitHub
    if (this.hasGithubLink && this.githubLink) {
      deliverables.push(`GitHub: ${this.githubLink}`);
    }
  
    // Handle Video
    if (this.hasVideoFile) {
      if (this.videoLink) {
        deliverables.push(`Video: ${this.videoLink}`);
      } else if (this.uploadedVideoFile) {
        deliverables.push(`Video: ${this.uploadedVideoFile.name}`);
      }
    }
  
    // Update the task
    const taskIndex = this.teamProject.tasks.findIndex((t) => t.id === this.selectedTask!.id);
    if (taskIndex !== -1) {
      this.teamProject.tasks[taskIndex] = {
        ...this.teamProject.tasks[taskIndex],
        isCompleted: true,
        deliverables: deliverables.join(" | "),
      };
    }
    this.closeSubmissionModal();
  }

  getFormattedStatus(status: string): string {
    if (status === "Not Started") {
      return "Not Started"
    } else if (status.includes("Left")) {
      return status
    } else if (status.includes("Week")) {
      return "1 Week to Start"
    } else {
      return status
    }
  }

  // New methods for deliverables modal
  openDeliverablesModal(): void {
    if (this.teamProject) {
      this.showDeliverablesModal = true
    }
  }

  closeDeliverablesModal(): void {
    this.showDeliverablesModal = false
  }

  // Method to check if the team has any completed tasks with deliverables
  hasDeliverables(): boolean {
    if (!this.teamProject || !this.teamProject.tasks) return false

    return this.teamProject.tasks.some(
      (task) =>
        task.isCompleted &&
        (task.deliverables.toLowerCase().includes("github") ||
          task.deliverables.toLowerCase().includes("video") ||
          task.deliverables.toLowerCase().includes("pdf")),
    )
  }

  // Helper method to check if any deliverable has been added
  hasAnyDeliverable(): boolean {
    return this.hasPdfFile || this.hasGithubLink || this.hasVideoFile
  }
}
