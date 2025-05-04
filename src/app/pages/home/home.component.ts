import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../project.model';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  projects: Project[] = [];

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
    });
  }

  navigateToProjectDetails(projectId: string): void {
    this.router.navigate([`/layout/project/${projectId}`]);
  }
  // Add these methods to your component class
getRandomBorderColor(): string {
  const colors = ['#6366F1', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
  return colors[Math.floor(Math.random() * colors.length)];
}

getRandomTextColor(): string {
  const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 
                 'text-indigo-600', 'text-red-600', 'text-yellow-600', 'text-orange-600'];
  return colors[Math.floor(Math.random() * colors.length)];
}

getRandomBgColor(): string {
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 
                 'bg-indigo-100', 'bg-red-100', 'bg-yellow-100', 'bg-orange-100'];
  return colors[Math.floor(Math.random() * colors.length)];
}
}
