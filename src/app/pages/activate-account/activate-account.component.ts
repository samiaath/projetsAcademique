import { Component } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule], 
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss'],

})
export class ActivateAccountComponent {
  token: string = '';
  message: string = '';
  error: string = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  activate(): void {
    this.registerService.activateAccount(this.token).subscribe({
      next: () => {
        this.message = 'Account successfully activated!';
        this.error = '';
        // Redirect to login or home after a delay
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = 'Invalid or expired token. Please try again.';
        this.message = '';
      }
    });
  }
}
