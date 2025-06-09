import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatService, Breed, BreedImage } from '../../../core/cat.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-breed-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './breed-selector.html',
  styleUrl: './breed-selector.css',
})
export class BreedSelector implements OnInit {
  breeds: Breed[] = [];
  selectedBreedId: string = '';
  breedInfo: Breed | null = null;
  breedImages: BreedImage[] = [];
  isLoadingBreeds: boolean = false;
  isLoadingBreedInfo: boolean = false;
  isLoadingImages: boolean = false;
  error: string = '';

  constructor(private catService: CatService) {}

  ngOnInit(): void {
    this.loadBreeds();
  }

  loadBreeds(): void {
    this.isLoadingBreeds = true;
    this.error = '';

    this.catService.getBreeds().subscribe({
      next: (data: Breed[]) => {
        this.breeds = data;
        this.isLoadingBreeds = false;
      },
      error: (error) => {
        console.error('Error loading breeds:', error);
        this.error = 'Error al cargar las razas de gatos';
        this.isLoadingBreeds = false;
      },
    });
  }

  onSelectBreed(): void {
    if (!this.selectedBreedId) {
      this.breedInfo = null;
      this.breedImages = [];
      return;
    }

    this.loadBreedInfo();
  }

  private loadBreedInfo(): void {
    this.isLoadingBreedInfo = true;

    this.catService.getBreedById(this.selectedBreedId).subscribe({
      next: (data: Breed) => {
        this.breedInfo = data;
        this.isLoadingBreedInfo = false;

        // Cuando cargue la info de la raza, llamo a las imágenes
        if (this.breedInfo.reference_image_id) {
          this.loadBreedImages(this.breedInfo.reference_image_id);
        } else {
          console.warn('No hay reference_image_id disponible para esta raza');
        }
      },
      error: (error) => {
        console.error('Error loading breed info:', error);
        this.error = 'Error al cargar la información de la raza';
        this.isLoadingBreedInfo = false;
      },
    });
  }

  private loadBreedImages(referenceImageId: string): void {
    this.isLoadingImages = true;

    this.catService.getBreedsByImageId(referenceImageId).subscribe({
      next: (data: any) => {
        console.log('Respuesta de loadBreedImages:', data);

        this.breedImages = [data];

        this.isLoadingImages = false;
      },
      error: (error) => {
        console.error('Error loading breed images:', error);
        this.error = 'Error al cargar las imágenes asociadas a la raza';
        this.isLoadingImages = false;
      },
    });
  }

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    const container = img.parentElement;

    if (container) {
      container.classList.remove('loading');

      const aspectRatio = img.naturalWidth / img.naturalHeight;

      if (aspectRatio > 1.5) {
        img.setAttribute('data-aspect', 'wide');
      } else if (aspectRatio < 0.75) {
        img.setAttribute('data-aspect', 'tall');
      }
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const container = img.parentElement;

    if (container) {
      container.classList.remove('loading');

      const placeholder = document.createElement('div');
      placeholder.className =
        'flex flex-col items-center justify-center w-full h-full text-gray-400';
      placeholder.innerHTML = `
      <svg class="w-16 h-16 mb-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
      </svg>
      <p class="text-sm">Imagen no disponible</p>
    `;

      if (img.parentNode) {
        img.parentNode.replaceChild(placeholder, img);
      }
    }
  }

  preloadImages(): void {
    this.breedImages.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Imagen ${index + 1} cargada exitosamente`);
      };
      img.onerror = () => {
        console.warn(`Error cargando imagen ${index + 1}:`, image.url);
      };
      img.src = image.url;
    });
  }
}
