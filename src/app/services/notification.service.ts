import { Injectable } from "@angular/core"
import type { Notification, supervisor, TeamProject } from "../pages/project.model"
import { BehaviorSubject, type Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  [x: string]: any
  private notifications: Notification[] = [
    {
      id: 1,
      sender: "System",
      destination: "Monsieur Fouazi Jaidi",
      message: "Une tâche est disponible.",
      time: "19:25",
      date: "12 avr.",
      type: "task",
      isRead: false,
      action: "/layout/project/1",
      supervisorId: 1,
      teamProjectId: 1,
    },
    {
      id: 2,
      sender: "System",
      destination: "Madame Olfa Lamouchi",
      message: "Une tâche est disponible.",
      time: "12:30",
      date: "10 avr.",
      type: "task",
      isRead: true,
      action: "/layout/project/2",
      supervisorId: 2,
      teamProjectId: 2,
    },
    {
      id: 3,
      sender: "System",
      destination: "Monsieur Mourad Mittiti",
      message: "Une tâche est disponible.",
      time: "10:45",
      date: "8 avr.",
      type: "task",
      isRead: false,
      action: "/layout/project/3",
      supervisorId: 3,
      teamProjectId: 3,
    },
    {
      id: 4,
      sender: "Monsieur Fouazi Jaidi",
      destination: "Team Alpha",
      message: "Please provide more details about your submission.",
      time: "14:20",
      date: "11 avr.",
      type: "message",
      isRead: false,
      action: "/layout/teamProject/1?supervisorId=1",
      supervisorId: 1,
      teamProjectId: 1,
    },
    {
      id: 5,
      sender: "Madame Olfa Lamouchi",
      destination: "Team Beta",
      message: "Your submission has been reviewed. Good work!",
      time: "09:15",
      date: "12 avr.",
      type: "message",
      isRead: false,
      action: "/layout/teamProject/2?supervisorId=2",
      supervisorId: 2,
      teamProjectId: 2,
    },
  ]

  private notificationsSubject = new BehaviorSubject<Notification[]>(this.notifications)

  getNotifications(): Notification[] {
    return this.notifications
  }

  getNotificationsObservable(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable()
  }

  getFilteredNotifications(type?: "task" | "message", isRead?: boolean): Notification[] {
    return this.notifications.filter((notification) => {
      const typeMatch = type ? notification.type === type : true
      const readMatch = isRead !== undefined ? notification.isRead === isRead : true
      return typeMatch && readMatch
    })
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.isRead = true
      this.notificationsSubject.next([...this.notifications])
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      notification.isRead = true
    })
    this.notificationsSubject.next([...this.notifications])
  }

  deleteNotification(notificationId: number): void {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId)
    this.notificationsSubject.next(this.notifications)
  }

  // Send notification to all supervisors of a team project when a task is submitted
  sendTaskSubmissionNotification(teamProject: TeamProject, taskName: string): void {
    if (!teamProject || !teamProject.supervisors || teamProject.supervisors.length === 0) {
      return
    }

    const currentDate = new Date()
    const time = currentDate.getHours() + ":" + currentDate.getMinutes().toString().padStart(2, "0")
    const date = currentDate.getDate() + " " + currentDate.toLocaleString("default", { month: "short" }) + "."

    // Create a notification for each supervisor
    teamProject.supervisors.forEach((supervisor: supervisor) => {
      const notification: Notification = {
        id: this.getNextNotificationId(),
        sender: teamProject.teamProjectName,
        destination: supervisor.name,
        message: `Task "${taskName}" has been submitted.`,
        time: time,
        date: date,
        type: "task",
        isRead: false,
        action: `/layout/teamProject/${teamProject.teamProjectId}`, // URL to the team project page
        supervisorId: supervisor.id,
        teamProjectId: teamProject.teamProjectId,
      }

      this.notifications.unshift(notification) // Add to beginning of array
    })

    // Update subscribers
    this.notificationsSubject.next([...this.notifications])
  }

  // Send a chat message to a supervisor
  sendMessageToSupervisor(teamProject: TeamProject, supervisorId: number, message: string): void {
    if (!teamProject || !message.trim()) {
      return
    }

    const supervisor = teamProject.supervisors.find((s) => s.id === supervisorId)
    if (!supervisor) {
      return
    }

    const currentDate = new Date()
    const time = currentDate.getHours() + ":" + currentDate.getMinutes().toString().padStart(2, "0")
    const date = this.formatDate(currentDate)

    // Create a notification for the supervisor
    const notification: Notification = {
      id: this.getNextNotificationId(),
      sender: teamProject.teamProjectName,
      destination: supervisor.name,
      message: message,
      time: time,
      date: date,
      type: "message",
      isRead: false,
      action: `/layout/teamProject/${teamProject.teamProjectId}?supervisorId=${supervisor.id}`, // URL to the team project page with supervisor ID
      supervisorId: supervisor.id,
      teamProjectId: teamProject.teamProjectId,
    }

    this.notifications.push(notification) // Add to end of array for chronological order
    this.notificationsSubject.next([...this.notifications])

    // Simulate a response from the supervisor
    this.simulateResponseFromSupervisor(teamProject, supervisor)
  }

  // Simulate receiving a message from a supervisor
  simulateResponseFromSupervisor(teamProject: TeamProject, supervisor: supervisor): void {
    setTimeout(
      () => {
        const responses = [
          "I've received your message. I'll review it shortly.",
          "Thank you for the update. Let me know if you need any assistance.",
          "Good progress! Keep up the good work.",
          "Please provide more details about your question.",
          "I'll be available for a meeting tomorrow if you need to discuss this further.",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const currentDate = new Date()
        const time = currentDate.getHours() + ":" + currentDate.getMinutes().toString().padStart(2, "0")
        const date = this.formatDate(currentDate)

        // Create notification
        const notification: Notification = {
          id: this.getNextNotificationId(),
          sender: supervisor.name,
          destination: teamProject.teamProjectName,
          message: randomResponse,
          time: time,
          date: date,
          type: "message",
          isRead: false,
          action: `/layout/teamProject/${teamProject.teamProjectId}?supervisorId=${supervisor.id}`, // URL to the team project page with supervisor ID
          supervisorId: supervisor.id,
          teamProjectId: teamProject.teamProjectId,
        }

        this.notifications.push(notification) // Add to end of array for chronological order
        this.notificationsSubject.next([...this.notifications])
      },
      2000 + Math.random() * 3000,
    ) // Random delay between 2-5 seconds
  }

  // Get messages for a specific supervisor and team project
  getMessagesForSupervisor(teamProjectId: number, supervisorId: number): Notification[] {
    return this.notifications.filter(
      (n) =>
        n.type === "message" &&
        n.teamProjectId === teamProjectId &&
        n.supervisorId === supervisorId &&
        (n.sender === this.getSupervisorById(supervisorId)?.name ||
          n.destination === this.getSupervisorById(supervisorId)?.name),
    )
  }

  private getNextNotificationId(): number {
    return Math.max(0, ...this.notifications.map((n) => n.id || 0)) + 1
  }

  private getSupervisorById(id: number): supervisor | undefined {
    // This is a mock implementation - in a real app, you would fetch this from your data service
    const supervisors: supervisor[] = [
      { id: 1, name: "Monsieur Fouazi Jaidi" },
      { id: 2, name: "Madame Olfa Lamouchi" },
      { id: 3, name: "Monsieur Mourad Mittiti" },
      { id: 4, name: "Dr. Ahmed Bennour" },
      { id: 5, name: "Dr. Sami Trabelsi" },
    ]

    return supervisors.find((s) => s.id === id)
  }

  // Format date in a consistent way for chat grouping
  private formatDate(date: Date): string {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.getDate() + " " + date.toLocaleString("default", { month: "short" }) + "."
    }
  }
}
