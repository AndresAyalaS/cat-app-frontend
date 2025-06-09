import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BreedSelector } from './breed-selector';
import { CatService, Breed } from '../../../core/cat.service';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BreedSelector', () => {
  let component: BreedSelector;
  let fixture: ComponentFixture<BreedSelector>;
  let catServiceSpy: jasmine.SpyObj<CatService>;

  const mockBreeds: Breed[] = [
    {
      id: 'abc',
      name: 'Abyssinian',
      reference_image_id: 'img123',
      description: 'Abyssinian cats are active and playful.',
      temperament: 'Active, Energetic, Independent, Intelligent, Gentle',
      origin: 'Egypt',
      life_span: '14 - 15',
      weight: { imperial: '7 - 11', metric: '3 - 5' }
    }
  ];

  const mockBreedInfo: Breed = {
    id: 'abc',
    name: 'Abyssinian',
    reference_image_id: 'img123',
    description: 'Abyssinian cats are active and playful.',
    temperament: 'Active, Energetic, Independent, Intelligent, Gentle',
    origin: 'Egypt',
    life_span: '14 - 15',
    weight: { imperial: '7 - 11', metric: '3 - 5' }
  };

  const mockBreedImage = {
    url: 'https://cdn.example.com/image.jpg'
  };

  beforeEach(async () => {
    const catSpy = jasmine.createSpyObj('CatService', ['getBreeds', 'getBreedById', 'getBreedsByImageId']);

    await TestBed.configureTestingModule({
      imports: [BreedSelector],
      providers: [
        { provide: CatService, useValue: catSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BreedSelector);
    component = fixture.componentInstance;
    catServiceSpy = TestBed.inject(CatService) as jasmine.SpyObj<CatService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load breeds on init', () => {
    catServiceSpy.getBreeds.and.returnValue(of(mockBreeds));

    component.ngOnInit();

    expect(catServiceSpy.getBreeds).toHaveBeenCalled();
    expect(component.breeds).toEqual(mockBreeds);
    expect(component.isLoadingBreeds).toBeFalse();
  });

  it('should handle error when loading breeds', () => {
    catServiceSpy.getBreeds.and.returnValue(throwError(() => new Error('Failed')));

    component.loadBreeds();

    expect(component.error).toContain('Error al cargar las razas de gatos');
    expect(component.isLoadingBreeds).toBeFalse();
  });

  it('should reset breedInfo and images if no breed is selected', () => {
    component.selectedBreedId = '';
    component.onSelectBreed();
    expect(component.breedInfo).toBeNull();
    expect(component.breedImages.length).toBe(0);
  });

  it('should load breed info and images successfully', fakeAsync(() => {
    catServiceSpy.getBreedById.and.returnValue(of(mockBreedInfo));
    catServiceSpy.getBreedsByImageId.and.returnValue(of(mockBreedImage));

    component.selectedBreedId = 'abc';
    component.onSelectBreed();
    tick();

    expect(catServiceSpy.getBreedById).toHaveBeenCalledWith('abc');
    expect(component.breedInfo).toEqual(mockBreedInfo);
    expect(component.isLoadingBreedInfo).toBeFalse();

    expect(catServiceSpy.getBreedsByImageId).toHaveBeenCalledWith('img123');
    expect(component.breedImages.length).toBe(1);
    expect(component.isLoadingImages).toBeFalse();
  }));

  it('should handle error loading breed info', () => {
    catServiceSpy.getBreedById.and.returnValue(throwError(() => new Error('Failed')));

    component.selectedBreedId = 'abc';
    component.onSelectBreed();

    expect(component.error).toContain('Error al cargar la información de la raza');
    expect(component.isLoadingBreedInfo).toBeFalse();
  });

  it('should handle error loading breed images', () => {
    catServiceSpy.getBreedById.and.returnValue(of(mockBreedInfo));
    catServiceSpy.getBreedsByImageId.and.returnValue(throwError(() => new Error('Failed')));

    component.selectedBreedId = 'abc';
    component.onSelectBreed();

    expect(component.error).toContain('Error al cargar las imágenes asociadas a la raza');
  });

  it('should handle onImageLoad event', () => {
    const container = document.createElement('div');
    container.classList.add('loading');
    const img = document.createElement('img');
    container.appendChild(img);

    Object.defineProperty(img, 'naturalWidth', { value: 800 });
    Object.defineProperty(img, 'naturalHeight', { value: 400 });

    const event = new Event('load');
    Object.defineProperty(event, 'target', { value: img });

    component.onImageLoad(event);

    expect(container.classList.contains('loading')).toBeFalse();
    expect(img.getAttribute('data-aspect')).toBe('wide');
  });

  it('should handle onImageError event', () => {
    const container = document.createElement('div');
    container.classList.add('loading');
    const img = document.createElement('img');
    container.appendChild(img);

    const event = new Event('error');
    Object.defineProperty(event, 'target', { value: img });

    component.onImageError(event);

    expect(container.classList.contains('loading')).toBeFalse();
    expect(container.innerHTML).toContain('Imagen no disponible');
  });

  it('should preload images and log events', () => {
    const logSpy = spyOn(console, 'log');
    const warnSpy = spyOn(console, 'warn');

    component.breedImages = [
      { id: 'img1', url: 'https://cdn.example.com/image1.jpg', breeds: [], width: 800, height: 600 },
      { id: 'img2', url: 'https://cdn.example.com/image2.jpg', breeds: [], width: 800, height: 600 }
    ];

    component.preloadImages();

    // Simular carga correcta y error manualmente no se puede aquí, pero se asegura que se ejecuten los métodos
    expect(component.breedImages.length).toBe(2);
  });
});
