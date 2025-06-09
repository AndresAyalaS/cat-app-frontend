import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        Login,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
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

  it('should navigate to register page', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(
      Promise.resolve(true)
    );
    component.goToRegister();
    tick();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/register']);
  }));

  it('should show error if fields are empty', () => {
    component.email = '';
    component.password = '';
    component.onLogin();
    expect(component.errorMessage).toBe('Todos los campos son obligatorios.');
  });

  it('should show error for invalid email format', () => {
    component.email = 'invalidemail';
    component.password = '1234';
    component.onLogin();
    expect(component.errorMessage).toBe(
      'Ingresa un correo electrónico válido.'
    );
  });

  it('should show error for short password', () => {
    component.email = 'test@mail.com';
    component.password = '123';
    component.onLogin();
    expect(component.errorMessage).toBe(
      'La contraseña debe tener al menos 4 caracteres.'
    );
  });

  it('should login successfully and navigate to cats/table', fakeAsync(() => {
    const responseMock = {
      message: 'Login exitoso',
      user: { id: '123', name: 'Test User' },
      token: 'abc123',
    };

    authServiceSpy.login.and.returnValue(of(responseMock));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(
      Promise.resolve(true)
    );

    component.email = 'test@mail.com';
    component.password = '1234';
    component.onLogin();

    expect(component.isLoading).toBeTrue();
    tick(); // simulate async
    expect(component.isLoading).toBeFalse();
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(localStorage.getItem('user')).toBe(
      JSON.stringify(responseMock.user)
    );
    expect(localStorage.getItem('isAuthenticated')).toBe('true');
    expect(navigateSpy).toHaveBeenCalledWith(['/cats/table']);
  }));

  it('should handle login error 401', fakeAsync(() => {
    const errorResponse = { status: 401 };

    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.email = 'test@mail.com';
    component.password = 'wrongpass';
    component.onLogin();

    tick();
    expect(component.errorMessage).toBe(
      'Credenciales inválidas. Verifica tu usuario y contraseña.'
    );
    expect(component.password).toBe('');
    expect(component.showPassword).toBeFalse();
  }));

  it('should handle login error 429', fakeAsync(() => {
    const errorResponse = { status: 429 };

    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.email = 'test@mail.com';
    component.password = 'wrongpass';
    component.onLogin();

    tick();
    expect(component.errorMessage).toBe(
      'Demasiados intentos. Intenta de nuevo en unos minutos.'
    );
  }));

  it('should handle login error 0', fakeAsync(() => {
    const errorResponse = { status: 0 };

    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.email = 'test@mail.com';
    component.password = 'wrongpass';
    component.onLogin();

    tick();
    expect(component.errorMessage).toBe(
      'Error de conexión. Verifica tu conexión a internet.'
    );
  }));

  it('should handle generic login error', fakeAsync(() => {
    const errorResponse = { status: 500 };

    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.email = 'test@mail.com';
    component.password = 'wrongpass';
    component.onLogin();

    tick();
    expect(component.errorMessage).toBe(
      'Error del servidor. Intenta de nuevo más tarde.'
    );
  }));
});
