import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project, Task, CalendarDay } from '../models/project2.model';
import { HomeService } from "../services-enseignant/home.service";

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
  isCreatingProject = false;
  isAddingToExistingProject = false;
  selectedDate: Date | null = null;
  searchText: string = '';
  showTaskModal: boolean = false;
  showConfirmation: boolean = false;
  groupOptions: { label: string, value: string }[] = [];
  filteredGroupOptions: { label: string, value: string }[] = [];
  showGroupList: boolean = false;

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
      assignedTo: [[], Validators.required],
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
  }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.projectService.getGroups().subscribe(groups => {
      this.groupOptions = groups.map(g => ({
        label: g,
        value: g
      }));
      this.filteredGroupOptions = [...this.groupOptions];
    });
  }

  // Get label for a given value
  getGroupLabel(value: string): string {
    const option = this.groupOptions.find(opt => opt.value === value);
    return option ? option.label : value; // Fallback to value if not found
  }

  // Filter group options based on input
  filterGroupOptions(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    const currentAssigned = this.projectForm.get('assignedTo')?.value || [];
    this.filteredGroupOptions = this.groupOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm) &&
      !currentAssigned.includes(option.value)
    );
  }

  // Select a group from the custom list
  selectGroup(option: { label: string, value: string }): void {
    const currentAssigned = this.projectForm.get('assignedTo')?.value || [];
    const updatedAssigned = [...currentAssigned, option.value];
    this.projectForm.get('assignedTo')?.setValue(updatedAssigned);
    this.filteredGroupOptions = this.groupOptions.filter(
      opt => !updatedAssigned.includes(opt.value)
    );
    this.showGroupList = false;
  }

  // Remove a group from selected items
  removeGroup(value: string): void {
    const currentAssigned = this.projectForm.get('assignedTo')?.value || [];
    const updatedAssigned = currentAssigned.filter((val: string) => val !== value);
    this.projectForm.get('assignedTo')?.setValue(updatedAssigned);
    this.filteredGroupOptions = this.groupOptions.filter(
      opt => !updatedAssigned.includes(opt.value)
    );
  }

  // Handle blur to hide the list (with a delay to allow clicks)
  onGroupInputBlur(): void {
    setTimeout(() => {
      this.showGroupList = false;
    }, 200);
  }

  // Show the list when input is focused
  onGroupInputFocus(): void {
    this.showGroupList = true;
  }

  selectDate(day: CalendarDay) {
    this.selectedDate = new Date(day.year, day.month, day.day);
    if (this.isCreatingProject) {
      this.projectForm.patchValue({ deadline: this.selectedDate });
    }
    if (this.showTaskModal) {
      const formattedDate = this.projectService.formatDateForInput(this.selectedDate);
      this.taskForm.patchValue({ deadline: formattedDate });
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
    this.projectForm.reset({
      name: '',
      description: '',
      category: 'Web Development',
      maxStudents: 3,
      assignedTo: [],
      deadline: new Date()
    });
    const tasksArray = this.projectForm.get('tasks') as FormArray;
    while (tasksArray.length) tasksArray.removeAt(0);
    this.selectedDate = new Date();
    this.filteredGroupOptions = [...this.groupOptions];
  }

  viewProject(project: Project) {
    this.projectService.setCurrentProject(project);
    this.isCreatingProject = false;
    this.selectedDate = this.projectService.parseDate(project.dueDate!) || new Date();
  }

  confirmSaveProject() {
    if (this.projectForm.valid) this.showConfirmation = true;
  }

  saveProject() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const newProject: Project = {
        id: Date.now(),
        title: formValue.name,
        description: formValue.description,
        category: formValue.category,
        maxStudents: formValue.maxStudents,
        dueDate: this.projectService.formatDate(formValue.deadline),
        assignedTo: formValue.assignedTo,
        tasks: formValue.tasks.map((task: any, index: number) => ({
          id: index + 1,
          name: task.title || task.name,
          description: task.description,
          deliverables: task.deliverable || task.deliverables,
          startDate: new Date(task.startDate),
          dueDate: task.deadline,
          status: 'Pending'
        }))
      };
      this.projectService.addProject(newProject);
      this.isCreatingProject = false;
      this.showConfirmation = false;
      this.viewProject(newProject);
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
    this.isAddingToExistingProject = !this.isCreatingProject && !!this.currentProject;
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
    this.isAddingToExistingProject = false;
    this.taskForm.reset();
  }

  addTask() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const newTask: Task = {
        id: (this.isCreatingProject ? this.tasksArray.length : (this.currentProject?.tasks?.length || 0)) + 1,
        name: formValue.title,
        description: formValue.description,
        deliverables: formValue.deliverable,
        startDate: new Date(formValue.startDate),
        dueDate: formValue.deadline,
        status: 'Pending'
      };

      if (this.isCreatingProject) {
        this.tasksArray.push(this.fb.group(newTask));
      } else if (this.isAddingToExistingProject && this.currentProject) {
        const updatedProject: Project = {
          ...this.currentProject,
          tasks: [...(this.currentProject.tasks || []), newTask]
        };
        this.projectService.updateProject(updatedProject);
        this.projectService.setCurrentProject(updatedProject);
      }

      this.closeTaskModal();
    }
  }

  cancel() {
    this.isCreatingProject = false;
    if (this.projects.length > 0) this.viewProject(this.projects[0]);
    else this.projectForm.reset();
  }
}