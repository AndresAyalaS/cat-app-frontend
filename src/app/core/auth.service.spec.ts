import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { CatService } from './cat.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const dummyTokenResponse = { token: 'mock-token' };

  const loginCredentials = {
    email: 'test@example.com',
    password: '123456',
  };

  const registerData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: '123456',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CatService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

    it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    service.login(loginCredentials).subscribe((response) => {
      expect(response.token).toBe('mock-token');
      expect(localStorage.getItem('token')).toBe('mock-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginCredentials);
    req.flush(dummyTokenResponse);
  });

  it('should register and store token', () => {
    service.register(registerData).subscribe((response) => {
      expect(response.token).toBe('mock-token');
      expect(localStorage.getItem('token')).toBe('mock-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush(dummyTokenResponse);
  });

  it('should remove token on logout', () => {
    localStorage.setItem('token', 'mock-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should return true if authenticated', () => {
    localStorage.setItem('token', 'mock-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if not authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return the token if exists', () => {
    localStorage.setItem('token', 'mock-token');
    expect(service.getToken()).toBe('mock-token');
  });

  it('should return null if no token exists', () => {
    expect(service.getToken()).toBeNull();
  });
});
