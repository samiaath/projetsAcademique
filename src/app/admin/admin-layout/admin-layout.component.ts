import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDto, RegisterService } from '../../services/register.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  name  = '';
    email = '';
  
    constructor(
      private router: Router,
      private userService: RegisterService     
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
