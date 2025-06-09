import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  onLogin(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Ingresa un correo electrónico válido.';
      return;
    }

    if (this.password.length < 4) {
      this.errorMessage = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    this.isLoading = true;
    const credentials = {
      email: this.email.trim(),
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Verificar si el login fue exitoso
        if (
          response &&
          (response.message === 'Login exitoso' || response.user)
        ) {
          // Store user info FIRST
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('isAuthenticated', 'true');

          setTimeout(() => {
            this.router
              .navigate(['/cats/table'])
              .then((success) => {
                if (!success) {
                  console.error('Navigation failed');
                  this.errorMessage =
                    'Error de navegación. Intenta recargar la página.';
                }
              })
              .catch((err) => {
                console.error('Navigation error:', err);
                this.errorMessage =
                  'Error de navegación. Intenta recargar la página.';
              });
          }, 100);
        } else {
          this.errorMessage = 'Respuesta del servidor inválida.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);

        // Handle different error types
        if (error.status === 401) {
          this.errorMessage =
            'Credenciales inválidas. Verifica tu usuario y contraseña.';
        } else if (error.status === 429) {
          this.errorMessage =
            'Demasiados intentos. Intenta de nuevo en unos minutos.';
        } else if (error.status === 0) {
          this.errorMessage =
            'Error de conexión. Verifica tu conexión a internet.';
        } else {
          this.errorMessage = 'Error del servidor. Intenta de nuevo más tarde.';
        }

        this.password = '';
        this.showPassword = false;
      },
    });
  }
}
