import { Injectable, signal } from '@angular/core';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'cryotech2025';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedIn = signal(false);
  readonly loggedIn = this._loggedIn.asReadonly();

  login(user: string, pass: string): boolean {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      this._loggedIn.set(true);
      sessionStorage.setItem('admin_auth', '1');
      return true;
    }
    return false;
  }

  logout() {
    this._loggedIn.set(false);
    sessionStorage.removeItem('admin_auth');
  }

  checkSession() {
    if (sessionStorage.getItem('admin_auth')) this._loggedIn.set(true);
  }
}
