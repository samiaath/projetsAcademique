import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ProjectService } from '../../services/project.service';
import { DateService } from "../../services/date.service"
import type { Project } from "../project.model"

interface CalendarDay {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
  tasks: CalendarTask[]
}

interface CalendarTask {
  id: string
  name: string
  projectTitle: string
  timeSlot: string
  category: string
  
}

interface TimeSlot {
  label: string
  start: number
  end: number
}

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date()
  currentMonth: Date = new Date()
  weekDays: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  calendarDays: CalendarDay[] = []
  projects: Project[] = []
  allTasks: any[] = [] // Using any to accommodate the extended Task properties
  calendarTasks: { [key: string]: CalendarTask[] } = {} // key is date string in format YYYY-MM-DD

  timeSlots: TimeSlot[] = [
    { label: "8:00 - 10:00", start: 8, end: 10 },
    { label: "10:00 - 12:00", start: 10, end: 12 },
    { label: "12:00 - 14:00", start: 12, end: 14 },
    { label: "14:00 - 16:00", start: 14, end: 16 },
    { label: "16:00 - 18:00", start: 16, end: 18 },
    { label: "18:00 - 20:00", start: 18, end: 20 },
  ]

  constructor(
    private projectService: ProjectService,
    private dateService: DateService,
  ) {}

  ngOnInit(): void {
    this.loadProjects()
    this.generateCalendar()
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects
      this.extractAllTasks()
      this.mapTasksToCalendar()
    })
  }

  extractAllTasks(): void {
    this.allTasks = []
    this.projects.forEach((project) => {
      if (project.tasks) {
        project.tasks.forEach((task) => {
          this.allTasks.push({
            ...task,
            projectId: project.id,
            projectTitle: project.title,
            category: project.category,
            
          })
        })
      }
    })
  }

  mapTasksToCalendar(): void {
    this.calendarTasks = {};
  
    this.allTasks.forEach((task) => {
      if (!task.dueDate) return;
  
      // Parse the date correctly
      const dueDate = this.dateService.parseDate(task.dueDate);
      if (!dueDate) return;
  
      const dateKey = this.dateService.getDateKey(dueDate);
  
      if (!this.calendarTasks[dateKey]) {
        this.calendarTasks[dateKey] = [];
      }
  
      this.calendarTasks[dateKey].push({
        id: task.id.toString(),
        name: task.name,
        projectTitle: task.projectTitle,
        timeSlot: this.dateService.assignTimeSlot(task, this.timeSlots),
        category: task.category
      });
    });
  
    // Update the visible days with tasks
    this.updateCalendarWithTasks();
  }

  updateCalendarWithTasks(): void {
  this.visibleDays.forEach((day) => {
    const dateKey = this.dateService.getDateKey(day.date);
    day.tasks = this.calendarTasks[dateKey] || [];
  });
}

  

  prevMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1)
    this.generateCalendar()
    this.mapTasksToCalendar() // Refresh tasks for the new month
  }

  nextMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1)
    this.generateCalendar()
    this.mapTasksToCalendar() // Refresh tasks for the new month
  }

  getMonthYearString(): string {
    return this.currentMonth.toLocaleString("default", { month: "long", year: "numeric" })
  }

  getTasksForDayAndTimeSlot(day: CalendarDay, timeSlot: TimeSlot): CalendarTask[] {
    const dateKey = this.dateService.getDateKey(day.date);
    const dayTasks = this.calendarTasks[dateKey] || [];
    
    // STRICT filtering - must match exact time slot label
    return dayTasks.filter(task => 
      task.timeSlot === timeSlot.label
    );
  }

  getCategoryColorClass(color: string): string {
    switch (color.toLowerCase()) {
      case "blue":
        return "border-blue-400 bg-blue-50"
      case "green":
        return "border-green-400 bg-green-50"
      case "purple":
        return "border-purple-400 bg-purple-50"
      case "orange":
        return "border-orange-400 bg-orange-50"
      case "red":
        return "border-red-400 bg-red-50"
      case "yellow":
        return "border-yellow-400 bg-yellow-50"
      default:
        return "border-gray-400 bg-gray-50"
    }
  }
  getDaysForColumn(startIndex: number): any[] {
    const result: any[] = [];
    for (let i = startIndex; i < this.calendarDays.length; i += 7) {
      result.push(this.calendarDays[i]);
    }
    return result;
  }
  getHeaderDays(): { weekDay: string; dayOfMonth: number; isCurrentMonth: boolean }[] {
    // Get the first 7 days of the calendar (which represent the first week)
    const firstWeekDays = this.calendarDays.slice(0, 7);
    
    return firstWeekDays.map(day => ({
      weekDay: this.weekDays[day.date.getDay() === 0 ? 6 : day.date.getDay() - 1], // Adjust for Sunday
      dayOfMonth: day.dayOfMonth,
      isCurrentMonth: day.isCurrentMonth
    }));
  }
  // Add this property to your component
visibleDays: CalendarDay[] = [];

// Update your generateCalendar method to set visibleDays
// Add these methods to your component
today(): void {
  this.currentMonth = new Date();
  this.generateCalendar();
  this.mapTasksToCalendar();
}

isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
}

// Update your generateCalendar method to include days from previous/next months
generateCalendar(): void {
  this.calendarDays = [];
  this.visibleDays = [];

  const year = this.currentMonth.getFullYear();
  const month = this.currentMonth.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get the first day of the week (Monday)
  const startDay = new Date(firstDay);
  while (startDay.getDay() !== 1) {
    startDay.setDate(startDay.getDate() - 1);
  }

  // Get the last day of the week (Sunday)
  const endDay = new Date(lastDay);
  while (endDay.getDay() !== 0) {
    endDay.setDate(endDay.getDate() + 1);
  }

  // Generate all days to show
  const currentDate = new Date(startDay);
  while (currentDate <= endDay) {
    this.visibleDays.push({
      date: new Date(currentDate),
      dayOfMonth: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === month,
      tasks: []
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  this.updateCalendarWithTasks();
}
getRandomColor(): string {
  const colors = ['#6366F1', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
  return colors[Math.floor(Math.random() * colors.length)];
}

getRandomPastelColor(): string {
  return `hsl(${Math.floor(Math.random() * 360)}, 100%, 95%)`;
}
  
}
