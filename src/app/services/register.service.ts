import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
  role: string;
  // Add any other fields returned by your backend
}

export interface CurrentUserDto {
  id: number | null;
  name: string;
  email: string;
  password: string | null;
  roleIds: number[] | null;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  private setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }

  private baseUrl = 'http://localhost:8088/api/v1/auth';

  constructor(private http: HttpClient) {}
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  register(data: RegistrationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  activateAccount(token: string): Observable<void> {
    const params = new HttpParams().set('token', token);
    return this.http.get<void>(`${this.baseUrl}/activate-account`, { params });
  }

  authenticate(data: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, data);
  }

 
  
  getMe(): Observable<CurrentUserDto> {
    return this.http.get<CurrentUserDto>(`http://localhost:8088/api/v1/users/me`);
  }

  


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  
  getCurrentUser(): Observable<any> {
    return this.currentUser$;
  }




}

