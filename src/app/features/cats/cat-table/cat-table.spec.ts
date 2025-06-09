import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatTable } from './cat-table';
import { of, throwError } from 'rxjs';
import { CatService } from '../../../core/cat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Breed } from '../../../core/cat.service';

describe('CatTable', () => {
  let component: CatTable;
  let fixture: ComponentFixture<CatTable>;
  let mockCatService: jasmine.SpyObj<CatService>;

  const mockBreeds: Breed[] = [
    { id: '1', name: 'Abyssinian', description: '', temperament: '', origin: '', life_span: '', weight: { metric: '', imperial: '' } },
    { id: '2', name: 'Bengal', description: '', temperament: '', origin: '', life_span: '', weight: { metric: '', imperial: '' } },
    { id: '3', name: 'Chartreux', description: '', temperament: '', origin: '', life_span: '', weight: { metric: '', imperial: '' } },
    { id: '4', name: 'Devon Rex', description: '', temperament: '', origin: '', life_span: '', weight: { metric: '', imperial: '' } },
    { id: '5', name: 'Egyptian Mau', description: '', temperament: '', origin: '', life_span: '', weight: { metric: '', imperial: '' } },
    { id: '6', name: 'Persian', description: '', temperament: '', origin: '', life_span: '', weight: { metric: '', imperial: '' } },
  ];

  beforeEach(() => {
    mockCatService = jasmine.createSpyObj('CatService', ['getBreeds']);

    TestBed.configureTestingModule({
      imports: [CatTable, FormsModule, CommonModule],
      providers: [{ provide: CatService, useValue: mockCatService }],
    });

    fixture = TestBed.createComponent(CatTable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load breeds on init', () => {
    mockCatService.getBreeds.and.returnValue(of(mockBreeds));

    component.ngOnInit();

    expect(component.isLoading).toBeFalse();
    expect(component.breeds.length).toBe(6);
    expect(component.filteredBreeds.length).toBe(6);
  });

  it('should handle error when loading breeds', () => {
    mockCatService.getBreeds.and.returnValue(throwError(() => new Error('fail')));

    component.ngOnInit();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Error cargando las razas de gatos');
  });

  it('should filter breeds on search', () => {
    component.breeds = mockBreeds;

    component.searchText = 'Bengal';
    component.searchBreeds();

    expect(component.filteredBreeds.length).toBe(1);
    expect(component.filteredBreeds[0].name).toBe('Bengal');
  });

  it('should paginate correctly', () => {
    component.filteredBreeds = mockBreeds;
    component.itemsPerPage = 2;
    component.currentPage = 2;

    const result = component.paginatedBreeds;

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Chartreux');
    expect(result[1].name).toBe('Devon Rex');
  });

  it('should calculate total pages correctly', () => {
    component.filteredBreeds = mockBreeds;
    component.itemsPerPage = 2;

    const total = component.totalPages();

    expect(total).toBe(3);
  });

  it('should change currentPage when goToPage is called with a valid page', () => {
    component.filteredBreeds = mockBreeds;
    component.itemsPerPage = 2;
    component.goToPage(2);

    expect(component.currentPage).toBe(2);
  });

  it('should not change currentPage if goToPage is called with invalid page', () => {
    component.filteredBreeds = mockBreeds;
    component.itemsPerPage = 2;
    component.currentPage = 1;
    component.goToPage(10);

    expect(component.currentPage).toBe(1);
  });

  it('should get visible pages for few pages', () => {
    component.filteredBreeds = mockBreeds;
    component.itemsPerPage = 2;
    component.currentPage = 1;

    const pages = component.getVisiblePages();

    // Con 3 páginas disponibles y total <= 7 debe devolver [2,3]
    expect(pages).toEqual([2, 3]);
  });
});
