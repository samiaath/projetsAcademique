import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RegisterService, CurrentUserDto } from '../../services/register.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  name  = '';
  email = '';

  constructor(
    private router: Router,
    private userService: RegisterService     // ← on injecte UserService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user: CurrentUserDto) => {
        this.name  = user.name;
        this.email = user.email;
      },
      error: () => {
        // au cas où le token serait expiré on redirige vers /login
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
