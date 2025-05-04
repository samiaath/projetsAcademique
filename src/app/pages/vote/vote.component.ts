import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { TeamProject,Project } from '../project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
  projectId: string = '';
  project?: Project;
  teamProjects: TeamProject[] = [];
  userRatings: {[teamProjectId: string]: number} = {};
  userId = 'current-user-id';

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.loadData();
  }

  loadData(): void {
    this.projectService.getProjectById(this.projectId).subscribe(project => {
      this.project = project;
    });

    this.projectService.getTeamProjectsByProjectId(this.projectId).subscribe(teams => {
      this.teamProjects = teams;
      this.loadUserRatings();
    });
  }

  loadUserRatings(): void {
    this.teamProjects.forEach(team => {
      this.projectService.getUserVote(this.userId, team.teamProjectId)
        .subscribe(vote => {
          if (vote) {
            this.userRatings[team.teamProjectId] = vote.rating;
          }
        });
    });
  }

  rateTeam(teamProjectId: string, rating: number): void {
    if (!this.project?.votingEnabled) return;

    this.projectService.submitVote({
      userId: this.userId,
      projectId: this.projectId,
      teamProjectId,
      rating
    }).subscribe({
      next: () => {
        this.userRatings[teamProjectId] = rating;
      },
      error: (err) => console.error('Failed to submit vote:', err)
    });
  }

  get winningTeam(): TeamProject | undefined {
    const teamsWithVotes = this.teamProjects
      .filter(team => team.averageRating !== undefined)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    
    return teamsWithVotes[0];
  }
  toggleVoting(enabled: boolean): void {
    if (!this.project) return;
    this.projectService.toggleProjectVoting(this.project.id, enabled).subscribe();
  }
}