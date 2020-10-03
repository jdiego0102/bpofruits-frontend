import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  CropResponse,
  CropTypeResponse,
  Culture,
} from 'src/app/models/culture.interface';
import { Lot, LotResponse } from 'src/app/models/lot.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CropService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });

  // Obtener el usuario id
  user_id: number = Number(localStorage.getItem('user_id'));

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

  // Realizar petición al servidor para guardar almacenar cultivo
  saveCrop(culture: Culture): Observable<CropResponse | void> {
    return this.http
      .post<CropResponse>(`${environment.API_URL}culture/create`, culture, {
        headers: this.headers,
      })
      .pipe(
        map((res: CropResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Realizar petición al servidor para guardar almacenar lote del cultivo
  saveBatch(lot: Lot): Observable<LotResponse | void> {
    console.log(lot);
    return this.http
      .post<LotResponse>(`${environment.API_URL}lot/create`, lot, {
        headers: this.headers,
      })
      .pipe(
        map((res: LotResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Consultar cultivo por usuario
  getPredio(): Observable<CropResponse | void> {
    return this.http
      .get<CropResponse>(
        `${environment.API_URL}culture/list/${this.user_id}`,
        {}
      )
      .pipe(
        map((res: CropResponse) => {
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
