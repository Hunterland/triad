import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[] | undefined;

  if (!requiredRoles || auth.hasRole(...requiredRoles)) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
