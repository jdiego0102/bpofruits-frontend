import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { City, CityResponse } from '../../models/city.interface';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient, private router: Router) {}

  // Obtener ciudades por departamento
  getCities(departmentId: number): Observable<CityResponse | void> {
    return this.http
      .get<CityResponse>(
        `${environment.API_URL}cities/list/${departmentId}`,
        {}
      )
      .pipe(
        map((res: CityResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Controlar errores  de inicio de sesión
  handlerError(err: any): Observable<never> {
    let errorValue = false;
    if (err) {
      errorValue = true;
    }
    return throwError(errorValue);
  }
}
