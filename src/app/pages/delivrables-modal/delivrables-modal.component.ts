import { Component, Input, Output, EventEmitter, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser"
import type { TeamProject, Deliverable } from "../project.model"
import { ProjectService } from "../../services/project.service"

@Component({
  selector: "app-deliverables-modal",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" (click)="close()">
      <div 
        class="modal-container bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden border border-blue-100" 
        (click)="$event.stopPropagation()"
      >
        <!-- Header with close button -->
        <div class="bg-[#1B56FD] p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 class="text-xl font-bold text-white">Project Demonstrations</h2>
          <button 
            (click)="close()" 
            class="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-all duration-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
            
        <div class="overflow-y-auto flex-1 p-6">
          <!-- Project Info Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Project Name -->
            <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 class="text-sm font-medium text-blue-700 mb-2">Project Name</h3>
              <div class="text-lg font-semibold text-gray-800">
                {{ teamProject.teamProjectName }}
              </div>
            </div>
            
            <!-- Number of Students -->
            <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 class="text-sm font-medium text-green-700 mb-2">Number of Students</h3>
              <div class="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ teamProject.members.length }}
              </div>
            </div>
          </div>
          
          <!-- Team Members Section -->
          <div class="mb-6 bg-white p-4 rounded-lg shadow-md">
            <h3 class="text-md font-semibold text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Team Members
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div *ngFor="let member of teamProject.members" class="flex items-center p-2 rounded-md hover:bg-gray-50">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium mr-3">
                  {{ member.charAt(0).toUpperCase() }}
                </div>
                <span class="text-gray-700">{{ member }}</span>
              </div>
            </div>
          </div>
          
          <!-- Deliverables Section -->
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h3 class="text-md font-semibold text-gray-700 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Deliverables
            </h3>
            
            <!-- Tabs -->
            <div class="flex border-b mb-4">
              <button 
                [ngClass]="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'all', 'text-gray-500 hover:text-gray-700': activeTab !== 'all'}"
                class="px-4 py-2 text-sm"
                (click)="setActiveTab('all')"
              >
                All
              </button>
              <button 
                [ngClass]="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'github', 'text-gray-500 hover:text-gray-700': activeTab !== 'github'}"
                class="px-4 py-2 text-sm"
                (click)="setActiveTab('github')"
                *ngIf="hasGithubLink()"
              >
                GitHub
              </button>
              <button 
                [ngClass]="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'video', 'text-gray-500 hover:text-gray-700': activeTab !== 'video'}"
                class="px-4 py-2 text-sm"
                (click)="setActiveTab('video')"
                *ngIf="hasVideoAttachment()"
              >
                Video
              </button>
              <button 
                [ngClass]="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'pdf', 'text-gray-500 hover:text-gray-700': activeTab !== 'pdf'}"
                class="px-4 py-2 text-sm"
                (click)="setActiveTab('pdf')"
                *ngIf="hasPdfAttachment()"
              >
                PDF
              </button>
            </div>
            
            <!-- GitHub Link -->
            <div *ngIf="(activeTab === 'all' || activeTab === 'github') && hasGithubLink()" class="mb-6">
              <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-medium text-purple-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub Repository
                  </h4>
                  <a 
                    [href]="githubLink" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-purple-700 hover:text-purple-900 text-sm flex items-center bg-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Repository
                  </a>
                </div>
                <div class="bg-white p-3 rounded border border-purple-100 text-sm text-gray-700">
                  {{ githubLink }}
                </div>
              </div>
            </div>
            
            <!-- Video -->
            <div *ngIf="(activeTab === 'all' || activeTab === 'video') && hasVideoAttachment()" class="mb-6">
              <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-medium text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video Demonstration
                  </h4>
                  <a 
                    [href]="videoAttachment" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-700 hover:text-blue-900 text-sm flex items-center bg-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Video
                  </a>
                </div>
                
                <!-- Video Preview Card -->
                <div class="bg-white p-4 rounded-lg border border-blue-100 text-center">
                  <div *ngIf="videoAttachment && isYouTubeVideo(videoAttachment) && safeYouTubeUrl" class="rounded-md overflow-hidden mb-3">
                    <div class="relative" style="padding-bottom: 56.25%;">
                      <iframe 
                        [src]="safeYouTubeUrl" 
                        class="absolute top-0 left-0 w-full h-full"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                      </iframe>
                    </div>
                  </div>
                  
                  <!-- Fallback for non-YouTube videos -->
                  <div *ngIf="!videoAttachment || !isYouTubeVideo(videoAttachment) || !safeYouTubeUrl" class="py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p class="text-gray-600 mb-3">Video preview is not available for this URL.</p>
                    <a 
                      [href]="videoAttachment" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Watch Video
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- PDF -->
            <div *ngIf="(activeTab === 'all' || activeTab === 'pdf') && hasPdfAttachment()" class="mb-6">
              <div class="bg-red-50 p-4 rounded-lg border border-red-100">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-medium text-red-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF Report
                  </h4>
                  <a 
                    [href]="pdfAttachment" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-red-700 hover:text-red-900 text-sm flex items-center bg-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open PDF
                  </a>
                </div>
                
                <!-- PDF Preview Card -->
                <div class="bg-white p-6 rounded-lg border border-red-100">
                  <!-- PDF Embed for preview -->
                  <div *ngIf="pdfAttachment" class="mb-4 rounded-md overflow-hidden" style="height: 400px;">
                    <object
                      [data]="pdfAttachment"
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      class="w-full h-full"
                    >
                      <p>It appears your browser doesn't support embedded PDFs. 
                        <a [href]="pdfAttachment" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                          Click here to view the PDF directly.
                        </a>
                      </p>
                    </object>
                  </div>
                  
                  <div class="text-center">
                    <a 
                      [href]="pdfAttachment" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Full PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No Deliverables Message -->
            <div *ngIf="!hasGithubLink() && !hasVideoAttachment() && !hasPdfAttachment()" class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500">No deliverables found for this team project.</p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-4 border-t border-gray-200 flex justify-end sticky bottom-0">
          <button 
            (click)="close()" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
    }
    
    /* Add some animation */
    :host > div {
      animation: fadeIn 0.3s ease-out;
    }
    .modal-container {
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    .modal-content {
      overflow-y: auto;
      flex: 1;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Make the modal content slide up */
    :host > div > div {
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    `,
  ],
})
export class DeliverablesModalComponent implements OnInit {
  @Input() teamProject!: TeamProject
  @Output() closeModal = new EventEmitter<void>()

  // URLs for different deliverable types
  githubLink: string | null = null
  videoAttachment: string | null = null
  pdfAttachment: string | null = null

  // Safe URL for YouTube embed
  safeYouTubeUrl: SafeResourceUrl | null = null

  // Active tab
  activeTab: "all" | "github" | "video" | "pdf" = "all"

  // Store all deliverables
  deliverables: Deliverable[] = []

  constructor(
    private sanitizer: DomSanitizer,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    if (!this.teamProject) {
      console.error('TeamProject is required for DeliverablesModalComponent');
      return;
    }

    // Get all task submissions for this team project
    this.projectService.getTaskSubmissionsForTeamProject(this.teamProject.teamProjectId).subscribe((submissions) => {
      // Extract all deliverables
      submissions.forEach((submission) => {
        submission.deliverables.forEach((deliverable) => {
          switch (deliverable.type) {
            case "github":
              this.githubLink = deliverable.content;
              break;
            case "video":
              this.videoAttachment = deliverable.content;
              if (this.isYouTubeVideo(deliverable.content)) {
                this.safeYouTubeUrl = this.getYouTubeEmbedUrl(deliverable.content);
              }
              break;
            case "pdf":
              this.pdfAttachment = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
              break;
          }
        });
      });

      // If no structured deliverables found, fall back to legacy format
      if (!this.hasAnyDeliverables() && this.teamProject?.tasks) {
        this.loadLegacyDeliverables();
      }
    });
  }

  /**
   * Load deliverables from legacy format (string-based)
   */
  private loadLegacyDeliverables(): void {
    if (!this.teamProject || !this.teamProject.tasks) {
      return;
    }

    const completedTasks = this.teamProject.tasks.filter((task) => task.isCompleted);

    completedTasks.forEach((task) => {
      if (!task.deliverables) return;

      // Split by pipe or comma
      const deliverables = task.deliverables.split(/[|,]/).map((d) => d.trim());

      deliverables.forEach((d) => {
        if (d.toLowerCase().includes("github") && d.includes("http")) {
          // Improved GitHub URL extraction
          const parts = d.split(":");
          if (parts.length > 1) {
            this.githubLink = parts.slice(1).join(":").trim(); // Join remaining parts in case URL contains colons
          } else {
            this.githubLink = d.trim();
          }

          // Ensure the URL starts with https://
          if (this.githubLink && !this.githubLink.startsWith("http")) {
            this.githubLink = "https://" + this.githubLink;
          }
        } else if (d.toLowerCase().includes("video")) {
          if (d.includes("http")) {
            this.videoAttachment = d.split(":")[1]?.trim() || null;
            if (this.isYouTubeVideo(this.videoAttachment)) {
              this.safeYouTubeUrl = this.getYouTubeEmbedUrl(this.videoAttachment);
            }
          } else {
            // For uploaded video files, we'll use a dummy URL
            this.videoAttachment = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            this.safeYouTubeUrl = this.getYouTubeEmbedUrl(this.videoAttachment);
          }
        } else if (d.toLowerCase().includes("pdf")) {
          this.pdfAttachment = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        }
      });
    });
  }

  getYouTubeEmbedUrl(url: string | null): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl("")

    try {
      let videoId = ""
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)

      videoId = match && match[2].length === 11 ? match[2] : ""

      if (!videoId && url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0]
      }

      if (!videoId) {
        console.error("Could not extract YouTube video ID from URL:", url)
        return this.sanitizer.bypassSecurityTrustResourceUrl("")
      }

      const embedUrl = `https://www.youtube.com/embed/${videoId}`
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
    } catch (error) {
      console.error("Error parsing YouTube URL:", error)
      return this.sanitizer.bypassSecurityTrustResourceUrl("")
    }
  }

  close(): void {
    this.closeModal.emit()
  }

  hasGithubLink(): boolean {
    return this.githubLink !== null
  }

  hasVideoAttachment(): boolean {
    return this.videoAttachment !== null
  }

  hasPdfAttachment(): boolean {
    return this.pdfAttachment !== null
  }

  hasAnyDeliverables(): boolean {
    return this.hasGithubLink() || this.hasVideoAttachment() || this.hasPdfAttachment()
  }

  setActiveTab(tab: "all" | "github" | "video" | "pdf"): void {
    this.activeTab = tab
  }

  isYouTubeVideo(url: string | null): boolean {
    if (!url) return false
    return url.includes("youtube.com") || url.includes("youtu.be")
  }
}
