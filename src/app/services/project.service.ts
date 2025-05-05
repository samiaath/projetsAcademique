import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { Deliverable, DeliverableType, Project, Task, TaskSubmission, TeamProject, supervisor } from '../pages/project.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Vote } from '../pages/project.model';
import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';

// Define the CreateTeamProjectRequest interface to match backend
interface CreateTeamProjectRequest {
  projectId: number;
  teamProjectName: string;
  members: string[];
  teamId?: number;
}

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
  
  private baseUrl = 'http://localhost:8088/api/v1';
  
  constructor(private notificationService: NotificationService, private http: HttpClient) {}

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
    return this.http.get<Project[]>(`${this.baseUrl}/projects`)
      .pipe(
        map((dtos: Project[]) =>
          dtos.map(dto => ({
            ...dto,
            tasks: dto.tasks?.map(task => ({
              ...task,
              status: this.calculateStatus(task.dueDate)
            })) || [],
            status: this.calculateStatus(dto.dueDate),
            votingEnabled: true
          }))
        )
      );
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

  createTeamProject(
    projectId: number, 
    teamProjectName: string, 
    members: string[], 
    teamId?: number
  ): Observable<TeamProject> {
    const request: CreateTeamProjectRequest = {
      projectId,
      teamProjectName,
      members,
      teamId
    };
  
    return this.http.post<TeamProject>(`${this.baseUrl}/team-projects`, request).pipe(
      tap((response: TeamProject) => {
        console.log('API Response Data:', response);
        
        // Add to local cache
        this.teamProjects.push(response);
        this.teamProjectsSubject.next(this.teamProjects);
      }),
      catchError(error => {
        console.error('API Error:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
        return throwError(() => error);
      })
    );
  }

  getAllTeamProjects(): Observable<TeamProject[]> {
    return this.http.get<TeamProject[]>(`${this.baseUrl}/team-projects`)
      .pipe(
        map(teamProjects => {
          // Update local cache with fetched data
          this.teamProjects = teamProjects;
          this.teamProjectsSubject.next(this.teamProjects);
          return teamProjects;
        }),
        catchError(error => {
          this.notificationService['showError']('Failed to fetch team projects: ' + error.message);
          throw error;
        })
      );
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


                                           
  // New methods for task submissions

  /**
   * Submit a task with deliverables
   */
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
