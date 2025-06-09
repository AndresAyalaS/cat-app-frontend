import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
 // Verificar si el usuario está autenticado
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  // También verificar si existe información del usuario (doble verificación)
  const user = localStorage.getItem('user');

  if (isAuthenticated && user) {
    return true;
  } else {
    // Limpiar localStorage si hay datos inconsistentes
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');

    router.navigate(['/auth/login']);
    return false;
  }
};
