import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // Controlar spinner
  isLoading: boolean = false;

  // Obtener valores del formulario
  loginForm = this.fb.group({
    name: [''],
    password: [''],
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    /* const userData = {
      name: 'JDCASTRO',
      password: '123456',
    };
    this.authService.login(userData).subscribe((res) => res); */
  }
  // Mostrar mensaje de bienvenida
  openSnackBar() {
    this._snackBar.open('¡BIENVENIDO!', 'Ok', {
      duration: 5 * 1000,
    });
  }

  // Método que se envía al botón para iniciar sesión
  onLogin(): void {
    this.isLoading = true;
    const formValue = this.loginForm.value;
    this.authService.login(formValue).subscribe((res) => {
      if (res) {
        this.router.navigate(['/']);
        this.openSnackBar();
        this.isLoading = false;
      } else {
        console.log(this.isLoading);
      }
    });
  }
}
