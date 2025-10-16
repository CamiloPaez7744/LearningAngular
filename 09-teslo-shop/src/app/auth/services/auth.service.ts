import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@env/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const BASE_URL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() { }

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkAuthStatus(),
  })

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._token() && this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(
      `${BASE_URL}/auth/login`,
      { email, password }
    ).pipe(
      tap(resp => {
        this._user.set(resp.user);
        this._token.set(resp.token);
        this._authStatus.set('authenticated');

        localStorage.setItem('token', resp.token);
      }),
      map(() => true),
      catchError((error) => {
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        return of(false);
      })
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this._authStatus.set('not-authenticated');
      return of(false);
    }

    return this.http.get<AuthResponse>(`${BASE_URL}/auth/check-status`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(resp => {
        this._user.set(resp.user);
        this._token.set(resp.token);
        this._authStatus.set('authenticated');
      }),
      map(() => true),
      catchError(() => {
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        return of(false);
      })
    );
  }
}
