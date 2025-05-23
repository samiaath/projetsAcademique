import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Project, Task, TeamProject, supervisor } from '../pages/project.model';
import { map } from 'rxjs/operators';
import { Vote } from '../pages/project.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private teamProjects: TeamProject[] = [];
  private teamProjectsSubject: BehaviorSubject<TeamProject[]> = new BehaviorSubject<TeamProject[]>(this.teamProjects);
  private votes: Vote[] = [];
  private votesSubject = new BehaviorSubject<Vote[]>(this.votes);
  
  constructor(private notificationService: NotificationService) {}

  private calculateStatus(dueDate: string): string {
    const today = new Date();
    const due = new Date(dueDate);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 7) return `${diffDays} days left`;
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} left`;
  }

  getProjects(): Observable<Project[]> {
    const rawProjects = [
      {
        id: 1,
        title: 'A web application using HTML, CSS, and JavaScript',
        description: 'Web Development',
        category: 'Web Development',
        categoryColor: 'blue',
        dueDate: '2025-05-12',
        supervisors: [
          { id: 1, name: "Monsieur Fouazi Jaidi" },
          { id: 2, name: "Madame Olfa Lamouchi" }
        ],
        tasks: [
          {
            id: 1,
            name: 'Setup HTML Structure',
            deliverables: 'PDF Report',
            description: 'Create the main HTML layout for the homepage',
            dueDate: '2025-05-10'
          },
          {
            id: 2,
            name: 'Style with CSS',
            deliverables: 'style.css',
            description: 'Design the UI with responsive layout',
            dueDate: '2025-05-11'
          }
        ]
      },
      {
        id: 2,
        title: 'A mobile application using Android Studio',
        description: 'Mobile Development',
        category: 'Mobile Development',
        categoryColor: 'green',
        dueDate: '2025-05-12',
        supervisors: [
          { id: 3, name: "Monsieur Mourad Mittiti" }
        ],
        tasks: [
          {
            id: 1,
            name: 'Design App UI in XML',
            deliverables: 'PDF Report',
            description: 'Create main layout',
            dueDate: '2025-05-05'
          },
          {
            id: 2,
            name: 'Connect to Firebase',
            deliverables: 'PDF Report',
            description: 'Setup Firebase authentication and database',
            dueDate: '2025-05-10'
          }
        ]
      },
      {
        id: 3,
        title: 'Machine Learning Model for Sentiment Analysis',
        description: 'Build and evaluate a sentiment classifier',
        category: 'AI/ML',
        categoryColor: 'purple',
        dueDate: '2025-06-20',
        supervisors: [
          { id: 1, name: "Monsieur Fouazi Jaidi" },
          { id: 4, name: "Dr. Ahmed Bennour" }
        ],
        tasks: [
          {
            id: 1,
            name: 'Data Preprocessing',
            deliverables: 'notebook.ipynb',
            description: 'Clean and preprocess the text data',
            dueDate: '2025-05-15'
          },
          {
            id: 2,
            name: 'Train Classifier',
            deliverables: 'trained_model.pkl',
            description: 'Train and validate sentiment classifier',
            dueDate: '2025-05-20'
          }
        ]
      },
      {
        id: 4,
        title: 'Database Management System for Library',
        description: 'Design and implement a DBMS',
        category: 'Database',
        categoryColor: 'orange',
        dueDate: '2025-07-01',
        supervisors: [
          { id: 2, name: "Madame Olfa Lamouchi" }
        ],
        tasks: [
          {
            id: 1,
            name: 'ER Diagram and Schema Design',
            deliverables: 'ERDiagram.pdf',
            description: 'Create a conceptual model for the library system',
            dueDate: '2025-05-05'
          },
          {
            id: 2,
            name: 'SQL Queries & Stored Procedures',
            deliverables: 'sql_queries.sql',
            description: 'Implement complex queries and procedures',
            dueDate: '2025-05-25'
          }
        ]
      },
      {
        id: 5,
        title: 'Cloud Deployment using Docker and AWS',
        description: 'Deploy a full-stack app to AWS',
        category: 'DevOps',
        categoryColor: 'gray',
        dueDate: '2025-06-15',
        supervisors: [
          { id: 3, name: "Monsieur Mourad Mittiti" },
          { id: 5, name: "Dr. Sami Trabelsi" }
        ],
        tasks: [
          {
            id: 1,
            name: 'Dockerize Application',
            deliverables: 'Dockerfile',
            description: 'Create Docker image for the web app',
            dueDate: '2025-05-01'
          },
          {
            id: 2,
            name: 'Deploy on EC2',
            deliverables: 'Deployment Guide',
            description: 'Use EC2 and S3 to deploy the app',
            dueDate: '2025-05-08'
          }
        ]
      }
    ];

    const projects: Project[] = rawProjects.map(project => {
      const tasks: Task[] = project.tasks.map(task => ({
        ...task,
        status: this.calculateStatus(task.dueDate)
      }));

      return {
        ...project,
        tasks,
        status: this.calculateStatus(project.dueDate),
        votingEnabled: true
      };
    });

    return of(projects);
  }

  getProjectById(id: string | number): Observable<Project | undefined> {
    return this.getProjects().pipe(
      map(projects => {
        const projectId = typeof id === 'string' ? parseInt(id, 10) : id;
        return projects.find(p => p.id === projectId);
      })
    );
  }

  getTasksByProjectId(id: string | number): Observable<Task[]> {
    return this.getProjectById(id).pipe(
      map(project => project?.tasks || [])
    );
  }

  createTeamProject(project: Project, teamProjectName: string, members: string[]): TeamProject {
    const teamProjectId = this.teamProjects.length + 1;
    
    const teamProject: TeamProject = {
      ...project,
      teamProjectId,
      teamProjectName,
      members,
      tasks: project.tasks?.map(task => ({
        ...task,
        status: 'Not Started'
      })) || [],
      voteCount: 0,
      averageRating: 0
    };

    this.teamProjects.push(teamProject);
    this.teamProjectsSubject.next(this.teamProjects);
    return teamProject;
  }

  getAllTeamProjects(): Observable<TeamProject[]> {
    return this.teamProjectsSubject.asObservable();
  }
  
  getTeamProjectsByProjectId(projectId: string | number): Observable<TeamProject[]> {
    const numericProjectId = typeof projectId === 'string' ? parseInt(projectId, 10) : projectId;
    return this.teamProjectsSubject.pipe(
      map(teamProjects => teamProjects.filter(tp => tp.id === numericProjectId))
    );
  }
  
  // Voting methods
  submitVote(vote: Omit<Vote, 'createdAt'>): Observable<Vote> {
    const newVote: Vote = {
      ...vote,
      createdAt: new Date()
    };
    
    this.votes = this.votes.filter(v => 
      !(v.userId === vote.userId && v.teamProjectId === vote.teamProjectId)
    );
    
    this.votes.push(newVote);
    this.votesSubject.next(this.votes);
    this.updateTeamStats(vote.teamProjectId);
    
    return of(newVote);
  }

  private updateTeamStats(teamProjectId: number): void {
    const team = this.teamProjects.find(t => t.teamProjectId === teamProjectId);
    if (!team) return;

    const teamVotes = this.votes.filter(v => v.teamProjectId === teamProjectId);
    team.voteCount = teamVotes.length;
    team.averageRating = teamVotes.reduce((sum, v) => sum + v.rating, 0) / teamVotes.length || 0;
    
    this.teamProjectsSubject.next(this.teamProjects);
  }

  getVotesForTeam(teamProjectId: number): Observable<Vote[]> {
    return this.votesSubject.pipe(
      map(votes => votes.filter(v => v.teamProjectId === teamProjectId))
    );
  }

  getUserVote(userId: string | number, teamProjectId: string | number): Observable<Vote | undefined> {
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const numericTeamProjectId = typeof teamProjectId === 'string' ? parseInt(teamProjectId, 10) : teamProjectId;
    
    return this.votesSubject.pipe(
      map(votes => votes.find(v => 
        v.userId === numericUserId && 
        v.teamProjectId === numericTeamProjectId
      ))
    );
  }

  toggleProjectVoting(projectId: number, enabled: boolean): Observable<void> {
    this.teamProjects = this.teamProjects.map(project => 
      project.id === projectId ? { ...project, votingEnabled: enabled } : project
    );
    this.teamProjectsSubject.next(this.teamProjects);
    return of();
  }
}
