import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TeamProjectComponent } from './pages/team-projects/team-projects.component';
import { TeamProjectDetailsComponent } from './pages/team-project-details/team-project-details.component'; // Make sure this exists
import { VoteComponent } from './pages/vote/vote.component';
import { Layout2Component} from './pages/Enseignant/layout2/layout2.component';
import { Notifications2Component } from './pages/Enseignant/notifications2/notifications2.component';
import { GroupListComponent } from './pages/Enseignant/group-list/group-list.component';
import { ProjectDetailsEComponent } from "./pages/Enseignant/project-details-e/project-details-e.component"
import { ArchiveComponent } from './pages/Enseignant/archive/archive.component';
import { Home2Component } from './pages/Enseignant/home2/home2.component';

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
    path: 'Enseignant/layout2',
    loadComponent: () => import('./pages/Enseignant/layout2/layout2.component').then(m => m.Layout2Component)
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
    ],},
  {
    path: 'layout2', 
    component: Layout2Component,
    children: [
      { path: 'home2', component: Home2Component }, // Using groups as home for now
      { path: 'group-list', component: GroupListComponent },
      { path: "project-details-e/:groupId/:projectId", component: ProjectDetailsEComponent },
      { path: 'notifications', component: Notifications2Component }, // Placeholder
      { path: 'archive', component: ArchiveComponent },
      { path: '', redirectTo: 'home2', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];











