import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../models/project.model';
import { NotificationService } from '../services/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications2.component.html',
  styleUrls: ['./notifications2.component.scss']
})
export class Notifications2Component implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  groupedNotifications: {
    today: Notification[];
    yesterday: Notification[];
    older: Notification[];
  } = {
    today: [],
    yesterday: [],
    older: []
  };
  activeFilter: 'all' | 'unread' = 'all';
  showConfirmationModal = false;
  notificationIdToDelete: number | null = null;
  isDeleteAll = false;

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notifications = this.notificationService.getNotifications();
    this.filterNotifications(this.activeFilter);
  }

  filterNotifications(filter: 'all' | 'unread') {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredNotifications = this.notifications;
    } else {
      this.filteredNotifications = this.notifications.filter(notif => !notif.isRead);
    }

    this.groupNotifications();
  }

  groupNotifications() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    this.groupedNotifications = {
      today: [],
      yesterday: [],
      older: []
    };

    this.filteredNotifications.forEach(notif => {
      const notifDate = new Date(notif.date);
      if (this.isToday(notifDate)) {
        this.groupedNotifications.today.push(notif);
      } else if (this.isYesterday(notifDate)) {
        this.groupedNotifications.yesterday.push(notif);
      } else {
        this.groupedNotifications.older.push(notif);
      }
    });
  }

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id!);
     // Navigation basée sur le type de notification
    if (notification.type === 'task' && notification.teamProjectId) {
      this.router.navigate(['/project-details/', notification.groupId, '/', notification.teamProjectId]);
    } else if (notification.type === 'message' && notification.groupId) {
      this.router.navigate(['/chat', notification.groupId]);
    }
    this.loadNotifications();
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
    this.loadNotifications();
  }

  openConfirmationModal(id: number, event: Event) {
    event.stopPropagation();
    this.notificationIdToDelete = id;
    this.isDeleteAll = false;
    this.showConfirmationModal = true;
  }

  openConfirmationModalForAll() {
    this.notificationIdToDelete = null;
    this.isDeleteAll = true;
    this.showConfirmationModal = true;
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
    this.notificationIdToDelete = null;
    this.isDeleteAll = false;
  }

  confirmDelete() {
    if (this.isDeleteAll) {
      this.notificationService.clearAllNotifications();
    } else if (this.notificationIdToDelete) {
      this.notificationService.deleteNotification(this.notificationIdToDelete);
    }
    this.loadNotifications();
    this.closeConfirmationModal();
  }

  clearAllNotifications() {
    this.notificationService.clearAllNotifications();
    this.loadNotifications();
  }

  getUnreadCount(): number {
    return this.notifications.filter(notif => !notif.isRead).length;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  }
}