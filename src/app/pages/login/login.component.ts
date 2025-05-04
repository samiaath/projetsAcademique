import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationRequest, RegisterService } from '../../services/register.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMessage: Array<string> = [];

  constructor(private router: Router, private registerService: RegisterService) {}

  onLogin() {
    this.errorMessage = [];
    this.registerService.authenticate(this.authRequest).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.token);
        console.log('Authentication successful:', response.token);

        interface DecodedToken {
          roles?: string[];
        }

        const decoded = jwtDecode<DecodedToken>(response.token);
        const roles = decoded.roles || [];

        if (roles.includes('ADMIN')) {
          window.location.href = 'https://www.youtube.com';
        } else if (roles.includes('student')) {
          this.router.navigate(['/layout/home']);
        } else if (roles.includes('professor')) {
          window.location.href = 'https://www.facebook.com';
        } else {
          // Default fallback
          this.router.navigate(['/layout/home']);
        }
      },
      error: (error) => {
        console.error('Authentication failed:', error);
        this.errorMessage.push('Invalid email or password! Please try again.');
      },
    });
  }
}
