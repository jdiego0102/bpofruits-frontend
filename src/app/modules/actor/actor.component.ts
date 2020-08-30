import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActorService } from '../../services/actor/actor.service';
import { ToastrService } from 'ngx-toastr';
import { ActorResponse } from 'src/app/models/actor.interface';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.scss'],
})
export class ActorComponent implements OnInit, OnDestroy {
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Controlar spinner
  isLoading: boolean = false;

  isUpdatingData: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actorService: ActorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  // Obtener valores del formulario del actor y validaciones
  actorForm = this.fb.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    nro_documento: ['', [Validators.required]],
  });

  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSaveActor(): void {
    // Activar spinner de carga.
    this.isLoading = true;
    // Obtener array del formulario
    let formValue = this.actorForm.value;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.actorService
        .updateActor(formValue)
        .subscribe((res: ActorResponse) => {
          if (res.status == 'success') {
            // this.router.navigate(['/']);
            // Mostrar notificación
            this.toastr.success(res.msg, res.title, {
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
    if (this.actorForm.get(field).errors.required) {
      message = 'El campo es requerido.';
      // Correo inválido
    } else if (this.actorForm.get(field).hasError('pattern')) {
      message = 'Ingresar un correo válido.';
    }
    return message;
  }

  // Método valdiar acciones con el campo de texto
  isValidField(field: string): boolean {
    return (
      (this.actorForm.get(field).touched || this.actorForm.get(field).dirty) &&
      !this.actorForm.get(field).valid
    );
  }

  updateData(): void {}
}
