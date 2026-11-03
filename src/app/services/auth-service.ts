import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authenticated = signal(false);

  readonly isAuthenticated = this.authenticated.asReadonly();

  login() {
    this.authenticated.set(true);
  }

  logout() {
    this.authenticated.set(false);
  }
}
