import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Predio, PredioResponse } from '../../models/predio.interface';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PredioService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });
  // Obtener el usuario id
  user_id: number = Number(localStorage.getItem('user_id'));
  longitude: number = undefined;
  latitude: number = undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.getPosition();
  }

  // Solicitar permisos de ubciación, obtener latitud y longitud
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
          this.longitude = resp.coords.longitude;
          this.latitude = resp.coords.latitude;
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // Consultar predio por usuario
  getPredio(): Observable<PredioResponse | void> {
    return this.http
      .get<PredioResponse>(
        `${environment.API_URL}getPredio/${this.user_id}`,
        {}
      )
      .pipe(
        map((res: PredioResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Realizar petición al servidor para guardar almacenar predio
  savePredio(predio: Predio): Observable<PredioResponse | void> {
    // Asignar update_by del usuario que está logueado
    predio = {
      nombre_predio: predio.nombre_predio,
      contacto: predio.contacto,
      representante_legal: predio.representante_legal,
      telefono1: predio.telefono1,
      telefono2: predio.telefono2,
      vereda_id: Number(predio.vereda_id),
      correo: predio.correo,
      rut: predio.rut,
      cuenta: predio.cuenta,
      latitud: this.latitude,
      longitud: this.longitude,
      observaciones: predio.observaciones,
      created_by: localStorage.getItem('username'),
      user_id: this.user_id,
    };

    return this.http
      .post<PredioResponse>(`${environment.API_URL}savePredio`, predio, {
        headers: this.headers,
      })
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
