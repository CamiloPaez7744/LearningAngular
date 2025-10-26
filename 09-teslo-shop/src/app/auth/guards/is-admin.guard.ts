import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('IsAdminGuard - Iniciando verificación');
  const router = inject(Router);
  const authService = inject(AuthService);

  try {
    const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());

    if (!isAuthenticated) {
      console.log('IsAdminGuard - Usuario no autenticado, redirigiendo a login');
      router.navigateByUrl('/auth/login');
      return false;
    }

    const isAdmin = authService.isAdmin();
    console.log('IsAdminGuard - Usuario es admin:', isAdmin);

    if (!isAdmin) {
      console.log('IsAdminGuard - Usuario no es admin, redirigiendo a home');
      router.navigateByUrl('/');
      return false;
    }

    return true;
  } catch (error) {
    console.error('IsAdminGuard - Error:', error);
    router.navigateByUrl('/auth/login');
    return false;
  }
}
