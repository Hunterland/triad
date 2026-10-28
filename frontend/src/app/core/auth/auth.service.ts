import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environments';
import { AuthUser, LoginResponse, UserRole } from '../models/user.model';

const TOKEN_KEY = 'triad.accessToken';
const USER_KEY = 'triad.user';

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser || storedUser === 'undefined') {
    if (storedUser === 'undefined') {
      localStorage.removeItem(USER_KEY);
    }

    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  private readonly user = signal<AuthUser | null>(getStoredUser());

  readonly isAuthenticated = computed(() => !!this.token());
  readonly currentUser = computed(() => this.user());
  readonly roles = computed<UserRole[]>(() => this.user()?.roles ?? []);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(TOKEN_KEY, response.accessToken);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));

          this.token.set(response.accessToken);
          this.user.set(response.user);
        }),
      );
  }

  hasRole(...roles: UserRole[]): boolean {
    return roles.some((role) => this.roles().includes(role));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    this.token.set(null);
    this.user.set(null);

    this.router.navigate(['/login']);
  }
}
