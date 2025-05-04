import { Component, type OnInit } from "@angular/core"
import type { Notification } from "../project.model"
import  { NotificationService } from "../../services/notification.service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { Router } from "@angular/router"

@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./notifications.component.html",
  styleUrl: "./notifications.component.scss",
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = []
  filteredNotifications: Notification[] = []
  filterType: "all" | "task" | "message" = "all"
  filterRead: "all" | "read" | "unread" = "all"

  constructor(
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.notificationService.getNotificationsObservable().subscribe((notifications) => {
      this.notifications = notifications
      this.applyFilters()
    })
  }

  applyFilters() {
    this.filteredNotifications = this.notifications.filter((notification) => {
      // Filter by type
      if (this.filterType !== "all" && notification.type !== this.filterType) {
        return false
      }

      // Filter by read status
      if (this.filterRead === "read" && !notification.isRead) {
        return false
      }
      if (this.filterRead === "unread" && notification.isRead) {
        return false
      }

      return true
    })
  }

  markAsRead(notification: Notification) {
    if (notification.id) {
      this.notificationService.markAsRead(notification.id)
    }
  }

  deleteNotification(notification: Notification, event: Event) {
    event.stopPropagation()
    if (notification.id) {
      this.notificationService.deleteNotification(notification.id)
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead()
  }

  navigateToNotificationSource(notification: Notification) {
    // Mark as read first
    if (notification.id && !notification.isRead) {
      this.notificationService.markAsRead(notification.id)
    }

    // Navigate to the action URL if available
    if (notification.action) {
      this.router.navigateByUrl(notification.action)
    }
  }

  getRandomBorderColor(): string {
    const colors = ["#6366F1", "#EC4899", "#10B981", "#3B82F6", "#F59E0B", "#EF4444"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  getRandomPastelColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 95%)`
  }

  getNotificationIcon(type?: string): string {
    if (type === "task") {
      return `
        <svg class="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      `
    } else if (type === "message") {
      return `
        <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      `
    } else {
      return `
        <svg class="w-6 h-6 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      `
    }
  }
}
