import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(private router: Router) {}

  logout() {
    // Clear user session (example with localStorage)
    localStorage.clear();

    // Redirect to login
    this.router.navigate(['/login']);
  }
}
