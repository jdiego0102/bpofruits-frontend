import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { SidewalkResponse } from '../../models/sidewalk.interface';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SidewalkService {
  constructor(private http: HttpClient, private router: Router) {}

  // Obtener veredas por ciudad
  getSidewalk(cityId: number): Observable<SidewalkResponse | void> {
    return this.http
      .get<SidewalkResponse>(
        `${environment.API_URL}sidewalks/list/${cityId}`,
        {}
      )
      .pipe(
        map((res: SidewalkResponse) => {
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
