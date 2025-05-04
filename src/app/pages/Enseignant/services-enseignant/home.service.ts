// project.service.ts
import { Injectable } from '@angular/core';
import { Project, Task, CalendarDay } from '../models/project2.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projectsSubject.asObservable();
  
  private currentProjectSubject = new BehaviorSubject<Project | null>(null);
  currentProject$: Observable<Project | null> = this.currentProjectSubject.asObservable();
  
  private currentMonth = new Date().getMonth();
  private currentYear = new Date().getFullYear();
  private calendarDaysSubject = new BehaviorSubject<CalendarDay[]>([]);
  calendarDays$: Observable<CalendarDay[]> = this.calendarDaysSubject.asObservable();
  
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor() {
    this.initializeProjects();
    this.generateCalendar();
  }

  initializeProjects() {
    const initialProjects: Project[] = [
      {
        id: 1,
        title: 'Web Application design',
        description: 'Design and develop a responsive web application with modern UI/UX principles.',
        category: 'Web Development',
        maxStudents: 3,
        dueDate: '12/05/2025',
        assignedTo: 'Info 2B 2023-2024',
        tasks: [
          { id: 1,  name: 'User Research & Analysis', dueDate: '2025-05-28'},
          { id: 2, name: 'Concept Development', dueDate: '2025-05-30' },
          { id: 3, name: 'Prototyping & Testing', dueDate: '2025-06-01' }
        ],
      },
      {
        id: 2,
        title: 'Mobile application design',
        description: 'Create a cross-platform mobile application with focus on performance.',
        category: 'Mobile Development',
        maxStudents: 4,
        dueDate: '15/05/2025',
        assignedTo: 'Info 3A 2023-2024',
        tasks: [],
      },
      {
        id: 3,
        title: 'Data Visualization',
        description: 'Build interactive data visualization dashboards for business analytics.',
        category: 'Data Science',
        maxStudents: 2,
        dueDate: '20/05/2025',
        assignedTo: 'Info 3B 2023-2024',
        tasks: [],
      }
    ];
    this.projectsSubject.next(initialProjects);
    
    if (initialProjects.length > 0) {
      this.setCurrentProject(initialProjects[0]);
    }
  }

  getAllProjects(): Project[] {
    return this.projectsSubject.value;
  }

  getFilteredProjects(searchText: string): Project[] {
    if (!searchText.trim()) {
      return this.getAllProjects();
    }
    return this.getAllProjects().filter(project => 
      project.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  getCurrentProject(): Project | null {
    return this.currentProjectSubject.value;
  }

  setCurrentProject(project: Project): void {
    this.currentProjectSubject.next(project);
    
    const deadlineDate = this.parseDate(project.dueDate);
    if (deadlineDate) {
      this.currentMonth = deadlineDate.getMonth();
      this.currentYear = deadlineDate.getFullYear();
      this.generateCalendar();
    }
  }

  addProject(project: Project): void {
    const projects = [...this.projectsSubject.value, project];
    this.projectsSubject.next(projects);
    this.setCurrentProject(project);
  }

  updateProject(updatedProject: Project): void {
    const projects = this.projectsSubject.value.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    this.projectsSubject.next(projects);
    this.setCurrentProject(updatedProject);
  }

  deleteProject(projectId: number): void {
    const projects = this.projectsSubject.value.filter(p => p.id !== projectId);
    this.projectsSubject.next(projects);
    
    if (projects.length > 0) {
      this.setCurrentProject(projects[0]);
    } else {
      this.currentProjectSubject.next(null);
    }
  }

  addTaskToProject(projectId: number, task: Task): void {
    const projects = this.projectsSubject.value.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: [...p.tasks!, task]
        };
      }
      return p;
    });
    
    this.projectsSubject.next(projects);
    const updatedProject = projects.find(p => p.id === projectId);
    if (updatedProject) {
      this.currentProjectSubject.next(updatedProject);
    }
    
    const deadlineDate = new Date(task.dueDate);
    this.currentMonth = deadlineDate.getMonth();
    this.currentYear = deadlineDate.getFullYear();
    this.generateCalendar();
  }

  generateCalendar(): void {
    const calendarDays: CalendarDay[] = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Previous month days
    const firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek > 0) {
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0);
      const prevMonthDays = prevMonthLastDay.getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        calendarDays.push({
          day: prevMonthDays - i,
          month: this.currentMonth === 0 ? 11 : this.currentMonth - 1,
          year: this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear,
          isCurrentMonth: false
        });
      }
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      calendarDays.push({
        day: i,
        month: this.currentMonth,
        year: this.currentYear,
        isCurrentMonth: true
      });
    }

    // Next month days
    const daysNeeded = 42 - calendarDays.length;
    for (let i = 1; i <= daysNeeded; i++) {
      calendarDays.push({
        day: i,
        month: this.currentMonth === 11 ? 0 : this.currentMonth + 1,
        year: this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear,
        isCurrentMonth: false
      });
    }
    
    this.calendarDaysSubject.next(calendarDays);
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  getCurrentMonthName(): string {
    return this.months[this.currentMonth];
  }

  getCurrentYear(): number {
    return this.currentYear;
  }

  getCurrentCalendarDays(): CalendarDay[] {
    return this.calendarDaysSubject.value;
  }

  hasDeadlineOnDay(day: CalendarDay): boolean {
    const currentProject = this.currentProjectSubject.value;
    if (!currentProject) return false;
    
    const deadlineDate = this.parseDate(currentProject.dueDate);
    if (deadlineDate && 
        day.day === deadlineDate.getDate() && 
        day.month === deadlineDate.getMonth() && 
        day.year === deadlineDate.getFullYear()) {
      return true;
    }
    
    return currentProject.tasks!.some(task => {
      const taskDeadline = new Date(task.dueDate);
      return day.day === taskDeadline.getDate() && 
             day.month === taskDeadline.getMonth() && 
             day.year === taskDeadline.getFullYear();
    });
  }

  getCalendarDayColor(day: CalendarDay): string {
    const currentProject = this.currentProjectSubject.value;
    if (!currentProject) return '';
    
    const deadlineDate = this.parseDate(currentProject.dueDate);
    if (deadlineDate && 
        day.day === deadlineDate.getDate() && 
        day.month === deadlineDate.getMonth() && 
        day.year === deadlineDate.getFullYear()) {
      return '#4B5563'; // Dark gray for project deadline
    }
    
    for (let i = 0; i < currentProject.tasks!.length; i++) {
      const taskDeadline = new Date(currentProject.tasks![i].dueDate);
      if (day.day === taskDeadline.getDate() && 
          day.month === taskDeadline.getMonth() && 
          day.year === taskDeadline.getFullYear()) {
        return this.getTaskColor(i); // Use task-specific color
      }
    }
    return '';
  }

  isToday(day: CalendarDay): boolean {
    const today = new Date();
    return day.day === today.getDate() && 
           day.month === today.getMonth() && 
           day.year === today.getFullYear();
  }

  getTaskColor(index: number): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];
    return colors[index % colors.length];
  }

  isCloseToDeadline(dateStr: string, daysThreshold: number): boolean {
    if (!dateStr) return false;
    const deadlineDate = new Date(dateStr);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysThreshold;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDateForInput(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  formatTaskDeadline(dateStr: string): string {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    const day = date.getDate();
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    return `${day}${suffix}`;
  }

  parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }
}