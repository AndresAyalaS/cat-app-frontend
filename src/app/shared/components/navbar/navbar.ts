import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  username: string = '';
  isAuthenticated: boolean = false;
  isMenuOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const user = localStorage.getItem('user');
    const isAuth = localStorage.getItem('isAuthenticated');

    if (user && isAuth === 'true') {
      try {
        const userData = JSON.parse(user);
        this.username = userData.fullName || 'Usuario';
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.isAuthenticated = false;
      }
    } else {
      this.isAuthenticated = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');

    this.isAuthenticated = false;
    this.username = '';
    this.isMenuOpen = false;

    this.router.navigate(['/login']).catch((err) => {
      console.error('Navigation error on logout:', err);
    });
  }

  navigateToBreeds(): void {
    this.router.navigate(['/breeds']).catch((err) => {
      console.error('Navigation error:', err);
    });
  }

  navigateToTable(): void {
    this.router.navigate(['/cats/table']).catch((err) => {
      console.error('Navigation error:', err);
    });
  }
}
