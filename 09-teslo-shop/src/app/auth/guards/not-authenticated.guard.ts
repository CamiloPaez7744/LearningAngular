import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('NotAuthenticatedGuard');
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());
  console.log({ isAuthenticated });
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
}
