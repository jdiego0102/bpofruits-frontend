import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AccessRoadsResponse,
  DocumentTypeResponse,
  Predio,
  PredioResponse,
} from '../../models/predio.interface';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

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

  // Obtener nombre de usuario
  username: {} = { username: localStorage.getItem('username') };

  // Controlar rol administrador
  isAdmin = 2;
  // Actor o administrador
  user_actor: number = 2;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getPosition();
    // Obtener valor del tipo de actor
    this.authService.isAdmin$.subscribe((res) => (this.isAdmin = res));
    // Validar si el tipo actor es administrador para traer datos de admin
    this.isAdmin == 1
      ? (this.user_actor = 0)
      : (this.user_actor = this.user_id);
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
        `${environment.API_URL}getPredio/${this.user_actor}`,
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

  // Consultar predios por usuario
  getStates(): Observable<PredioResponse | void> {
    return this.http
      .get<PredioResponse>(
        `${environment.API_URL}getStates/${this.user_actor}`,
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
      tipo_doc_contacto: predio.tipo_doc_contacto,
      nro_doc_contacto: predio.nro_doc_contacto,
      representante_legal: predio.representante_legal,
      tipo_doc_propietario: predio.tipo_doc_propietario,
      nro_doc_propietario: predio.nro_doc_propietario,
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
      via_acceso_id: predio.via_acceso_id,
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

  // Consultar predios por usuario
  getDocumentType(): Observable<DocumentTypeResponse | void> {
    return this.http
      .get<DocumentTypeResponse>(`${environment.API_URL}documentType/id`, {})
      .pipe(
        map((res: DocumentTypeResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Consultar vías de acceso
  getAccessRoads(): Observable<AccessRoadsResponse | void> {
    return this.http
      .get<AccessRoadsResponse>(`${environment.API_URL}accessRoads/list`, {})
      .pipe(
        map((res: AccessRoadsResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Eliminar predio por id
  deletePredio(predioId: number): Observable<PredioResponse | void> {
    return this.http
      .post<PredioResponse>(
        `${environment.API_URL}predio/delete/${predioId}`,
        this.username,
        { headers: this.headers }
      )
      .pipe(
        map((res: PredioResponse) => {
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
