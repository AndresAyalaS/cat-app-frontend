import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta por defecto
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  // Rutas de autenticación
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.Login),
        title: 'Iniciar Sesión',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.Register),
        title: 'Registro',
      },
    ],
  },

  // Alias para mantener compatibilidad
  {
    path: 'login',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    redirectTo: '/auth/register',
    pathMatch: 'full',
  },

  {
    path: 'cats',
    loadComponent: () =>
      import('./shared/layouts/cats-layout/cats-layout').then(
        (m) => m.CatsLayout
      ),
    canActivate: [AuthGuard], // Proteger todas las rutas de cats
    children: [
      {
        path: 'breeds',
        loadComponent: () =>
          import('./features/cats/breed-selector/breed-selector').then(
            (m) => m.BreedSelector
          ),
        title: 'Explorador de Razas',
      },
      {
        path: 'table',
        loadComponent: () =>
          import('./features/cats/cat-table/cat-table').then((m) => m.CatTable),
        title: 'Tabla de Razas',
      },
    ],
  },

  {
    path: 'breeds',
    redirectTo: '/cats/breeds',
    pathMatch: 'full',
  },
  {
    path: 'table',
    redirectTo: '/cats/table',
    pathMatch: 'full',
  },

  {
    path: 'profile',
    redirectTo: '/user/profile',
    pathMatch: 'full',
  },
];
