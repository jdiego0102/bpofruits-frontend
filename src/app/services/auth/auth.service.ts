import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { UserResponse, User, Roles } from '../../models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });
  // Propiedad para cambiar el estado de componentes y demás en todos los componentes.
  private loggedIn = new BehaviorSubject<boolean>(false);
  // Controlar tipos de actor
  private role = new BehaviorSubject<Roles>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  // Obtener el valor de la propiedad.
  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isAdmin$(): Observable<number> {
    return this.role.asObservable();
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
            // Desestructurar array y obtener objeto del usuario retornado
            const userRes: any[] = res.user;
            let [objUser] = userRes;
            // Almacenar en local storage name e email
            localStorage.setItem('username', objUser.name);
            localStorage.setItem('email', objUser.email);
            localStorage.setItem('actor_id', objUser.actor_id);
            localStorage.setItem('user_id', objUser.id);
            // Guadar token
            this.saveStorage(res);
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
    return this.http
      .post<UserResponse>(
        `${environment.API_URL}login`,
        authData /* {
        headers: this.headers,
      } */
      )
      .pipe(
        map((res: UserResponse) => {
          if (res.status == 'success') {
            // Desestructurar array y obtener objeto del usuario retornado
            const userRes: any[] = res.user;
            let [objUser] = userRes;
            // Almacenar en local storage name e email
            localStorage.setItem('username', objUser.name);
            localStorage.setItem('email', objUser.email);
            localStorage.setItem('actor_id', objUser.actor_id);
            localStorage.setItem('user_id', objUser.id);
            // Guadar token
            this.saveStorage(res);
            // Setear propiedad true (El usuario está logueado)
            this.loggedIn.next(true);
            return res;
          } else {
            return res;
          }
        }),
        // Obtener error
        catchError((err) => this.handlerError(err))
      );
  }

  // Método remover token (Cerrar sesión)
  logout(): void {
    // localStorage.removeItem('token');
    localStorage.clear();
    // Setear propiedad false (El usuario no está logueado)
    this.loggedIn.next(false);
    this.router.navigate(['login']);
  }

  // Verificar si el token ha caducado
  private checkToken(): void {
    // Obtener user
    const user = JSON.parse(localStorage.getItem('user')) || null;

    if (user) {
      // Verificar si ha expiradado (true/false).
      const isExpired = helper.isTokenExpired(user.token);
      // Validar para salir de admin.
      // isExpired ? this.logout() : this.loggedIn.next(true); /
      if (isExpired) {
        this.logout();
      } else {
        this.loggedIn.next(true); // Setear propiedad true (El usuario está logueado)
        this.role.next(user.user[0].tipo_actor_id);
      }
    }
  }

  // Método guardar token del usuario
  private saveStorage(user: UserResponse): void {
    // localStorage.setItem('token', token);
    const { userId, msg, ...rest } = user;

    localStorage.setItem('user', JSON.stringify(rest));
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
