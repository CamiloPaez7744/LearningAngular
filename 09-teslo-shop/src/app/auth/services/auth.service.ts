import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@env/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const BASE_URL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this._token.set(token);
    } else {
      this._authStatus.set('not-authenticated');
    }
  }

  private http = inject(HttpClient);

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private checkStatusCache = new Map<string, Observable<boolean>>();

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());
  isAdmin = computed<boolean>(() => this._user()?.roles.includes('admin') || false);

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(
      `${BASE_URL}/auth/login`,
      { email, password }
    ).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  register(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http.post<AuthResponse>(
      `${BASE_URL}/auth/register`,
      { email, password, fullName }
    ).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  checkAuthStatus(): Observable<boolean> {
    const token = this._token();

    if (!token) {
      this._authStatus.set('not-authenticated');
      this._user.set(null);
      return of(false);
    }

    if (this._user() && this._authStatus() === 'authenticated') {
      return of(true);
    }

    const cacheKey = `token=${token}`;
    if (this.checkStatusCache.has(cacheKey)) {
      return this.checkStatusCache.get(cacheKey)!;
    }

    const checkStatus$ = this.http.get<AuthResponse>(`${BASE_URL}/auth/check-status`).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error) => this.handleAuthError(error)),
      tap(() => this.checkStatusCache.delete(cacheKey))
    );

    this.checkStatusCache.set(cacheKey, checkStatus$);
    return checkStatus$;
  }

  private handleAuthSuccess({ user, token }: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', token);
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
