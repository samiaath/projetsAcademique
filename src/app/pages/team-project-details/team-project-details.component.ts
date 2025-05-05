import { Component, type OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { ProjectService } from "../../services/project.service"
import  { NotificationService } from "../../services/notification.service"
import type { TeamProject, Task, Deliverable, DeliverableType } from "../project.model"
import { DeliverablesModalComponent } from "../delivrables-modal/delivrables-modal.component"
import { ChatSectionComponent } from "../chat-section/chat-section.component"

@Component({
  selector: "app-team-project-details",
  standalone: true,
  imports: [CommonModule, FormsModule, DeliverablesModalComponent, ChatSectionComponent],
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

  // Add these properties to your component class
  uploadedPdfFile: File | null = null
  uploadedVideoFile: File | null = null
  pdfUrl: string | null = null
  videoUrl: string | null = null

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private projectService: ProjectService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")
    console.log("Team Project ID:", idParam)
    if (idParam) {
      const id = Number.parseInt(idParam, 10)
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

        // Check if we were directed here from a notification
        const supervisorId = this.route.snapshot.queryParamMap.get("supervisorId")
        if (supervisorId) {
          // Handle any specific actions needed when coming from a notification
          console.log("Accessed from notification with supervisor ID:", supervisorId)
        }
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
    if (!task) {
      console.error("Cannot open submission modal: Task is undefined")
      return
    }

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
    this.uploadedPdfFile = null
    this.uploadedVideoFile = null
    this.pdfUrl = null
    this.videoUrl = null

    // If we're editing, check for existing submission
    if (this.isEditing && this.teamProject) {
      this.projectService.getTaskSubmission(this.teamProject.teamProjectId, task.id).subscribe((submission) => {
        if (submission) {
          // Populate form with existing deliverables
          submission.deliverables.forEach((deliverable) => {
            switch (deliverable.type) {
              case "pdf":
                this.deliverableType = "pdf"
                this.hasPdfFile = true
                this.uploadedFiles = [{ name: deliverable.content, size: 0, type: "application/pdf" }]
                break
              case "github":
                this.deliverableType = "github"
                this.githubLink = deliverable.content
                this.hasGithubLink = true
                break
              case "video":
                this.deliverableType = "video"
                this.hasVideoFile = true
                if (deliverable.content.startsWith("http")) {
                  this.videoLink = deliverable.content
                } else {
                  this.uploadedFiles = [{ name: deliverable.content, size: 0, type: "video/mp4" }]
                }
                break
            }
          })
        } else if (task.deliverables) {
          // Fall back to legacy format if no structured submission exists
          this.populateFromLegacyFormat(task.deliverables)
        }
      })
    } else if (task.deliverables) {
      // For non-editing mode, still check if there's legacy data
      this.populateFromLegacyFormat(task.deliverables)
    }
  }

  // Helper method to populate form from legacy deliverables string
  private populateFromLegacyFormat(deliverables: string): void {
    const parts = deliverables.split(/[|,]/).map((d) => d.trim())

    parts.forEach((d) => {
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

  closeSubmissionModal(): void {
    this.showSubmissionModal = false
    this.selectedTask = undefined
    this.uploadedFiles = []
    this.isEditing = false
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]

      if (this.deliverableType === "pdf") {
        this.uploadedPdfFile = file
        this.hasPdfFile = true
        this.pdfUrl = URL.createObjectURL(file)
        this.uploadedFiles = [{ name: file.name, size: file.size, type: file.type }]
        console.log("PDF file uploaded:", file.name)
      } else if (this.deliverableType === "video") {
        this.uploadedVideoFile = file
        this.hasVideoFile = true
        this.videoUrl = URL.createObjectURL(file)
        this.uploadedFiles = [{ name: file.name, size: file.size, type: file.type }]
        console.log("Video file uploaded:", file.name)
      }
    }
  }

  removeDeliverable(type: "pdf" | "github" | "video"): void {
    if (type === "pdf") {
      this.hasPdfFile = false
      this.uploadedPdfFile = null
      this.uploadedFiles = this.uploadedFiles.filter((f) => !f.type.includes("pdf"))
      if (this.pdfUrl) {
        URL.revokeObjectURL(this.pdfUrl)
        this.pdfUrl = null
      }
    } else if (type === "github") {
      this.hasGithubLink = false
      this.githubLink = ""
    } else if (type === "video") {
      this.hasVideoFile = false
      this.videoLink = ""
      this.uploadedVideoFile = null
      this.uploadedFiles = this.uploadedFiles.filter((f) => !f.type.includes("video"))
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl)
        this.videoUrl = null
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

  isDeadlinePassed(dueDate: string): boolean {
    const today = new Date()
    const deadline = new Date(dueDate)
    return today > deadline
  }

  deleteSubmission(): void {
    if (!this.selectedTask || !this.teamProject) {
      return
    }

    // Store the task ID in a local variable
    const taskId = this.selectedTask.id

    this.projectService.deleteTaskSubmission(this.teamProject.teamProjectId, taskId).subscribe(() => {
      // Update the UI
      if (this.teamProject && this.teamProject.tasks) {
        const taskIndex = this.teamProject.tasks.findIndex((t) => t.id === taskId)
        if (taskIndex !== -1) {
          this.teamProject.tasks[taskIndex] = {
            ...this.teamProject.tasks[taskIndex],
            isCompleted: false,
            deliverables: "",
          }
        }
      }
      this.closeSubmissionModal()
    })
  }

  // Update the submitTask method to properly handle undefined values
  submitTask(): void {
    if (!this.selectedTask || !this.teamProject) {
      return
    }

    // Create an array to hold the deliverables
    const deliverables: Omit<Deliverable, "id" | "submittedAt">[] = []

    // Add PDF deliverable
    if (this.hasPdfFile && this.uploadedPdfFile) {
      deliverables.push({
        taskId: this.selectedTask.id,
        teamProjectId: this.teamProject.teamProjectId,
        type: "pdf" as DeliverableType,
        content: this.uploadedPdfFile.name,
        submittedBy: this.teamProject.members[0], // Using first team member as submitter
      })
    }

    // Add GitHub deliverable
    if (this.hasGithubLink && this.githubLink) {
      deliverables.push({
        taskId: this.selectedTask.id,
        teamProjectId: this.teamProject.teamProjectId,
        type: "github" as DeliverableType,
        content: this.githubLink,
        submittedBy: this.teamProject.members[0],
      })
    }

    // Add Video deliverable
    if (this.hasVideoFile) {
      if (this.videoLink) {
        deliverables.push({
          taskId: this.selectedTask.id,
          teamProjectId: this.teamProject.teamProjectId,
          type: "video" as DeliverableType,
          content: this.videoLink,
          submittedBy: this.teamProject.members[0],
        })
      } else if (this.uploadedVideoFile) {
        deliverables.push({
          taskId: this.selectedTask.id,
          teamProjectId: this.teamProject.teamProjectId,
          type: "video" as DeliverableType,
          content: this.uploadedVideoFile.name,
          submittedBy: this.teamProject.members[0],
        })
      }
    }

    // Store the task ID in a local variable to avoid accessing selectedTask after it might be cleared
    const taskId = this.selectedTask.id
    const taskName = this.selectedTask.name

    // Submit the task with deliverables
    this.projectService
      .submitTask(this.teamProject.teamProjectId, taskId, deliverables, this.teamProject.members[0])
      .subscribe((submission) => {
        // Update the task in the UI
        if (this.teamProject && this.teamProject.tasks) {
          const taskIndex = this.teamProject.tasks.findIndex((t) => t.id === taskId)
          if (taskIndex !== -1) {
            // Create a legacy deliverables string for backward compatibility
            const deliverableStrings = submission.deliverables
              .map((d) => {
                switch (d.type) {
                  case "pdf":
                    return `PDF: ${d.content}`
                  case "github":
                    return `GitHub: ${d.content}`
                  case "video":
                    return `Video: ${d.content}`
                  default:
                    return ""
                }
              })
              .filter((s) => s)

            this.teamProject.tasks[taskIndex] = {
              ...this.teamProject.tasks[taskIndex],
              isCompleted: true,
              deliverables: deliverableStrings.join(" | "),
            }
          }
        }

        // Send notification to supervisors
        if (this.teamProject && this.teamProject.supervisors && this.teamProject.supervisors.length > 0) {
          this.notificationService.sendTaskSubmissionNotification(this.teamProject, taskName)
        }

        this.closeSubmissionModal()
      })
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

  // Methods for deliverables modal
  // Update the openDeliverablesModal method to properly handle undefined values
  openDeliverablesModal(): void {
    if (this.teamProject) {
      this.showDeliverablesModal = true
    }
  }

  closeDeliverablesModal(): void {
    this.showDeliverablesModal = false
  }

  // Method to check if the team has any completed tasks with deliverables
  // Update the hasDeliverables method to properly handle undefined values
  hasDeliverables(): boolean {
    if (!this.teamProject || !this.teamProject.tasks) return false

    return this.teamProject.tasks.some(
      (task) =>
        task.isCompleted &&
        task.deliverables &&
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
