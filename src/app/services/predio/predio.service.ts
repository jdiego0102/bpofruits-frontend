import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Predio, PredioResponse } from '../../models/predio.interface';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PredioService {
  constructor(private http: HttpClient, private router: Router) {}

  getPredio(predio_id: number): void {}

  // Realizar petición al servidor para guardar almacenar predio
  savePredio(predio: Predio): Observable<PredioResponse | void> {
    return this.http
      .post<PredioResponse>(`${environment.API_URL}savePredio`, { predio })
      .pipe(
        map((res: PredioResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Realizar petición al servidor para actualizar predio
  updatePredio(predio_id: number): void {}

  // Controlar errores  de inicio de sesión
  handlerError(err: any): Observable<never> {
    let errorValue = false;
    if (err) {
      errorValue = true;
    }
    return throwError(errorValue);
  }
}
