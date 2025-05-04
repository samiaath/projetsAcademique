import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/Etudiant/layout/layout.component';
import { Layout2Component} from './pages/Enseignant/layout2/layout2.component';
import { HomeComponent } from './pages/Etudiant/home/home.component';
import { Notifications2Component } from './pages/Enseignant/notifications2/notifications2.component';
import { GroupListComponent } from './pages/Enseignant/group-list/group-list.component';
import { ProjectDetailsComponent } from "./pages/Enseignant/project-details/project-details.component"
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
    path: 'Etudiant/layout',
    loadComponent: () => import('./pages/Etudiant/layout/layout.component').then(m => m.LayoutComponent)
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
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/Etudiant/projects/projects.component').then(
            (m) => m.ProjectsComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/Etudiant/calendar/calendar.component').then(
            (m) => m.CalendarComponent
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/Etudiant/notifications/notifications.component').then(
            (m) => m.NotificationsComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/Etudiant/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },


  {
    path: 'layout2', 
    component: Layout2Component,
    children: [
      { path: 'home', component: Home2Component }, // Using groups as home for now
      { path: 'group-list', component: GroupListComponent },
      { path: "project-details/:groupId/:projectId", component: ProjectDetailsComponent },
      { path: 'notifications', component: Notifications2Component }, // Placeholder
      { path: 'archive', component: ArchiveComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];











