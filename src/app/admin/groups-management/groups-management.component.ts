import { Component } from '@angular/core';
import { GroupsManagementService } from '../admin-service/groups-management.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Group } from '../group.model'; // Corrected path to Group model

 // Corrected path to GroupService 

@Component({
  selector: 'app-groups-management',
  standalone: true,
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './groups-management.component.html',
  styleUrl: './groups-management.component.scss'
})
export class GroupsManagementComponent {

  groups: Group[] = [] // Initialize with an empty array 

  searchTerm = ""
  showCreateForm = false
  groupForm: FormGroup
  isSubmitting = false

  // Color palettes for cards
  colors = [
    { border: "#4F46E5", text: "#4F46E5", bg: "#EEF2FF" }, // Indigo
    { border: "#10B981", text: "#10B981", bg: "#ECFDF5" }, // Emerald
    { border: "#F59E0B", text: "#F59E0B", bg: "#FFFBEB" }, // Amber
    { border: "#EF4444", text: "#EF4444", bg: "#FEF2F2" }, // Red
    { border: "#8B5CF6", text: "#8B5CF6", bg: "#F5F3FF" }, // Violet
    { border: "#EC4899", text: "#EC4899", bg: "#FDF2F8" }, // Pink
  ]

  constructor(
    private groupService: GroupsManagementService,
    private fb: FormBuilder,
  ) {
    this.groupForm = this.fb.group({
      name: ["", Validators.required],
      sector: ["", Validators.required],
      universityYear: ["", Validators.required],
      emailsText: [""],
    })
    
  }

  ngOnInit(): void {
    
     this.loadGroups();
  }

  get filteredGroups(): Group[] {
    if (!this.searchTerm) return this.groups
    return this.groups.filter(
      (group) =>
        group.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        group.sector.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        group.universityYear.toLowerCase().includes(this.searchTerm.toLowerCase()),
    )
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm
    if (!this.showCreateForm) {
      this.groupForm.reset()
    }
  }

  onSubmit(): void {
    if (this.groupForm.invalid) return

    this.isSubmitting = true

    // Parse emails from textarea
    const emailsText = this.groupForm.get("emailsText")?.value || ""
    const pendingStudentEmails = emailsText
      .split("\n")
      .map((email: string) => email.trim())
      .filter((email: string) => email.length > 0)

    const newGroup = {
      name: this.groupForm.get("name")?.value,
      sector: this.groupForm.get("sector")?.value,
      universityYear: this.groupForm.get("universityYear")?.value,
      pendingStudentEmails,
    }

    // In a real app, we would call the API
    this.groupService.createGroup(newGroup).subscribe({
      next: (response) => {
        console.log("Group created successfully:", response)
        // Add the new group to the list with a generated ID
        const createdGroup: Group = {
          id: this.getNextId(),
          name: newGroup.name,
          sector: newGroup.sector,
          universityYear: newGroup.universityYear,
          numberstudents: pendingStudentEmails.length,

          
        }

        this.groups.unshift(createdGroup)
        this.toggleCreateForm()
        this.isSubmitting = false
      },
      error: (error) => {
        console.error("Error creating group:", error)
        this.isSubmitting = false
        // In a real app, we would show an error message
      },
    })
  }

  viewGroupDetails(id: number): void {
    console.log("View group details:", id)
    // In a real app, we would navigate to the group details page
  }

  // Helper methods for colors
  getBorderColor(id: number): string {
    return this.colors[id % this.colors.length].border
  }

  getTextColor(id: number): string {
    return this.colors[id % this.colors.length].text
  }

  getBgColor(id: number, opacity = 1): string {
    return this.colors[id % this.colors.length].bg
  }

  private getNextId(): number {
    return Math.max(...this.groups.map((g) => g.id), 0) + 1
  }

  private loadGroups(): void {
    // In a real app, we would fetch groups from the API
    this.groupService.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups
      },
      error: (error) => {
        console.error("Error loading groups:", error)
      },
    })
  }}
