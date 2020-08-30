import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-predio',
  templateUrl: './predio.component.html',
  styleUrls: ['./predio.component.scss'],
})
export class PredioComponent implements OnInit, OnDestroy {
  private isValidEmail = /\S+@\S+\.\S+/;
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private router: Router) {}

  // Obtener valores del formulario del predio y validaciones
  predioForm = this.fb.group({
    nombre_predio: ['', [Validators.required]],
    telefono1: ['', [Validators.required]],
    telefono2: [''],
    contacto: ['', [Validators.required]],
    email: ['', Validators.pattern(this.isValidEmail)],
    representante_legal: ['', [Validators.required]],
    cuenta: [''],
    rut: [''],
    departamento_id: ['', [Validators.required]],
    ciudad_id: ['', [Validators.required]],
    vereda_id: ['', [Validators.required]],
  });

  ngOnInit(): void {}

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSavePredio(): void {}

  // Método para validar errores y retornar el mensaje con el mismo
  getErrorMessage(field: string): string {
    let message = '';
    // Campo requerido
    if (this.predioForm.get(field).errors.required) {
      message = 'El campo es requerido.';
      // Correo inválido
    } else if (this.predioForm.get(field).hasError('pattern')) {
      message = 'Ingresar un correo válido.';
    }
    return message;
  }

  // Método valdiar acciones con el campo de texto
  isValidField(field: string): boolean {
    return (
      (this.predioForm.get(field).touched ||
        this.predioForm.get(field).dirty) &&
      !this.predioForm.get(field).valid
    );
  }
}
