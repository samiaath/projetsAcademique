import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';


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
    path: 'layout',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects.component').then(
            (m) => m.ProjectsComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/calendar/calendar.component').then(
            (m) => m.CalendarComponent
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/notifications.component').then(
            (m) => m.NotificationsComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
