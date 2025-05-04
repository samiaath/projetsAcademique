import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamProject } from '../models/project2.model';
import { ArchiveService } from '../services/archive.service';
import { ActivatedRoute,Router, RouterModule, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './archive.component.html',
  providers: [ArchiveService],
  styles: [`
    :host {
      display: block;
      background-color: white;
      min-height: 100vh;
    }

    /* Gradient animation */
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .bg-gradient-to-r {
      background-size: 200% 200%;
      animation: gradientShift 6s ease infinite;
    }

    .avatar-initial {
      width: 40px;
      height: 40px;
      background-color: #6b46c1;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})


export class ArchiveComponent implements OnInit {
  searchYear: string = '';
  projects: TeamProject[] = [];
  filteredProjects: TeamProject[] = [];

  constructor(private archiveService: ArchiveService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.archiveService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.filteredProjects = [...this.projects];
    });
  }


  viewProjectDetails(groupId: string, projectId: string): void {
    this.router.navigate(["/layout2/project-details-e", groupId, projectId])
  }

  filterProjects(): void {
    this.archiveService.filterProjectsByYear(this.searchYear).subscribe(filtered => {
      this.filteredProjects = filtered;
    });
  }

  getRandomColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = '#' + ((hash & 0x00FFFFFF) | 0x808080).toString(16).padStart(6, '0');
    return color;
  }
}