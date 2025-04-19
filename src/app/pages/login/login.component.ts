import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.email === 'user@gmail.com' && this.password === 'user') {
      // Redirect to home page
      this.router.navigate(['/layout/home']);
    } else {
      alert('Invalid credentials! Please try again.');
    }
  }
}
