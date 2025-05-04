import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout2',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout2.component.html',
  styleUrl: './layout2.component.scss'
})
export class Layout2Component implements OnInit {
  activeRoute: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // Surveiller les changements de route pour mettre à jour activeRoute
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Extraire le segment principal de la route (/layout2/notifications -> notifications)
      const urlSegments = event.url.split('/');
      this.activeRoute = urlSegments[2] || 'home';
      console.log('Active route:', this.activeRoute);
    });

    // Définir la route active initiale
    const urlSegments = this.router.url.split('/');
    this.activeRoute = urlSegments[2] || 'home';
  }

  // Vérifier si une route est active
  isActive(route: string): boolean {
    return this.router.url === route;
  }
  logout() {
    // Clear user session (example with localStorage)
    localStorage.clear();

    // Redirect to login
    this.router.navigate(['/login']);
  }
}
