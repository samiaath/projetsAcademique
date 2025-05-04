import { Component, type OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { ProjectService } from "../../services/project.service"
import type { Project, TeamProject } from "../project.model"
import  { DateService } from "../../services/date.service"
import { DeliverablesModalComponent } from "../delivrables-modal/delivrables-modal.component"

interface CalendarDay {
  date: Date
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isDueDate: boolean
}

@Component({
  selector: "app-project-details",
  standalone: true,
  templateUrl: "./project-details.component.html",
  imports: [CommonModule, FormsModule, DeliverablesModalComponent],
  styleUrls: ["./project-details.component.scss"],
})
export class ProjectDetailsComponent implements OnInit {
  openVotingInterface() {
    if (!this.projectDetails?.id) return

    this.router.navigate(["/layout/project", this.projectDetails.id, "vote"])
  }

  projectId!: number
  projectDetails: Project = {} as Project
  projects: Project[] = []
  teamProjects: TeamProject[] = []
  searchQuery = ""
  filteredTeamProjects: TeamProject[] = []
  currentMonth: Date = new Date()
  calendarDays: CalendarDay[] = []
  weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  projectDueDates: Date[] = []

  // Task details modal
  showTaskDetailsModal = false
  selectedTask: any = null

  // Deliverables modal
  showDeliverablesModal = false
  selectedTeamProject: TeamProject | null = null

  tasks: any[] = [] // On va y injecter les tâches du projet

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private dateService: DateService,
  ) {}

  openTaskDetailsModal(taskId: number) {
    this.selectedTask = this.tasks.find((task) => task.id === taskId)
    this.showTaskDetailsModal = true
  }

  closeTaskDetailsModal() {
    this.showTaskDetailsModal = false
    this.selectedTask = null
  }

  // Methods for deliverables modal
  openDeliverablesModal(teamProject: TeamProject) {
    this.selectedTeamProject = teamProject
    this.showDeliverablesModal = true
  }

  closeDeliverablesModal() {
    this.showDeliverablesModal = false
    this.selectedTeamProject = null
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")!
    this.projectId = Number.parseInt(idParam, 10)

    this.projectService.getProjects().subscribe((data) => {
      this.projects = data
      this.projectDetails = this.projects.find((project) => project.id === this.projectId) || ({} as Project)
      this.tasks = this.projectDetails.tasks || []
      this.loadProjectDueDates()
      this.generateCalendar()
    })

    this.projectService.getTeamProjectsByProjectId(this.projectId).subscribe((teamProjects) => {
      this.teamProjects = teamProjects
      this.filteredTeamProjects = [...teamProjects]
    })
  }

  filterTeamProjects(): void {
    if (!this.searchQuery) {
      this.filteredTeamProjects = [...this.teamProjects]
      return
    }

    const query = this.searchQuery.toLowerCase()
    this.filteredTeamProjects = this.teamProjects.filter(
      (project) =>
        project.teamProjectName.toLowerCase().includes(query) ||
        project.members.some((member) => member.toLowerCase().includes(query)),
    )
  }

  showCreateProjectModal = false

  openCreateProjectModal() {
    this.showCreateProjectModal = true
  }

  closeCreateProjectModal() {
    this.showCreateProjectModal = false
  }

  // Fields for form binding
  teamProjectName = ""
  members: string[] = []
  memberInput = "" // for individual member input

  // Handle member add
  addMember() {
    if (this.memberInput.trim()) {
      this.members.push(this.memberInput.trim())
      this.memberInput = ""
    }
  }

  // Create the Team Project based on the current global project
  createTeamProject() {
    if (!this.teamProjectName || this.members.length === 0) {
      alert("Please enter a team project name and at least one member.")
      return
    }

    const created = this.projectService.createTeamProject(this.projectDetails, this.teamProjectName, this.members)

    console.log("✅ Team project created:", created)

    // Optionally reset
    this.teamProjectName = ""
    this.members = []
    this.closeCreateProjectModal()
  }

  // Calendar methods
  loadProjectDueDates(): void {
    this.projectDueDates = []

    // Add only the main project's due date
    const projectDueDate = this.dateService.parseDate(this.projectDetails.dueDate)
    if (projectDueDate) {
      this.projectDueDates.push(projectDueDate)
    }
  }

  generateCalendar(): void {
    this.calendarDays = []
    const year = this.currentMonth.getFullYear()
    const month = this.currentMonth.getMonth()

    // Get first and last day of month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Get days from previous month to start calendar
    const startingDayOfWeek = firstDay.getDay()
    const daysFromPrevMonth = startingDayOfWeek

    // Get days from next month to complete calendar
    const totalDays = lastDay.getDate()
    const endingDayOfWeek = lastDay.getDay()
    const daysFromNextMonth = 6 - endingDayOfWeek

    const today = new Date()

    // Previous month days
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(year, month, -i + 1)
      this.addCalendarDay(date, false, today)
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i)
      this.addCalendarDay(date, true, today)
    }

    // Next month days
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i)
      this.addCalendarDay(date, false, today)
    }
  }

  addCalendarDay(date: Date, isCurrentMonth: boolean, today: Date): void {
    // Normalize dates to compare just day/month/year
    const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const currentNormalized = normalizeDate(date)

    const isDueDate = this.projectDueDates.some((dueDate) => {
      const normalizedDueDate = normalizeDate(dueDate)
      return normalizedDueDate.getTime() === currentNormalized.getTime()
    })

    this.calendarDays.push({
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: date.toDateString() === today.toDateString(),
      isDueDate,
    })
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1)
    this.generateCalendar()
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1)
    this.generateCalendar()
  }

  getMonthYearString(): string {
    return this.currentMonth.toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    })
  }

  getWeeks(): CalendarDay[][] {
    const weeks: CalendarDay[][] = []
    let week: CalendarDay[] = []

    this.calendarDays.forEach((day, index) => {
      week.push(day)
      if ((index + 1) % 7 === 0) {
        weeks.push(week)
        week = []
      }
    })

    return weeks
  }

  // Method to check if the team has any completed tasks with deliverables
  hasDeliverables(teamProject: TeamProject): boolean {
    if (!teamProject || !teamProject.tasks) return false

    return teamProject.tasks.some(
      (task) =>
        task.isCompleted &&
        (task.deliverables.toLowerCase().includes("github") ||
          task.deliverables.toLowerCase().includes("video") ||
          task.deliverables.toLowerCase().includes("pdf")),
    )
  }
}
