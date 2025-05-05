import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Group, TeamProject } from '../models/project2.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups: Group[] = [
    {
      id: 1,
      title: 'Info 1A 2023-2024',
      projects: [
        {
          teamProjectId: 1,
          teamProjectName: 'Web Development Team',
          id: 1,
          title: 'Web development',
          description: 'Plateforme de Gestion Administrative',
          category: 'Development - Web',
          members: ['Eya Boudidah','Samia Thameur','Mohamed Ali Chibani'],
          assignedTo: "",
          date: '12/05/2025',
          dueDate: '12/05/2024',
          maxStudents: 3,
          year: '2023-2024',
          domain: 'Web Development'
        },
        {
          teamProjectId: 2,
          teamProjectName: 'Web Development Team',
          id: 2,
          title: 'Web development',
          description: 'Plateforme de Gestion Administrative',
          category: 'Development - Web',
          members: ['Samia Thameur','Mohamed Ali Chibani'],
          date: '11/01/2024',
          assignedTo: "",
          dueDate: '08/02/2024',
          maxStudents: 2,
          year: '2023-2024',
          domain: 'Web Development'
        }
      ]
    },
    {
      id: 2,
      title: 'Info 2B 2024-2025',
      projects: [
        { teamProjectId: 3,
          teamProjectName: 'Academic Project Team',
          id: 3,
          title: 'Plateforme de gestion des projets Académique',
          description: 'Mohamed Ali CHIBANI, Syrine THABET, Eya BOUDABBA',
          category: 'Development - Web',
          members: ['Eya Boudidah','Mohamed Ali Chibani'],
          date: '12/04/2025',
          dueDate: '12/05/2025',
          maxStudents: 2,
          assignedTo: "",
          year: '2024-2025',
          domain: 'Academic' },
          {
            teamProjectId: 4,
            teamProjectName: 'Management Team',
            id: 4,
            title: 'Project management',
            description: 'Project management',
            category: 'Project - management',
            members: ['Mohamed Ali Chibani'],
            date: '10/02/2025',
            dueDate: '12/03/2025',
            assignedTo: "",
            maxStudents: 1,
            year: '2024-2025',
            domain: 'Management'
          },
          {
            teamProjectId: 5,
            teamProjectName: 'UI Team',
            id: 5,
            title: 'Design Team',
            description: 'Design d"une application',
            category: 'Design - UI/UX',
            members: ['Samia Thameur', 'Eya Boudidah'],
            date: '12/05/2025',
            dueDate: '19/07/2025',
            assignedTo: "",
            maxStudents: 2,
            year: '2024-2025',
            domain: 'Design UI/UX'
        },
        {
          teamProjectId: 6,
          teamProjectName: 'UI Team',
          id: 6,
          title: 'Design Team',
          description: 'Design d"une application',
          category: 'Design - UI/UX',
          members: ['Samia Thameur'],
          date: '11/06/2025',
          dueDate: '20/06/2025',
          assignedTo: "",
          maxStudents: 1,
          year: '2024-2025',
          domain: 'Design UI/UX'
      }
        ]
    },
    {
      id: 3,
      title: 'Info 2C 2024-2025',
      projects: [
        {
          teamProjectId: 7,
          teamProjectName: 'Web App Team',
          id: 7,
          title: 'Web development',
          description: 'A web application using HTML, CSS and JS',
          category: 'Development - Web',
          members: ['Eya Boudidah'],
          date: '12/05/2025',
          assignedTo: "",
          dueDate: '13/06/2025',
          maxStudents: 1,
          year: '2024-2025',
          domain: 'Web Development'
        },
        {
          teamProjectId: 7,
          teamProjectName: 'Web App Team',
          id: 7,
          title: 'Web development',
          description: 'A web application using HTML, CSS and JS',
          category: 'Development - Web',
          members: ['Samia Thameur','Mohamed Ali Chibani','Eya Boudidah'],
          date: '11/03/2025',
          dueDate: '22/04/2025',
          assignedTo: "",
          maxStudents: 3,
          year: '2024-2025',
          domain: 'Web Development'
        },
        {
          teamProjectId: 8,
          teamProjectName: 'Web App Team',
          id: 8,
          title: 'Web development',
          description: 'A web application using HTML, CSS and JS',
          category: 'Development - Web',
          members: ['Samia Thameur','Mohamed Ali Chibani','Oumayma Chelly','Eya Boudidah'],
          date: '30/04/2025',
          dueDate: '20/05/2025',
          assignedTo: "",
          maxStudents: 4,
          year: '2024-2025',
          domain: 'Web Development'
        }
      ]
    }
  ];
  private groupsSubject = new BehaviorSubject<Group[]>(this.groups);

  constructor() { }

  getGroups(): Observable<Group[]> {
    return this.groupsSubject.asObservable();
  }

  getGroupById(id: number): Observable<Group | undefined> {
    const group = this.groups.find(g => g.id === id);
    return of(group);
  }

  searchGroups(term: string): Observable<Group[]> {
    if (!term.trim()) {
      return of(this.groups);
    }
    const filtered = this.groups.filter(group => 
      group.title.toLowerCase().includes(term.toLowerCase())
    );
    return of(filtered);
  }
  
  private generateId(): number {
    return Date.now();
  }
}
