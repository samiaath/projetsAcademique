import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TeamProjectComponent } from './pages/team-projects/team-projects.component';
import { TeamProjectDetailsComponent } from './pages/team-project-details/team-project-details.component'; // Make sure this exists
import { VoteComponent } from './pages/vote/vote.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { GroupsManagementComponent } from './admin/groups-management/groups-management.component';
import { AdminManagementComponent } from './admin/admin-management/admin-management.component';
import { AdminProjectsComponent } from './admin/admin-projects/admin-projects.component';
import { ProfessorManagementComponent } from './admin/professor-management/professor-management.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'activate-account',
    loadComponent: () =>
      import('./pages/activate-account/activate-account.component').then(
        (m) => m.ActivateAccountComponent
      ),
  },
 

  
  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'teamProjects', component: TeamProjectComponent },
      { path: 'teamProject/:id', component: TeamProjectDetailsComponent }, 
      { path: 'project/:id', component: ProjectDetailsComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'notifications', component: NotificationsComponent },
      {
        path: 'project/:id/vote',
        component: VoteComponent
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  
  {
    path:'admin-layout',
    component: AdminLayoutComponent,
    children:[
      {path: 'admin-home', component:AdminHomeComponent },
      {path: "groups-management",component:GroupsManagementComponent},
      {path: "admin-projects",component:AdminProjectsComponent},
      {path: "admin-management",component:AdminManagementComponent},
      {path: "professor-management",component:ProfessorManagementComponent},


    ]
    
  }
  
];
