import { Component, OnInit } from '@angular/core';
import { CatService } from '../../../core/cat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cat-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cat-table.html',
  styleUrl: './cat-table.css',
})
export class CatTable implements OnInit {
  breeds: any[] = [];
  filteredBreeds: any[] = [];
  isLoading = true;
  errorMessage = '';
  searchText = '';

  // paginación
  currentPage = 1;
  itemsPerPage = 5;

  Math = Math;

  constructor(private catService: CatService) {}

  ngOnInit(): void {
    this.loadBreeds();
  }

  loadBreeds(): void {
    this.catService.getBreeds().subscribe({
      next: (data) => {
        this.breeds = data;
        this.filteredBreeds = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error cargando las razas de gatos';
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  searchBreeds(): void {
    const query = this.searchText.toLowerCase().trim();
    this.filteredBreeds = this.breeds.filter((breed) =>
      breed.name.toLowerCase().includes(query)
    );
    this.currentPage = 1;
  }

  get paginatedBreeds() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBreeds.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  totalPages(): number {
    return Math.ceil(this.filteredBreeds.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  getVisiblePages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas con puntos suspensivos
      if (current <= 4) {
        // Mostrar las primeras páginas
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
      } else if (current >= total - 3) {
        // Mostrar las últimas páginas
        for (let i = total - 4; i <= total - 1; i++) {
          pages.push(i);
        }
      } else {
        // Mostrar páginas alrededor de la actual
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  }
}
