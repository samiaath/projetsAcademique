import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TeamProject } from '../models/project2.model';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  private projects: TeamProject[] = [
    {
      teamProjectId: 1,
      teamProjectName: 'Gestion Projets Team',
      id: 1,
      title: 'plateforme de gestion des projets',
      members: ['Mohammed Ali','Samia Thameur', 'Eya Boudidah' ],
      domain: 'Développement - Web',
      date: '12/05/2025',
      year: '2025',
      category: 'Web',
      assignedTo: ['Info 2B 2024-2025',],
      description: 'Plateforme de gestion des projets académiques',
      dueDate: '12/05/2025',
      maxStudents: 2
    },
    {
      teamProjectId: 2,
      teamProjectName: 'Gestion Projets Team',
      id: 2,
      title: 'plateforme de gestion des projets',
      members: ['Mohammed Ali','Samia Thameur', 'Eya Boudidah' ],
      domain: 'Développement - Web',
      date: '12/05/2024',
      year: '2024',
      category: 'Web',
      assignedTo: ['Indus 2B 2024-2025',],
      description: 'Plateforme de gestion des projets académiques',
      dueDate: '12/05/2024',
      maxStudents: 2
    },
    {
      teamProjectId: 3,
      teamProjectName: 'Gestion Projets Team',
      id: 3,
      title: 'plateforme de gestion des projets',
      members: ['Mohammed Ali','Samia Thameur' ],
      domain: 'Développement - Web',
      date: '12/05/2023',
      year: '2023',
      category: 'Web',
      assignedTo: ['Meac 1C 2023-2024',],
      description: 'Plateforme de gestion des projets académiques',
      dueDate: '12/05/2023',
      maxStudents: 2
    }
  ];

  constructor() { }

  getProjects(): Observable<TeamProject[]> {
    return of(this.projects);
  }

  filterProjectsByYear(year: string): Observable<TeamProject[]> {
    if (!year.trim()) {
      return of(this.projects);
    }
    return of(this.projects.filter(project => 
      project.year?.toLowerCase().includes(year.trim().toLowerCase())));
  }
}