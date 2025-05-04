import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Group } from '../group.model'; 
import { HttpClient } from '@angular/common/http';





@Injectable({
  providedIn: 'root'
})


export class GroupsManagementService {
  private apiUrl = "http://localhost:8088/api/v1"

  private groups: Group[] = [ ];
  constructor(private http: HttpClient) {}

  getGroups(): Observable<Group[]> {
    // In a real app, we would fetch from the API
     return this.http.get<Group[]>(`${this.apiUrl}/groups/all`);
   
  }

  getGroupById(id: number): Observable<Group | undefined> {
    // In a real app, we would fetch from the API
    // return this.http.get<Group>(`${this.apiUrl}/groups/${id}`);
    const group = this.groups.find((g) => g.id === id)
    return of(group)
  }

  createGroup(group: {
    name: string
    sector: string
    universityYear: string
    pendingStudentEmails: string[]
  }): Observable<Group> {
    // In a real app, we would post to the API
    return this.http.post<Group>(`${this.apiUrl}/groups/create`, group)
    
    // For testing without API
    // const newGroup: Group = {
    //   ...group,
    //   id: this.getNextId(),
    //   students: group.pendingStudentEmails.length,
    //   createdAt: new Date().toISOString().split("T")[0],
    // }
    // this.groups.unshift(newGroup)
    // return of(newGroup)
  }

  updateGroup(id: number, group: Partial<Group>): Observable<Group | undefined> {
    // In a real app, we would put to the API
    // return this.http.put<Group>(`${this.apiUrl}/groups/${id}`, group);

    const index = this.groups.findIndex((g) => g.id === id)
    if (index === -1) return of(undefined)

    this.groups[index] = { ...this.groups[index], ...group }
    return of(this.groups[index])
  }

  deleteGroup(id: number): Observable<boolean> {
    // In a real app, we would delete from the API
    // return this.http.delete<boolean>(`${this.apiUrl}/groups/${id}`);

    const initialLength = this.groups.length
    this.groups = this.groups.filter((g) => g.id !== id)
    return of(initialLength !== this.groups.length)
  }

  private getNextId(): number {
    return Math.max(...this.groups.map((g) => g.id), 0) + 1
  }
}
