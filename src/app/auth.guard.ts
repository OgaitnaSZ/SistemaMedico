import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './core/services/login.service';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService);  // Inyecta el servicio de autenticación
  const router = inject(Router);  // Inyecta el enrutador

  if (!authService.isLoggedIn()) {
    // Si no está logueado, redirige al login
    router.navigate(['/login']);
    return false;
  }

  // Si está logueado, permite el acceso al componente
  return true;
};
