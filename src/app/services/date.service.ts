import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class DateService {
  constructor() {}

  /**
   * Parse a date string in DD/MM/YYYY format
   */
  parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // Try DD/MM/YYYY format first
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) return date;
    }
  }

  // Try YYYY-MM-DD format (from ProjectService)
  if (dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) return date;
    }
  }

  // Fallback to native Date parsing
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date : null;
}

  /**
   * Format a date to DD/MM/YYYY
   */
  formatDate(date: Date): string {
    if (!date) return ""

    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  /**
   * Get a date key in YYYY-MM-DD format for consistent object keys
   */
  getDateKey(date: Date): string {
    if (!date) return ""

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  /**
   * Determine which time slot a task should go in based on task properties
   */
  assignTimeSlot(task: any, timeSlots: any[]): string {
    // This is a simple distribution algorithm
    // You could implement more complex logic based on task duration, priority, etc.
    const taskId = typeof task.id === "number" ? task.id : Number.parseInt(task.id, 10)
    const slotIndex = taskId % timeSlots.length
    return timeSlots[slotIndex].label
  }
 
}
