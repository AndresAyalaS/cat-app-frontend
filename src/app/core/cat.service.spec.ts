import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatService, Breed } from './cat.service';
import { environment } from '../../environments/environment';

describe('CatService', () => {
  let service: CatService;
  let httpMock: HttpTestingController;

  const dummyBreeds: Breed[] = [
    { id: 'abc', name: 'Abyssinian', description: 'Active cat', temperament: 'Active', origin: 'Egypt', life_span: '14-15', weight: { imperial: '7', metric: '3.2' } },
    { id: 'def', name: 'Bengal', description: 'Spotted coat', temperament: 'Energetic', origin: 'USA', life_span: '12-16', weight: { imperial: '10', metric: '4.5' } }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatService]
    });
    service = TestBed.inject(CatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get breeds', () => {
    service.getBreeds().subscribe(breeds => {
      expect(breeds.length).toBe(2);
      expect(breeds).toEqual(dummyBreeds);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/cats/breeds`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBreeds);
  });

  it('should get breed by id', () => {
    const breedId = 'abc';
    const breed = dummyBreeds[0];

    service.getBreedById(breedId).subscribe(response => {
      expect(response).toEqual(breed);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/cats/breeds/${breedId}`);
    expect(req.request.method).toBe('GET');
    req.flush(breed);
  });

  it('should throw error if breed id is missing', () => {
    service.getBreedById('').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('ID de raza es requerido');
      }
    });
  });

  it('should search breeds', () => {
    const query = 'Aby';
    service.searchBreeds(query).subscribe(breeds => {
      expect(breeds.length).toBe(2);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/cats/breeds/search?q=${query}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBreeds);
  });

  it('should throw error if search query is missing', () => {
    service.searchBreeds('').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Query de búsqueda es requerido');
      }
    });
  });

  it('should get breeds by image id', () => {
    const imageId = 'img123';
    const mockResponse = { id: imageId, breeds: dummyBreeds };

    service.getBreedsByImageId(imageId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/images/${imageId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error if image id is missing', () => {
    service.getBreedsByImageId('').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('ID de imagen es requerido');
      }
    });
  });

});
