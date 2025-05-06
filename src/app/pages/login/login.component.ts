import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
  
      // Vérifie si les identifiants correspondent
      if (user.email === this.email && user.password === this.password) {
        if (user.role === 'professor') {
          this.router.navigate(['/Enseignant/layout2']);
        } else if (user.role === 'student') {
          this.router.navigate(['/layout']);
        } else {
          alert('Unknown role');
        }
      } else {
        alert('Incorrect email or password');
      }
    } else {
      alert('No user found. Please register.');
    }
  }
}