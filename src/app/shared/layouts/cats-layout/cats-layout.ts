import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-cats-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './cats-layout.html',
  styleUrl: './cats-layout.css'
})
export class CatsLayout {
 constructor() {}
}
