import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, EMPTY } from 'rxjs';
import { User, AuthTokens } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  readonly currentUser = signal<User | null>(null);
  readonly accessToken = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    const stored = sessionStorage.getItem('accessToken');
    if (stored) {
      this.accessToken.set(stored);
      this.loadCurrentUser();
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthTokens>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap((res) => {
        this.accessToken.set(res.accessToken);
        this.currentUser.set(res.user);
        sessionStorage.setItem('accessToken', res.accessToken);
      }),
    );
  }

  refresh() {
    return this.http.post<Pick<AuthTokens, 'accessToken'>>(`${this.baseUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap((res) => {
        this.accessToken.set(res.accessToken);
        sessionStorage.setItem('accessToken', res.accessToken);
      }),
      catchError(() => {
        this.clearSession();
        this.router.navigate(['/login']);
        return EMPTY;
      }),
    );
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/login']);
      }),
    );
  }

  private loadCurrentUser() {
    this.http.get<User>(`${environment.apiUrl}/users/me`).subscribe({
      next: (user) => this.currentUser.set(user),
      error: () => this.clearSession(),
    });
  }

  private clearSession() {
    this.currentUser.set(null);
    this.accessToken.set(null);
    sessionStorage.removeItem('accessToken');
  }
}
