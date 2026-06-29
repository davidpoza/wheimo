import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, EMPTY } from 'rxjs';
import { User, AuthTokens } from '../models/user.model';
import { environment } from '@env/environment';

const TOKEN_KEY = 'accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  readonly currentUser = signal<User | null>(null);
  readonly accessToken = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    const stored = localStorage.getItem(TOKEN_KEY);
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
        localStorage.setItem(TOKEN_KEY, res.accessToken);
      }),
    );
  }

  refresh() {
    return this.http.post<Pick<AuthTokens, 'accessToken'>>(`${this.baseUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap((res) => {
        this.accessToken.set(res.accessToken);
        localStorage.setItem(TOKEN_KEY, res.accessToken);
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

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(
      `${environment.apiUrl}/users/me/password`,
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${this.accessToken()}` } },
    );
  }

  private loadCurrentUser() {
    this.http.get<User>(`${environment.apiUrl}/users/me`).subscribe({
      next: (user) => this.currentUser.set(user),
    });
  }

  private clearSession() {
    this.currentUser.set(null);
    this.accessToken.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }
}
