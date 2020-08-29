import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MustMatch } from '../../../helpers/must-match.validator';
import { User, UserResponse } from 'src/app/models/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private isValidEmail = /\S+@\S+\.\S+/;
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Controlar spinner
  isLoading: boolean = false;
  // Controlar mostrar/ocultar contraseña
  hide: boolean = false;

  // Obtener valores del formulario
  registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
    },
    {
      validator: MustMatch('password', 'confirmPassword'),
    }
  );

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Método que se envía al botón para realizar registro de usuario
  onRegister(): void {
    const formValue = this.registerForm.value;

    this.subscription.add(
      this.authService.register(formValue).subscribe((res: UserResponse) => {
        if (res.status == 'success') {
          this.router.navigate(['/']);

          // this.isLoading = false;
        } else {
          console.log(res.msg);
        }
      })
    );
  }

  // Método para validar errores y retornar el mensaje con el mismo
  getErrorMessage(field: string): string {
    let message = '';
    // Campo requerido
    if (this.registerForm.get(field).errors.required) {
      message = 'El campo es requerido.';
      // Correo inválido
    } else if (this.registerForm.get(field).hasError('pattern')) {
      message = 'Ingresar un correo válido.';
      // Mímino 5 carácteres || campo requerido
    } else if (this.registerForm.get(field).hasError('minlength')) {
      const minLength = this.registerForm.get(field).errors?.minlength
        .requiredLength;
      message = `El campo debe tener mínimo ${minLength} caracteres.`;
      // Mímino 5 carácteres || campo requerido || Contraseñas deben coincidir
    } else if (this.registerForm.get(field).hasError('mustMatch')) {
      message = 'Las contraseñas no coinciden.';
    }
    return message;
  }

  // Método valdiar acciones con el campo de texto
  isValidField(field: string): boolean {
    return (
      (this.registerForm.get(field).touched ||
        this.registerForm.get(field).dirty) &&
      !this.registerForm.get(field).valid
    );
  }
}
