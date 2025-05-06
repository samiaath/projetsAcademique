import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = '';

  constructor(private router: Router) {}

  onRegister() {
    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };
    // Enregistre l'utilisateur dans localStorage (tu peux gérer ça en liste plus tard)
    localStorage.setItem('user', JSON.stringify(newUser));
    alert('Registered successfully!');
    this.router.navigate(['/login']);
  }
}