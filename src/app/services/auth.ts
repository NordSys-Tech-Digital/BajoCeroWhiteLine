import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http     = inject(HttpClient);
  private _loggedIn = signal(false);
  readonly loggedIn = this._loggedIn.asReadonly();

  login(user: string, password: string) {
    return this.http
      .post<{ token?: string; tsec?: string; access_token?: string }>(
        `${environment.apiUrl}/login`,
        { user, password }
      )
      .pipe(
        tap(res => {
          const token = res.token ?? res.tsec ?? res.access_token ?? null;
          if (token) {
            sessionStorage.setItem('admin_token', token);
            this._loggedIn.set(true);
          }
        }),
        catchError(() => of(null))
      );
  }

  logout() {
    sessionStorage.removeItem('admin_token');
    this._loggedIn.set(false);
  }

  checkSession() {
    if (sessionStorage.getItem('admin_token')) {
      this._loggedIn.set(true);
    }
  }
}
