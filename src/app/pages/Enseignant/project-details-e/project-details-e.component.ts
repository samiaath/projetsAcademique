import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamProject, Task } from '../models/project2.model';
import { ProjectDetailsService } from '../services-enseignant/project-details.service';
import { GroupService } from '../services-enseignant/group.service'; // Added

@Component({
  selector: 'app-project-details-e',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-details-e.component.html',
  styles: []
})
export class ProjectDetailsEComponent implements OnInit {
  project: TeamProject | null = null;
  tasks: Task[] = [];
  expandedTask: number | null = null;
  messages: string[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectDetailsService: ProjectDetailsService,
    private groupService: GroupService // Added
  ) {}

  ngOnInit(): void {
    // Retrieve the project from navigation state with type assertion
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.project = (navigation.extras.state as { project: TeamProject })['project'] || null;
      console.log('Project from state:', this.project); // Debug log
    }

    // Fallback: Fetch project from GroupService if state is unavailable
    if (!this.project) {
      const groupId = +this.route.snapshot.paramMap.get('groupId')!;
      const projectId = +this.route.snapshot.paramMap.get('projectId')!;
      this.groupService.getGroups().subscribe(groups => {
        const group = groups.find(g => g.id === groupId);
        this.project = group?.projects.find(p => p.id === projectId) || null;
        console.log('Project from GroupService:', this.project); // Debug log
      });
    }

    // Load tasks from the service
    this.tasks = this.projectDetailsService.getTasks();

    // Subscribe to expanded task changes
    this.projectDetailsService.expandedTask$.subscribe(taskId => {
      this.expandedTask = taskId;
    });

    // Subscribe to messages (convert ChatMessage to string for simplicity)
    this.projectDetailsService.messages$.subscribe(messages => {
      this.messages = messages.map(message => message.content);
    });

    // Update tasks with projectId if needed
    const projectId = +this.route.snapshot.paramMap.get('projectId')!;
    this.projectDetailsService.updateTasksProjectId(projectId);
  }

  toggleTask(taskId: number): void {
    this.projectDetailsService.toggleTask(taskId);
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.projectDetailsService.addMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  getFileColor(fileType: string): string {
    return this.projectDetailsService.getFileColor(fileType);
  }

  getActionLabel(fileType: string): string {
    return this.projectDetailsService.getActionLabel(fileType);
  }
}