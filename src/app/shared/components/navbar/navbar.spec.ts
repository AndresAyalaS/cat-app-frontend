import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { Router } from '@angular/router';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should check auth status and set username when user is authenticated', () => {
    localStorage.setItem('user', JSON.stringify({ fullName: 'John Doe' }));
    localStorage.setItem('isAuthenticated', 'true');

    component.checkAuthStatus();

    expect(component.isAuthenticated).toBeTrue();
    expect(component.username).toBe('John Doe');
  });

  it('should handle invalid user data gracefully', () => {
    localStorage.setItem('user', '{ invalid json');
    localStorage.setItem('isAuthenticated', 'true');

    component.checkAuthStatus();

    expect(component.isAuthenticated).toBeFalse();
  });

  it('should toggle mobile menu', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMobileMenu();
    expect(component.isMenuOpen).toBeTrue();
  });

  it('should logout correctly and navigate to login', () => {
    localStorage.setItem('user', 'dummy');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('token', 'token');

    component.logout();

    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('isAuthenticated')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(component.isAuthenticated).toBeFalse();
    expect(component.username).toBe('');
    expect(component.isMenuOpen).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to breeds', () => {
    component.navigateToBreeds();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/breeds']);
  });

  it('should navigate to cats table', () => {
    component.navigateToTable();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/cats/table']);
  });
});
