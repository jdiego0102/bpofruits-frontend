import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PredioService } from '../../services/predio/predio.service';
import { DepartmentService } from '../../services/department/department.service';
import { ToastrService } from 'ngx-toastr';
import { PredioResponse } from 'src/app/models/predio.interface';
import {
  DepartmentResponse,
  Department,
} from '../../models/department.interface';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-predio',
  templateUrl: './predio.component.html',
  styleUrls: ['./predio.component.scss'],
})
export class PredioComponent implements OnInit, OnDestroy {
  private isValidEmail = /\S+@\S+\.\S+/;
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Controlar spinner
  isLoading: boolean = false;
  // Mostrar/Ocultar formulario del actor.
  isUpdatingData: boolean = false;
  // Mostrar/Ocultar barra de progreso.
  showProgressBar: boolean = true;
  // Cargando departamento
  showLoadingDepartment = false;
  // Array predio
  predio: any = {};
  // Array departamento
  departments: Department[] = [];
  // Formulario
  predioForm: FormGroup;
  // Departamentos a friltar
  filteredDepartments = new Observable<Department[]>();
  // Departamento seleccionado
  departmentSelect: Department;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actorService: PredioService,
    private departmentService: DepartmentService,
    private toastr: ToastrService
  ) {
    this.onGetDepartments();
  }

  ngOnInit(): void {
    // Obtener valores del formulario del predio y validaciones
    this.predioForm = this.fb.group({
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

    this.filteredDepartments = this.predioForm
      .get('departamento_id')
      .valueChanges.pipe(
        startWith(''),
        map((value) =>
          typeof value === 'string' ? value : value.nombre_departamento
        ),
        map((nombre_departamento) =>
          nombre_departamento
            ? this._filter(nombre_departamento)
            : this.departments.slice()
        )
      );
  }

  private _filter(value: string): Department[] {
    const filterValue = value.toString().toLowerCase();

    // Obtener el primer valor del filtro y asignarlo al objeto.
    this.departmentSelect = this.departments.filter((option) =>
      option['nombre_departamento'].toLowerCase().includes(filterValue)
    )[0];

    return this.departments.filter(
      (option) =>
        option['nombre_departamento']
          .toString()
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }

  diplayDp(subject) {
    return subject ? subject.nombre_departamento : undefined;
  }

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updatingData(): void {}

  onSavePredio(): void {
    // Activar spinner de carga.
    this.isLoading = true;
    // Obtener array del formulario
    let formValue = this.predioForm.value;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.actorService
        .savePredio(formValue)
        .subscribe((res: PredioResponse) => {
          if (res) {
            if (res.status == 'success') {
              // Mostrar notificación
              this.toastr.success(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.isLoading = false;

              // this.predioForm.controls['nombres'].disable();
              // this.predioForm.controls['apellidos'].disable();
              // this.predioForm.controls['nro_documento'].disable();

              this.isUpdatingData = false;
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, '¡Error!', {
                timeOut: 7000,
                progressBar: true,
              });
              this.isLoading = false;
            }
          }
        })
    );
  }

  // Obtener departamentos
  onGetDepartments(): void {
    this.showLoadingDepartment = true;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.departmentService
        .getDepartments()
        .subscribe((res: DepartmentResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.departments = res.departments;

              this.showLoadingDepartment = false;
              this.predioForm.controls['departamento_id'].enable();
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
