import { Component, Input, type OnInit, type OnDestroy, ViewChild, ElementRef, AfterViewChecked } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { NotificationService } from "../../services/notification.service"
import type { Notification, TeamProject, supervisor } from "../project.model"
import  { ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"

@Component({
  selector: "app-chat-section",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-0 h-full flex flex-col overflow-hidden">
      <!-- Chat Header -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-800">Chat with Supervisors</h2>
        
        <!-- Supervisor Selection -->
        <div class="mt-3">
          <div class="flex flex-wrap gap-2">
            <button 
              *ngFor="let supervisor of teamProject?.supervisors" 
              class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              [class.bg-blue-100]="selectedSupervisor?.id !== supervisor.id"
              [class.text-blue-800]="selectedSupervisor?.id !== supervisor.id"
              [class.bg-blue-600]="selectedSupervisor?.id === supervisor.id"
              [class.text-white]="selectedSupervisor?.id === supervisor.id"
              (click)="selectSupervisor(supervisor)"
            >
              {{ supervisor.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Chat Messages -->
      <div #chatContainer class="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div *ngIf="!selectedSupervisor" class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Select a supervisor to start chatting</p>
          </div>
        </div>

        <div *ngIf="selectedSupervisor && messages.length === 0" class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </div>
        </div>

        <div *ngIf="selectedSupervisor && messages.length > 0" class="space-y-4">
          <!-- Date separator -->
          <div *ngFor="let dateGroup of groupedMessages | keyvalue">
            <div class="flex justify-center my-4">
              <span class="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                {{ dateGroup.key }}
              </span>
            </div>
            
            <!-- Messages for this date -->
            <div *ngFor="let message of dateGroup.value" class="mb-3">
              <div class="flex"
                   [class.justify-end]="message.sender !== selectedSupervisor.name"
                   [class.justify-start]="message.sender === selectedSupervisor.name">
                
                <!-- Supervisor Avatar (only for supervisor messages) -->
                <div *ngIf="message.sender === selectedSupervisor.name" class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span class="text-xs font-medium text-blue-800">{{ selectedSupervisor.name.charAt(0) }}</span>
                </div>
                
                <!-- Message Bubble -->
                <div class="max-w-[75%] rounded-lg px-4 py-2 shadow-sm"
                     [class.bg-blue-600]="message.sender !== selectedSupervisor.name"
                     [class.text-white]="message.sender !== selectedSupervisor.name"
                     [class.rounded-tr-lg]="message.sender !== selectedSupervisor.name"
                     [class.rounded-br-none]="message.sender !== selectedSupervisor.name"
                     [class.bg-white]="message.sender === selectedSupervisor.name"
                     [class.text-gray-800]="message.sender === selectedSupervisor.name"
                     [class.rounded-tl-lg]="message.sender === selectedSupervisor.name"
                     [class.rounded-bl-none]="message.sender === selectedSupervisor.name">
                  <p class="text-sm whitespace-pre-wrap break-words">{{ message.message }}</p>
                  <p class="text-xs mt-1 opacity-70 text-right">
                    {{ message.time }}
                    
                    <!-- Read indicator for sent messages -->
                    <span *ngIf="message.sender !== selectedSupervisor.name" class="ml-1">
                      <svg *ngIf="message.isRead" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <svg *ngIf="!message.isRead" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </p>
                </div>
                
                <!-- Team Avatar (only for team messages) -->
                <div *ngIf="message.sender !== selectedSupervisor.name" class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
                  <span class="text-xs font-medium text-white">{{ teamProject?.teamProjectName?.charAt(0) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-3 border-t border-gray-200 bg-white">
        <div *ngIf="selectedSupervisor" class="flex gap-2">
          <input 
            type="text" 
            [(ngModel)]="newMessage" 
            placeholder="Type your message..." 
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            (keyup.enter)="sendMessage()"
          />
          <button 
            (click)="sendMessage()" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            [disabled]="!newMessage.trim()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div *ngIf="!selectedSupervisor" class="text-center text-gray-500 py-2">
          Select a supervisor to start chatting
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      height: 100%;
    }
    `
  ],
})
export class ChatSectionComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() teamProject?: TeamProject
  @ViewChild('chatContainer') private chatContainer!: ElementRef

  selectedSupervisor?: supervisor
  messages: Notification[] = []
  groupedMessages: { [date: string]: Notification[] } = {}
  newMessage = ""
  private subscription?: Subscription
  private messagesSubscription?: Subscription
  private supervisorIdFromRoute?: number
  private shouldScrollToBottom = false

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Subscribe to route query params for supervisor selection
    this.subscription = this.route.queryParams.subscribe((params) => {
      if (params["supervisorId"]) {
        this.supervisorIdFromRoute = Number(params["supervisorId"])

        // If team project is already loaded, select the supervisor
        if (this.teamProject && this.supervisorIdFromRoute) {
          const supervisor = this.teamProject.supervisors.find((s) => s.id === this.supervisorIdFromRoute)
          if (supervisor) {
            this.selectSupervisor(supervisor)
          }
        }
      }
    })

    // If there's only one supervisor and no route param, select them automatically
    if (this.teamProject?.supervisors?.length === 1 && !this.supervisorIdFromRoute) {
      this.selectSupervisor(this.teamProject.supervisors[0])
    }

    // Subscribe to notifications to update messages in real-time
    this.messagesSubscription = this.notificationService.getNotificationsObservable().subscribe(() => {
      if (this.selectedSupervisor && this.teamProject) {
        this.loadMessages()
      }
    })
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom()
      this.shouldScrollToBottom = false
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe()
    }
  }

  selectSupervisor(supervisor: supervisor): void {
    this.selectedSupervisor = supervisor
    this.loadMessages()
  }

  loadMessages(): void {
    if (!this.selectedSupervisor || !this.teamProject) return

    this.messages = this.notificationService.getMessagesForSupervisor(
      this.teamProject.teamProjectId,
      this.selectedSupervisor.id,
    )

    // Sort messages by date and time
    this.messages.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime()
      const dateB = new Date(`${b.date} ${b.time}`).getTime()
      return dateA - dateB
    })

    // Group messages by date
    this.groupMessagesByDate()
    
    // Mark messages as read
    this.messages.forEach(message => {
      if (message.id && !message.isRead && message.sender === this.selectedSupervisor?.name) {
        this.notificationService.markAsRead(message.id)
      }
    })

    this.shouldScrollToBottom = true
  }

  groupMessagesByDate(): void {
    this.groupedMessages = {}
    
    this.messages.forEach(message => {
      // Format the date for grouping
      const messageDate = message.date
      
      if (!this.groupedMessages[messageDate]) {
        this.groupedMessages[messageDate] = []
      }
      
      this.groupedMessages[messageDate].push(message)
    })
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedSupervisor || !this.teamProject) {
      return
    }

    // Send the message
    this.notificationService.sendMessageToSupervisor(this.teamProject, this.selectedSupervisor.id, this.newMessage)

    // Clear the input
    this.newMessage = ""

    // Reload messages
    this.loadMessages()
    
    // Set flag to scroll to bottom
    this.shouldScrollToBottom = true
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight
    } catch (err) {
      console.error('Error scrolling to bottom:', err)
    }
  }
}
