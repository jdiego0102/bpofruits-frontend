import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { UserResponse, User } from '../../models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Propiedad para cambiar el estado de componentes y demás en todos los componentes.
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  // Obtener el valor de la propiedad.
  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Método registro del usuario
  register(signIn: User): Observable<UserResponse | void> {
    return this.http
      .post<UserResponse>(`${environment.API_URL}signIn`, signIn)
      .pipe(
        map((res: UserResponse) => {
          if (res.status == 'error') {
            return res;
          } else {
            // Guadar token
            this.saveToken(res.token);
            // Setear propiedad true (El usuario está logueado)
            this.loggedIn.next(true);
            return res;
          }
        }),
        // Obtener error
        catchError((err) => this.handlerError(err))
      );
  }

  // Método login del usuario
  login(authData: User): Observable<UserResponse | void> {
    console.log(authData);
    return this.http
      .post<UserResponse>(`${environment.API_URL}login`, authData)
      .pipe(
        map((res: UserResponse) => {
          // Guadar token
          this.saveToken(res.token);
          // Setear propiedad true (El usuario está logueado)
          this.loggedIn.next(true);
          return res;
        }),
        // Obtener error
        catchError((err) => this.handlerError(err))
      );
  }

  // Método remover token (Cerrar sesión)
  logout(): void {
    localStorage.removeItem('token');
    // Setear propiedad false (El usuario no está logueado)
    this.loggedIn.next(false);
    this.router.navigate(['login']);
  }

  // Verificar si el token ha caducado
  private checkToken(): void {
    // Obtener token
    const userToken = localStorage.getItem('token');
    // Verificar si ha expiradado (true/false).
    const isExpired = helper.isTokenExpired(userToken);
    // Validar para salir de admin.
    isExpired ? this.logout() : this.loggedIn.next(true); // Setear propiedad true (El usuario está logueado)
  }

  // Método guardar token del usuario
  private saveToken(token: string): void {
    localStorage.setItem('token', token);
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
