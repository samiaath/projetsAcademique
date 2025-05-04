import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TeamProject } from '../../pages/project.model';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-team-projects',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './team-projects.component.html',
  styleUrls: ['./team-projects.component.scss'] 
})
export class TeamProjectComponent implements OnInit {
  teamProjects: TeamProject[] = [];
  teamProject!: TeamProject | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectService.getAllTeamProjects().subscribe((projects) => {
      this.teamProjects = projects;
  
      const teamProjectId = this.route.snapshot.paramMap.get('id');
      if (teamProjectId) {
        this.teamProject = this.teamProjects.find(tp => tp.teamProjectId === teamProjectId);
      }
    });
  }
  goToDetails(id: string) {
    this.router.navigate(['/layout/teamProject', id]);
  }
  getRandomBorderColor(): string {
    const colors = ['#6366F1', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  getRandomPastelColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 95%)`;
  }
  
}
