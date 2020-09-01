import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Actor, ActorResponse } from '../../models/actor.interface';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ActorService {
  actor_id = localStorage.getItem('actor_id');

  constructor(private http: HttpClient, private router: Router) {}

  // Obtener actor por id
  getActor(): Observable<ActorResponse | void> {
    return this.http
      .post<ActorResponse>(
        `${environment.API_URL}getActor/${this.actor_id}`,
        {}
      )
      .pipe(
        map((res: ActorResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }
  // Actualizar actor por id
  updateActor(actor: Actor): Observable<ActorResponse | void> {
    // Asignar update_by del usuario que está logueado
    actor = {
      nombres: actor.nombres,
      apellidos: actor.apellidos,
      nro_documento: actor.nro_documento,
      updated_by: localStorage.getItem('username'),
    };
    return this.http
      .post<ActorResponse>(
        `${environment.API_URL}updateActor/${this.actor_id}`,
        actor
      )
      .pipe(
        map((res: ActorResponse) => {
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
