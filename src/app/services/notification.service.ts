import { Injectable } from '@angular/core';
import { Notification } from '../pages/project.model'; // ajuste le chemin

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications: Notification[] = [
    {
      sender: 'Monsieur Fouazi Jaidi',
      message: 'Une tâche est disponible.',
      time: '19:25',
      date: '12 avr.'
    },
    {
      sender: 'Madame Olfa Lamouchi',
      message: 'Une tâche est disponible.',
      time: '12:30',
      date: '10 avr.'
    },
    {
      sender: 'Monsieur Mourad Mittiti',
      message: 'Une tâche est disponible.',
      time: '10:45',
      date: '8 avr.'
    }
  ];

  getNotifications(): Notification[] {
    return this.notifications;
  }
}
