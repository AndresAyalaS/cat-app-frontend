import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        Register,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
  });

  it('should toggle confirm password visibility', () => {
    expect(component.showConfirmPassword).toBeFalse();
    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword).toBeTrue();
  });

  it('should navigate to login page', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(
      Promise.resolve(true)
    );
    component.goToLogin();
    tick();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('should show error if fields are empty', () => {
    component.onRegister();
    expect(component.errorMessage).toBe('Todos los campos son obligatorios.');
  });

  it('should show error for invalid email format', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'invalidemail';
    component.password = '1234';
    component.confirmPassword = '1234';

    component.onRegister();
    expect(component.errorMessage).toBe('El email no tiene un formato válido.');
  });

  it('should show error for short password', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '123';
    component.confirmPassword = '123';

    component.onRegister();
    expect(component.errorMessage).toBe(
      'La contraseña debe tener al menos 4 caracteres.'
    );
  });

  it('should show error if passwords do not match', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '1234';
    component.confirmPassword = '4321';

    component.onRegister();
    expect(component.errorMessage).toBe('Las contraseñas no coinciden.');
  });

  it('should register successfully and navigate to login', fakeAsync(() => {
    const responseMock = {
      message: 'Usuario registrado exitosamente',
      user: { id: '123', name: 'Test User' },
    };

    authServiceSpy.register.and.returnValue(of(responseMock));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(
      Promise.resolve(true)
    );

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    component.onRegister();

    expect(component.isLoading).toBeTrue();
    tick();
    expect(component.isLoading).toBeFalse();
    expect(component.successMessage).toBe(
      'Registro exitoso. Redirigiendo al login...'
    );
    expect(authServiceSpy.register).toHaveBeenCalled();

    // Simular el setTimeout de 2000 ms
    tick(2000);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('should handle 400 error', fakeAsync(() => {
    const errorResponse = { status: 400 };

    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    component.onRegister();
    tick();
    expect(component.errorMessage).toBe(
      'Datos inválidos. Verifica la información ingresada.'
    );
  }));

  it('should handle 409 error', fakeAsync(() => {
    const errorResponse = { status: 409 };

    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    component.onRegister();
    tick();
    expect(component.errorMessage).toBe(
      'El correo ya está en uso. Prueba con otro.'
    );
  }));

  it('should handle 429 error', fakeAsync(() => {
    const errorResponse = { status: 429 };

    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    component.onRegister();
    tick();
    expect(component.errorMessage).toBe(
      'Demasiados intentos. Intenta de nuevo en unos minutos.'
    );
  }));

  it('should handle 0 error', fakeAsync(() => {
    const errorResponse = { status: 0 };

    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    component.onRegister();
    tick();
    expect(component.errorMessage).toBe(
      'Error de conexión. Verifica tu internet.'
    );
  }));

  it('should handle generic error with message', fakeAsync(() => {
    const errorResponse = {
      status: 500,
      error: { message: 'Custom error message' },
    };

    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    component.onRegister();
    tick();
    expect(component.errorMessage).toBe('Custom error message');
  }));

  it('should handle generic error without message', fakeAsync(() => {
    const errorResponse = { status: 500 };

    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'test@mail.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    component.onRegister();
    tick();
    expect(component.errorMessage).toBe(
      'Error del servidor. Intenta de nuevo más tarde.'
    );
  }));
});
