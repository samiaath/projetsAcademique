import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project, Task, CalendarDay } from '../models/project2.model';
import { HomeService } from "../services/home.service" 

@Component({
  selector: 'app-home2',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss']
})
export class Home2Component implements OnInit {
  projectForm: FormGroup;
  taskForm: FormGroup;
  editTaskForm: FormGroup;
  isCreatingProject = false;
  isEditingProject = false;
  selectedDate: Date | null = null;
  searchText: string = '';
  showTaskModal: boolean = false;
  showEditTaskModal: boolean = false;
  showConfirmation: boolean = false;
  currentEditTaskIndex: number | null = null;
  editingExistingTask: boolean = false;

  get projects(): Project[] {
    return this.projectService.getAllProjects();
  }

  get currentProject(): Project | null {
    return this.projectService.getCurrentProject();
  }

  get filteredProjects(): Project[] {
    return this.projectService.getFilteredProjects(this.searchText);
  }

  get calendarDays(): CalendarDay[] {
    return this.projectService.getCurrentCalendarDays();
  }

  get weekDays() {
    return this.projectService.weekDays;
  }

  get currentMonthName(): string {
    return this.projectService.getCurrentMonthName();
  }

  get currentYear(): number {
    return this.projectService.getCurrentYear();
  }

  get tasksArray() {
    return this.projectForm.get('tasks') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private projectService: HomeService
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['Web Development', Validators.required],
      maxStudents: [3, [Validators.required, Validators.min(1)]],
      assignedTo: ['', Validators.required],
      deadline: [new Date(), Validators.required],
      tasks: this.fb.array([])
    });

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      deliverable: [''],
      startDate: [this.projectService.formatDateForInput(new Date()), Validators.required],
      deadline: [this.projectService.formatDateForInput(new Date()), Validators.required]
    });

    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      deliverable: [''],
      startDate: [this.projectService.formatDateForInput(new Date()), Validators.required],
      deadline: [this.projectService.formatDateForInput(new Date()), Validators.required]
    });
  }

  ngOnInit(): void {
    this.selectedDate = new Date();
  }

  selectDate(day: CalendarDay) {
    this.selectedDate = new Date(day.year, day.month, day.day);
    if (this.isCreatingProject || this.isEditingProject) {
      this.projectForm.patchValue({
        deadline: this.selectedDate
      });
    }
    if (this.showTaskModal || this.showEditTaskModal) {
      const formattedDate = this.projectService.formatDateForInput(this.selectedDate);
      if (this.showTaskModal) {
        this.taskForm.patchValue({
          deadline: formattedDate
        });
      }
      if (this.showEditTaskModal) {
        this.editTaskForm.patchValue({
          deadline: formattedDate
        });
      }
    }
  }

  isSelectedDate(day: CalendarDay): boolean {
    if (!this.selectedDate) return false;
    return day.day === this.selectedDate.getDate() && 
           day.month === this.selectedDate.getMonth() && 
           day.year === this.selectedDate.getFullYear();
  }

  isToday(day: CalendarDay): boolean {
    return this.projectService.isToday(day);
  }

  hasDeadlineOnDay(day: CalendarDay): boolean {
    return this.projectService.hasDeadlineOnDay(day);
  }

  getCalendarDayColor(day: CalendarDay): string {
    return this.projectService.getCalendarDayColor(day);
  }

  getTaskColor(index: number): string {
    return this.projectService.getTaskColor(index);
  }

  prevMonth() {
    this.projectService.prevMonth();
  }

  nextMonth() {
    this.projectService.nextMonth();
  }

  createNewProject() {
    this.isCreatingProject = true;
    this.isEditingProject = false;
    this.projectForm.reset({
      name: '',
      description: '',
      category: 'Web Development',
      maxStudents: 3,
      assignedTo: '',
      deadline: new Date()
    });
    
    // Clear tasks array
    const tasksArray = this.projectForm.get('tasks') as FormArray;
    while (tasksArray.length) {
      tasksArray.removeAt(0);
    }
    
    this.selectedDate = new Date();
  }

  viewProject(project: Project) {
    this.projectService.setCurrentProject(project);
    this.isCreatingProject = false;
    this.isEditingProject = false;
    const deadlineDate = this.projectService.parseDate(project.dueDate);
    if (deadlineDate) {
      this.selectedDate = deadlineDate;
    }
  }

  editProject() {
    const currentProject = this.currentProject;
    if (currentProject) {
      this.isCreatingProject = false;
      this.isEditingProject = true;
      this.projectForm.patchValue({
        name: currentProject.title,
        description: currentProject.description,
        category: currentProject.category,
        maxStudents: currentProject.maxStudents,
        assignedTo: currentProject.assignedTo,
        deadline: this.projectService.parseDate(currentProject.dueDate) || new Date()
      });
      
      const tasksArray = this.projectForm.get('tasks') as FormArray;
      tasksArray.clear();
      
      if (currentProject.tasks && currentProject.tasks.length > 0) {
        currentProject.tasks.forEach(task => {
          tasksArray.push(this.fb.group({
            title: [task.name, Validators.required],
            description: [task.description || ''],
            deliverable: [task.deliverables || ''],
            startDate: [task.startDate ? this.projectService.formatDateForInput(new Date(task.startDate)) : this.projectService.formatDateForInput(new Date()), Validators.required],
            deadline: [task.dueDate, Validators.required]
          }));
        });
      }
      
      this.selectedDate = this.projectService.parseDate(currentProject.dueDate) || new Date();
    }
  }

  deleteProject() {
    if (this.currentProject && confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(this.currentProject.id);
      this.isCreatingProject = false;
      this.isEditingProject = false;
    }
  }

  editField(field: string) {
    console.log(`Editing ${field}`);
    // Implement field-specific editing logic here
  }

  deleteField(field: string) {
    if (confirm(`Are you sure you want to clear the ${field}?`)) {
      if (field === 'name') this.projectForm.get('name')?.reset();
      else if (field === 'description') this.projectForm.get('description')?.reset();
      else if (field === 'assignedTo') this.projectForm.get('assignedTo')?.reset();
      else if (field === 'maxStudents') this.projectForm.get('maxStudents')?.setValue(3);
    }
  }

  addTaskToForm() {
    const tasks = this.projectForm.get('tasks') as FormArray;
    tasks.push(this.fb.group({
      title: ['', Validators.required],
      description: [''],
      deliverable: [''],
      startDate: [this.projectService.formatDateForInput(new Date()), Validators.required],
      deadline: [this.projectService.formatDateForInput(new Date()), Validators.required]
    }));
  }

  editTask(index: number) {
    this.openEditTaskModal(index);
  }

  deleteTask(index: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      const tasks = this.projectForm.get('tasks') as FormArray;
      tasks.removeAt(index);
    }
  }

  // Edit task in project view mode
  editTaskInProject(index: number) {
    if (!this.currentProject || !this.currentProject.tasks) return;
    
    const task = this.currentProject.tasks[index];
    this.editingExistingTask = true;
    this.currentEditTaskIndex = index;
    
    this.editTaskForm.patchValue({
      title: task.name,
      description: task.description || '',
      deliverable: task.deliverables || '',
      startDate: task.startDate ? this.projectService.formatDateForInput(new Date(task.startDate)) : this.projectService.formatDateForInput(new Date()),
      deadline: task.dueDate
    });
    
    this.showEditTaskModal = true;
  }

  // Delete task in project view mode
  deleteTaskFromProject(index: number) {
    if (!this.currentProject || !this.currentProject.tasks) return;
    
    if (confirm('Are you sure you want to delete this task?')) {
      const updatedProject = {...this.currentProject};
      updatedProject.tasks = updatedProject.tasks!.filter((_, i) => i !== index);
      this.projectService.updateProject(updatedProject);
    }
  }

  openEditTaskModal(index: number) {
    this.currentEditTaskIndex = index;
    this.editingExistingTask = false;
    const task = this.tasksArray.at(index).value;
    this.editTaskForm.patchValue({
      title: task.title,
      description: task.description || '',
      deliverable: task.deliverable || '',
      startDate: task.startDate || this.projectService.formatDateForInput(new Date()),
      deadline: task.deadline
    });
    this.showEditTaskModal = true;
  }

  closeEditTaskModal() {
    this.showEditTaskModal = false;
    this.currentEditTaskIndex = null;
    this.editingExistingTask = false;
    this.editTaskForm.reset();
  }

  updateTask() {
    if (!this.editTaskForm.valid || this.currentEditTaskIndex === null) return;
    
    const formValue = this.editTaskForm.value;
    
    if (this.editingExistingTask && this.currentProject) {
      // Update task in project view mode
      const updatedProject = {...this.currentProject};
      if (!updatedProject.tasks) updatedProject.tasks = [];
      
      updatedProject.tasks[this.currentEditTaskIndex] = {
        ...updatedProject.tasks[this.currentEditTaskIndex],
        name: formValue.title,
        description: formValue.description,
        deliverables: formValue.deliverable,
        startDate: new Date(formValue.startDate),
        dueDate: formValue.deadline
      };
      
      this.projectService.updateProject(updatedProject);
    } else {
      // Update task in edit project mode
      const tasks = this.projectForm.get('tasks') as FormArray;
      tasks.at(this.currentEditTaskIndex).patchValue(formValue);
    }
    
    this.closeEditTaskModal();
  }

  confirmSaveProject() {
    if (this.projectForm.valid) {
      this.showConfirmation = true;
    }
  }

  saveProject() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const newProject: Project = {
        id: this.isEditingProject && this.currentProject ? this.currentProject.id : Date.now(),
        title: formValue.name,
        description: formValue.description,
        category: formValue.category,
        maxStudents: formValue.maxStudents,
        dueDate: this.projectService.formatDate(formValue.deadline),
        assignedTo: formValue.assignedTo,
        tasks: formValue.tasks.map((task: any, index: number) => ({
          id: index + 1,
          name: task.title,
          description: task.description,
          deliverables: task.deliverable,
          startDate: new Date(task.startDate),
          dueDate: task.deadline,
          status: 'Pending'
        }))
      };
      
      if (this.isEditingProject && this.currentProject) {
        this.projectService.updateProject(newProject);
      } else {
        this.projectService.addProject(newProject);
      }
      
      this.isCreatingProject = false;
      this.isEditingProject = false;
      this.showConfirmation = false;
    }
  }

  formatTaskDeadline(dateStr: string): string {
    return this.projectService.formatTaskDeadline(dateStr);
  }

  isCloseToDeadline(dateStr: string, daysThreshold: number): boolean {
    return this.projectService.isCloseToDeadline(dateStr, daysThreshold);
  }

  openTaskModal() {
    this.showTaskModal = true;
    this.taskForm.reset({
      title: '',
      description: '',
      deliverable: '',
      startDate: this.projectService.formatDateForInput(new Date()),
      deadline: this.projectService.formatDateForInput(new Date())
    });
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.taskForm.reset();
  }

  addTask() {
    if (this.taskForm.valid && this.currentProject) {
      const formValue = this.taskForm.value;
      const newTask: Task = {
        id: this.currentProject.tasks ? this.currentProject.tasks.length + 1 : 1,
        name: formValue.title,
        description: formValue.description,
        deliverables: formValue.deliverable,
        startDate: new Date(formValue.startDate),
        dueDate: formValue.deadline,
        status: 'Pending'
      };
      
      this.projectService.addTaskToProject(this.currentProject.id, newTask);
      this.closeTaskModal();
    }
  }

  cancel() {
    this.isCreatingProject = false;
    this.isEditingProject = false;
    if (this.projects.length > 0) {
      this.viewProject(this.projects[0]);
    }
  }
}