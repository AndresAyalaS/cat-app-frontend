import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Breed {
  id: string;
  name: string;
  description: string;
  temperament: string;
  origin: string;
  life_span: string;
  weight: {
    imperial: string;
    metric: string;
  };
  wikipedia_url?: string;
  reference_image_id?: string;
  country_code?: string;
  country_codes?: string;
  bred_for?: string;
  breed_group?: string;
  height?: {
    imperial: string;
    metric: string;
  };
  adaptability?: number;
  affection_level?: number;
  child_friendly?: number;
  dog_friendly?: number;
  energy_level?: number;
  grooming?: number;
  health_issues?: number;
  intelligence?: number;
  shedding_level?: number;
  social_needs?: number;
  stranger_friendly?: number;
  vocalisation?: number;
  experimental?: number;
  hairless?: number;
  natural?: number;
  rare?: number;
  rex?: number;
  suppressed_tail?: number;
  short_legs?: number;
  hypoallergenic?: number;
  indoor?: number;
  lap?: number;
}

export interface BreedImage {
  id: string;
  url: string;
  breeds: Breed[];
  width: number;
  height: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CatService {
  private readonly baseCatUrl = `${environment.apiUrl}/cats`;
  private readonly baseImageUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las razas de gatos
   */
  getBreeds(): Observable<Breed[]> {
    return this.http.get<Breed[]>(`${this.baseCatUrl}/breeds`).pipe(
      retry(2), // Reintentar hasta 2 veces en caso de error
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una raza específica por ID
   */
  getBreedById(id: string): Observable<Breed> {
    if (!id) {
      return throwError(() => new Error('ID de raza es requerido'));
    }

    return this.http
      .get<Breed>(`${this.baseCatUrl}/breeds/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Busca razas por query
   */
  searchBreeds(query: string): Observable<Breed[]> {
    if (!query || query.trim().length === 0) {
      return throwError(() => new Error('Query de búsqueda es requerido'));
    }

    const params = new HttpParams().set('q', query.trim());

    return this.http
      .get<Breed[]>(`${this.baseCatUrl}/breeds/search`, { params })
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Obtiene información de razas asociadas a una imagen por su ID
   */
  getBreedsByImageId(imageId: string): Observable<any> {
    if (!imageId) {
      return throwError(() => new Error('ID de imagen es requerido'));
    }

    return this.http
      .get<any>(`${this.baseImageUrl}/${imageId}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage =
            'No se puede conectar al servidor. Verifique su conexión a internet.';
          break;
        case 400:
          errorMessage =
            'Solicitud incorrecta. Verifique los parámetros enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Inicie sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'Acceso prohibido.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 429:
          errorMessage =
            'Demasiadas solicitudes. Intente nuevamente más tarde.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        case 503:
          errorMessage = 'Servicio no disponible temporalmente.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${
            error.message || 'Error desconocido'
          }`;
      }
    }

    console.error('Error en CatService:', error);
    return throwError(() => new Error(errorMessage));
  };
}
