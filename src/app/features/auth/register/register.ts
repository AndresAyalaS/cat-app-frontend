import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'El email no tiene un formato válido.';
      return;
    }

    if (this.password.length < 4) {
      this.errorMessage = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isLoading = true;

    const userData = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      password: this.password,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Register response:', response);

        // Verificar si el registro fue exitoso
        if (
          response &&
          (response.message === 'Usuario registrado exitosamente' ||
            response.user ||
            response.username)
        ) {
          this.successMessage = 'Registro exitoso. Redirigiendo al login...';

          // Limpiar formulario
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
          this.showPassword = false;
          this.showConfirmPassword = false;

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Respuesta del servidor inválida.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Register error:', error);

        if (error.status === 400) {
          this.errorMessage =
            'Datos inválidos. Verifica la información ingresada.';
        } else if (error.status === 409) {
          this.errorMessage = 'El correo ya está en uso. Prueba con otro.';
        } else if (error.status === 429) {
          this.errorMessage =
            'Demasiados intentos. Intenta de nuevo en unos minutos.';
        } else if (error.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica tu internet.';
        } else {
          this.errorMessage =
            error.error?.message ||
            'Error del servidor. Intenta de nuevo más tarde.';
        }

        this.password = '';
        this.confirmPassword = '';
        this.showPassword = false;
        this.showConfirmPassword = false;
      },
    });
  }
}
