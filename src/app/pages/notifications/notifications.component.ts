import { Component, OnInit } from '@angular/core';
import { Notification } from '../project.model';
import { NotificationService } from '../../services/notification.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notifications = this.notificationService.getNotifications();
  }
  getRandomBorderColor(): string {
    const colors = ['#6366F1', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  getRandomPastelColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 95%)`;
  }
  
}
