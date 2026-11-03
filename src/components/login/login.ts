import { Component, inject } from '@angular/core';
import { AuthService } from '../../app/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  login() {
    this.authService.login();
    this.router.navigate(['/admin']);

  }
}
