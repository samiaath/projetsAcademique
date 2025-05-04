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
    const storedUsers = localStorage.getItem('users');
    
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      
      // Cherche l'utilisateur avec email et mot de passe correspondants
      const user = users.find((u: any) => u.email === this.email && u.password === this.password);
      console.log(user);
      
     if (user.role === 'professor') {
          this.router.navigate(['/Enseignant/layout2']);
        
      } else if (user.role === 'student') {
        this.router.navigate(['/layout']);
      }else{
        alert('Incorrect email or password');
      }
    }
  
  }}