import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserResponse } from 'src/app/models/user.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // private isValidEmail = /\S+@\S+\.\S+/;
  // private subscriptions: Subscription[] = [];
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Controlar spinner
  isLoading: boolean = false;
  // Controlar mostrar/ocultar contraseña
  hide = true;
  // Obtener valores del formulario
  loginForm = this.fb.group({
    name: [
      '',
      [Validators.required /* , Validators.pattern(this.isValidEmail) */],
    ],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    /* const userData = {
      name: 'JDCASTRO',
      password: '123456',
    };
    this.authService.login(userData).subscribe((res) => res); */
  }
  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    // this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscription.unsubscribe();
  }

  // Mostrar mensaje de bienvenida
  openSnackBar() {
    this._snackBar.open('¡BIENVENIDO!', 'Ok', {
      duration: 5 * 1000,
    });
  }

  // Método que se envía al botón para iniciar sesión
  onLogin(): void {
    // Verificar si el formulario es valido para continuar
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.loginForm.value;
    this.subscription.add(
      this.authService.login(formValue).subscribe((res: UserResponse) => {
        if (res.status == 'success') {
          this.router.navigate(['/admin']);
          // Mostrar notificación
          this.toastr.success('Bienvenido de nuevo...', '¡Hola!', {
            timeOut: 7000,
            progressBar: true,
          });
          this.isLoading = false;
        } else {
          // Mostrar notificación
          this.toastr.error(res.msg, '¡Error!', {
            timeOut: 7000,
            progressBar: true,
          });
          this.isLoading = false;
        }
      })
    );
  }

  // Método para validar errores y retornar el mensaje con el mismo
  getErrorMessage(field: string): string {
    let message = '';
    // Campo requerido
    if (this.loginForm.get(field).errors.required) {
      message = 'El campo es requerido.';
      // Mímino 5 carácteres
    } else if (this.loginForm.get(field).hasError('minlength')) {
      const minLength = this.loginForm.get(field).errors?.minlength
        .requiredLength;
      message = `El campo debe tener mínimo ${minLength} caracteres.`;
    } /* else if (this.loginForm.get(field).hasError('pattern')) {
      message = 'Ingresar un correo válido.';
    } */
    return message;
  }

  // Método valdiar acciones con el campo de texto
  isValidField(field: string): boolean {
    return (
      (this.loginForm.get(field).touched || this.loginForm.get(field).dirty) &&
      !this.loginForm.get(field).valid
    );
  }
}
