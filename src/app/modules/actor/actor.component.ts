import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  // Mostrar/Ocultar formulario del actor.
  isUpdatingData: boolean = false;
  // Mostrar/Ocultar barra de progreso.
  showProgressBar: boolean = true;
  // Array actor
  objActor: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actorService: ActorService,
    private toastr: ToastrService
  ) {
    // Cargar datos del actor
    this.onGetActor();
    // Inicializar campos deshabilitados
    this.actorForm.controls['nombres'].disable();
    this.actorForm.controls['apellidos'].disable();
    this.actorForm.controls['nro_documento'].disable();
  }

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

  // Actualizar actor
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

            this.actorForm.controls['nombres'].disable();
            this.actorForm.controls['apellidos'].disable();
            this.actorForm.controls['nro_documento'].disable();
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

  // Obtener datos del actor
  onGetActor(): void {
    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.actorService.getActor().subscribe((res: ActorResponse) => {
        if (res) {
          if (res.status == 'success') {
            this.objActor = res.actor;

            // Asignar valores del objeto los inputs del formlulario
            this.actorForm.controls['nombres'].setValue(this.objActor.nombres);
            this.actorForm.controls['apellidos'].setValue(
              this.objActor.apellidos
            );
            this.actorForm.controls['nro_documento'].setValue(
              this.objActor.nro_documento
            );
            this.showProgressBar = false;
          } else {
          }
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

  updatingData(): void {
    this.isUpdatingData = !this.isUpdatingData;

    if (this.isUpdatingData == true) {
      this.actorForm.controls['nombres'].enable();
      this.actorForm.controls['apellidos'].enable();
      this.actorForm.controls['nro_documento'].enable();
    } else {
      this.actorForm.controls['nombres'].disable();
      this.actorForm.controls['apellidos'].disable();
      this.actorForm.controls['nro_documento'].disable();
    }
  }
}
