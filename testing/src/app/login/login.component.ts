import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthentService } from '../authent.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class LoginComponent {
  email = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthentService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.email && this.password) {
      this.errorMessage = '';

      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          console.log(response);
          if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.user));
            this.router.navigate(['/profil']);
            this.successMessage = 'Login successful!';
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage =
            error.error?.message || 'Login failed. Please try again.';
        },
      });
    } else {
      this.errorMessage = 'Please enter email and password.';
    }
  }
}
