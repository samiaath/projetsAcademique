import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Deliverable,DeliverableType, Project, Task, TaskSubmission, TeamProject, supervisor } from '../pages/project.model';
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


  // New properties to store task submissions and deliverables
  private taskSubmissions: TaskSubmission[] = [];
  private taskSubmissionsSubject = new BehaviorSubject<TaskSubmission[]>(this.taskSubmissions);
  private deliverables: Deliverable[] = [];
  private deliverablesSubject = new BehaviorSubject<Deliverable[]>(this.deliverables);
  
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


  
  submitTask(
    teamProjectId: number, 
    taskId: number, 
    deliverables: Omit<Deliverable, 'id' | 'submittedAt'>[],
    submittedBy: string
  ): Observable<TaskSubmission> {
    // Check if submission already exists
    const existingSubmissionIndex = this.taskSubmissions.findIndex(
      s => s.teamProjectId === teamProjectId && s.taskId === taskId
    );

    // Create new deliverables with IDs and timestamps
    const newDeliverables: Deliverable[] = deliverables.map((deliverable, index) => {
      const id = this.getNextDeliverableId();
      return {
        ...deliverable,
        id,
        submittedAt: new Date(),
        submittedBy
      };
    });

    // Add deliverables to the store
    this.deliverables = [...this.deliverables, ...newDeliverables];
    this.deliverablesSubject.next(this.deliverables);

    // Create or update the task submission
    const submission: TaskSubmission = {
      taskId,
      teamProjectId,
      isCompleted: true,
      submittedAt: new Date(),
      deliverables: newDeliverables
    };

    if (existingSubmissionIndex >= 0) {
      // Update existing submission
      this.taskSubmissions[existingSubmissionIndex] = submission;
    } else {
      // Add new submission
      this.taskSubmissions.push(submission);
    }
    
    this.taskSubmissionsSubject.next(this.taskSubmissions);

    // Update the task status in the team project
    this.updateTaskStatus(teamProjectId, taskId, true);

    return of(submission);
  }

  /**
   * Delete a task submission
   */
  deleteTaskSubmission(teamProjectId: number, taskId: number): Observable<void> {
    // Find the submission
    const submissionIndex = this.taskSubmissions.findIndex(
      s => s.teamProjectId === teamProjectId && s.taskId === taskId
    );

    if (submissionIndex >= 0) {
      // Get the submission to find its deliverables
      const submission = this.taskSubmissions[submissionIndex];
      
      // Remove the deliverables
      const deliverableIds = submission.deliverables.map(d => d.id).filter(id => id !== undefined) as number[];
      this.deliverables = this.deliverables.filter(d => !deliverableIds.includes(d.id as number));
      this.deliverablesSubject.next(this.deliverables);
      
      // Remove the submission
      this.taskSubmissions.splice(submissionIndex, 1);
      this.taskSubmissionsSubject.next(this.taskSubmissions);
      
      // Update the task status
      this.updateTaskStatus(teamProjectId, taskId, false);
    }
    
    return of(void 0);
  }

  /**
   * Get all submissions for a team project
   */
  getTaskSubmissionsForTeamProject(teamProjectId: number): Observable<TaskSubmission[]> {
    return this.taskSubmissionsSubject.pipe(
      map(submissions => submissions.filter(s => s.teamProjectId === teamProjectId))
    );
  }

  /**
   * Get a specific task submission
   */
  getTaskSubmission(teamProjectId: number, taskId: number): Observable<TaskSubmission | undefined> {
    return this.taskSubmissionsSubject.pipe(
      map(submissions => submissions.find(
        s => s.teamProjectId === teamProjectId && s.taskId === taskId
      ))
    );
  }

  /**
   * Get all deliverables for a task submission
   */
  getDeliverablesForTask(teamProjectId: number, taskId: number): Observable<Deliverable[]> {
    return this.deliverablesSubject.pipe(
      map(deliverables => deliverables.filter(
        d => d.teamProjectId === teamProjectId && d.taskId === taskId
      ))
    );
  }

  /**
   * Convert legacy deliverables string to structured deliverables
   */
  convertLegacyDeliverablesString(
    deliverableString: string, 
    taskId: number, 
    teamProjectId: number, 
    submittedBy: string
  ): Omit<Deliverable, 'id' | 'submittedAt'>[] {
    if (!deliverableString) return [];
    
    const deliverables: Omit<Deliverable, 'id' | 'submittedAt'>[] = [];
    const parts = deliverableString.split(/[|,]/).map(part => part.trim());
    
    parts.forEach(part => {
      if (part.toLowerCase().includes('github')) {
        const content = part.split(':').slice(1).join(':').trim();
        deliverables.push({
          taskId,
          teamProjectId,
          type: DeliverableType.GITHUB,
          content,
          submittedBy
        });
      } else if (part.toLowerCase().includes('video')) {
        const content = part.split(':').slice(1).join(':').trim();
        deliverables.push({
          taskId,
          teamProjectId,
          type: DeliverableType.VIDEO,
          content,
          submittedBy
        });
      } else if (part.toLowerCase().includes('pdf')) {
        const content = part.split(':').slice(1).join(':').trim();
        deliverables.push({
          taskId,
          teamProjectId,
          type: DeliverableType.PDF,
          content,
          submittedBy
        });
      }
    });
    
    return deliverables;
  }

  /**
   * Helper method to update a task's completion status in a team project
   */
  private updateTaskStatus(teamProjectId: number, taskId: number, isCompleted: boolean): void {
    const teamProjectIndex = this.teamProjects.findIndex(tp => tp.teamProjectId === teamProjectId);
    
    if (teamProjectIndex >= 0 && this.teamProjects[teamProjectIndex].tasks) {
      const taskIndex = this.teamProjects[teamProjectIndex].tasks!.findIndex(t => t.id === taskId);
      
      if (taskIndex >= 0) {
        // Create a deep copy of the team projects array
        const updatedTeamProjects = [...this.teamProjects];
        
        // Update the specific task
        updatedTeamProjects[teamProjectIndex].tasks![taskIndex] = {
          ...updatedTeamProjects[teamProjectIndex].tasks![taskIndex],
          isCompleted
        };
        
        // Update the state
        this.teamProjects = updatedTeamProjects;
        this.teamProjectsSubject.next(this.teamProjects);
      }
    }
  }

  /**
   * Generate a new unique ID for deliverables
   */
  private getNextDeliverableId(): number {
    return Math.max(0, ...this.deliverables.map(d => d.id || 0)) + 1;
  }
}






                                         
 