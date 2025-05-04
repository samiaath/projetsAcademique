import { Injectable } from '@angular/core';
import { Notification } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [
    {
      id: 1,
      type: 'task',
      title: 'Task Submitted',
      sender: 'Mohamed Ali Chibani',
      message: 'submitted Task 1: Project Analysis',
      time: '20:25',
      date: 'Apr 12',
      createdAt: new Date('2025-04-12T20:25:00'),
      isRead: false,
      groupId: 1, // Ajouté
      teamProjectId: 1
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      sender: 'Samia Thamer',
      message: 'commented on your submission: "Great work on the analysis part!"',
      time: '12:30',
      date: 'Apr 10',
      createdAt: new Date('2025-04-10T12:30:00'),
      isRead: true,
      groupId: 1, // Ajouté
      teamProjectId: 1
    },
    {
      id: 3,
      type: 'task',
      title: 'Task Submitted',
      sender: 'Eya Boudidah',
      message: 'submitted Task 1: Project Analysis ahead of schedule',
      time: '10:45',
      date: 'Apr 8',
      createdAt: new Date('2025-04-08T10:45:00'),
      isRead: false,
      groupId: 1, // Ajouté
      teamProjectId: 1
    },
    {
      id: 4,
      type: 'task',
      title: 'Task Notification',
      sender: 'System',
      message: 'Course schedule has been updated for next week',
      time: '09:15',
      date: 'Apr 7',
      createdAt: new Date('2025-04-07T09:15:00'),
      isRead: true,
      groupId: 1, // Ajouté
      teamProjectId: 1
    },
    {
      id: 5,
      type: 'message',
      title: 'Team Discussion',
      sender: 'Ahmed Benali',
      message: 'added you to a discussion: "Project Phase 2 Planning"',
      time: '16:20',
      date: 'Apr 6',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      isRead: false,
      groupId: 1, // Ajouté
      teamProjectId: 1
    }
  ];

  getNotifications(): Notification[] {
    return this.notifications;
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  clearAllNotifications(): void {
    this.notifications = [];
  }
}