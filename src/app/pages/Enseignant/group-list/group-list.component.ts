import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Group, TeamProject } from '../models/project.model';
import { GroupService } from '../services/group.service';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { Observable, map } from 'rxjs';

interface ProjectWithColor extends TeamProject {
  buttonColor: string;
}

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-list.component.html',
  styles: [`
    .avatar-initial {
      width: 25px;
      height: 25px;
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
export class GroupListComponent implements OnInit {
  searchTerm = '';
  selectedGroup: Group | null = null;
  groups: Group[] = [];
  filteredGroups: Group[] = [];
  projectsWithColors: ProjectWithColor[] = [];

  constructor(private dialog: MatDialog, private groupService: GroupService, private router: Router) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  viewProjectDetails(groupId: number, projectId: number): void {
    this.router.navigate(["/layout2/project-details", groupId, projectId]);
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
      this.filteredGroups = [...this.groups];
      if (this.groups.length > 0) {
        this.selectedGroup = this.groups[0];
        this.assignColorsToProjects();
      }
    });
  }

  selectGroup(group: Group): void {
    this.selectedGroup = group;
    this.assignColorsToProjects();
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.groupService.searchGroups(term).subscribe(filteredGroups => {
      this.filteredGroups = filteredGroups;
    });
  }

  assignColorsToProjects(): void {
    if (this.selectedGroup && this.selectedGroup.projects) {
      this.projectsWithColors = this.selectedGroup.projects.map(project => ({
        ...project,
        buttonColor: this.getRandomColor()
      }));
    } else {
      this.projectsWithColors = [];
    }
  }

  getRandomColor(): string {
    const colors = ['#148B84', '#AC2C80'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getHoverColor(baseColor: string): string {
    const hoverColors: { [key: string]: string } = {
      '#148B84': '#1FA89E',
      '#AC2C80': '#C74A99'
    };
    return hoverColors[baseColor] || baseColor;
  }

  getRandomColorName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = '#' + ((hash & 0x00FFFFFF) | 0x808080).toString(16).padStart(6, '0');
    return color;
  }
}