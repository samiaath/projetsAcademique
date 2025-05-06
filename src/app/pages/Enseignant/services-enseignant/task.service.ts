//task
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task} from '../models/project2.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    private tasks: Task[] = [
        {
          id: 1,
          name: "User Research & Analysis",
          description: "Conduct user research and analyze findings",
          deliverables: "Research report",
          dueDate: "2024-05-20",
          isCompleted: false,
        },
        {
          id: 2,
          name: "Concept Development",
          description: "Develop initial concepts based on research",
          deliverables: "Concept documents",
          dueDate: "2024-06-10",
          isCompleted: false,
        },
        {
          id: 3,
          name: "Prototyping & Testing",
          description: "Create prototypes and conduct user testing",
          deliverables: "Prototype files and test results",
          dueDate: "2024-07-01",
          isCompleted: false,
        },
      ]
}