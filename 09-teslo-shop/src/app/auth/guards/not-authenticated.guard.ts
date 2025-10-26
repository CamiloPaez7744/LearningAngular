import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('NotAuthenticatedGuard - Iniciando verificación');
  const router = inject(Router);
  const authService = inject(AuthService);

  try {
    const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());
    console.log('NotAuthenticatedGuard - Usuario autenticado:', isAuthenticated);

    if (isAuthenticated) {
      console.log('NotAuthenticatedGuard - Redirigiendo a home');
      router.navigateByUrl('/');
      return false;
    }

    console.log('NotAuthenticatedGuard - Permitiendo acceso a auth');
    return true;
  } catch (error) {
    console.error('NotAuthenticatedGuard - Error:', error);
    return true;
  }
}
