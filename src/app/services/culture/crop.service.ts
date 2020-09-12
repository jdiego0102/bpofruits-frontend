import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CropTypeResponse } from 'src/app/models/culture.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CropService {
  constructor(private http: HttpClient) {}

  // Obtener tipos de cultivo
  getCropType(): Observable<CropTypeResponse | void> {
    return this.http
      .get<CropTypeResponse>(`${environment.API_URL}cropType/list`, {})
      .pipe(
        map((res: CropTypeResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Controlar errores
  handlerError(err: any): Observable<never> {
    let errorValue = false;
    if (err) {
      errorValue = true;
    }
    return throwError(errorValue);
  }
}
