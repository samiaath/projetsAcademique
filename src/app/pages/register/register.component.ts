import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService, RegistrationRequest } from '../../services/register.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [RegisterService, ],
})
export class RegisterComponent {
  formData: RegistrationRequest = {
    name: '',
    email: '',
    password: '',
    role: '',
  };

  constructor(private registerService: RegisterService, private router: Router) {}

  onSubmit() {
    this.registerService.register(this.formData).subscribe({
      next: () => {
        alert('Account created! Please check your email to activate your account.');
        this.router.navigate(['/activate-account']);
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed.');
      },
    });
  }
}
  

