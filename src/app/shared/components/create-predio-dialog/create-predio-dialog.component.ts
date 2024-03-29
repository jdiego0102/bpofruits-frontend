import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PredioService } from '../../../services/predio/predio.service';
import { DepartmentService } from '../../../services/department/department.service';
import { CityService } from '../../../services/city/city.service';
import { SidewalkService } from '../../../services/sidewalk/sidewalk.service';
import { ToastrService } from 'ngx-toastr';
import {
  AccessRoads,
  AccessRoadsResponse,
  DocumentType,
  DocumentTypeResponse,
  Predio,
  PredioResponse,
  States,
} from 'src/app/models/predio.interface';
import {
  DepartmentResponse,
  Department,
} from '../../../models/department.interface';
import { startWith, map } from 'rxjs/operators';
import { CityResponse, City } from 'src/app/models/city.interface';
import { SidewalkResponse, Sidewalk } from 'src/app/models/sidewalk.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-predio-dialog',
  templateUrl: './create-predio-dialog.component.html',
  styleUrls: ['./create-predio-dialog.component.scss'],
})
export class CreatePredioDialogComponent implements OnInit, OnDestroy {
  private isValidEmail = /\S+@\S+\.\S+/;
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();

  // Controlar spinner
  isLoading: boolean = false;
  // Mostrar/Ocultar barra de progreso.
  showProgressBar: boolean = true;
  // Cargando departamento
  showLoadingDepartment = false;
  // Cargando departamento
  showLoadingCity = false;
  // Cargando departamento
  showLoadingSideWalk = false;
  // Cargando número de documento
  showLoadingDocumentType = false;
  // Cargando estados vías de acceso
  showLoadingAccessRoads = false;

  // Mostrar/Ocultar formulario del actor.
  isUpdatingData: boolean = false;

  // Formulario
  predioForm: FormGroup;

  // Array predio
  predio: any = {};

  // Array departamento
  departments: Department[] = [];
  // Departamentos a friltar
  filteredDepartments = new Observable<Department[]>();
  // Departamento seleccionado
  departmentSelect: Department;

  // Array ciudades
  cities: City[] = [];
  // Ciudades a friltar
  filteredCities = new Observable<City[]>();
  // Ciudad seleccionado
  citySelect: City;

  // Array veredas
  sidewalks: Sidewalk[] = [];
  // Ciudades a friltar
  filteredSidewalks = new Observable<Sidewalk[]>();
  // Ciudad seleccionado
  sidewalkSelect: Sidewalk;

  // Objeto predio
  objPredio: Predio;

  // Array tipos de documentos
  documentsTypes: DocumentType[] = [];
  // Array estados vías de acceso
  accessRoads: AccessRoads[] = [];
  // Array del predio que viene de la tabla
  arrayEstate: Predio;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private predioService: PredioService,
    private departmentService: DepartmentService,
    private citytService: CityService,
    private sideWalkService: SidewalkService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreatePredioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public estate: Predio
  ) {
    if (estate) {
      this.arrayEstate = estate['predio'];
    }
  }

  ngOnInit(): void {
    this.onGetDepartments();
    // Obtener valores del formulario del predio y validaciones
    this.predioForm = this.fb.group({
      nombre_predio: ['', [Validators.required]],
      telefono1: ['', [Validators.required]],
      telefono2: [''],
      contacto: ['', [Validators.required]],
      tipo_doc_contacto: ['', [Validators.required]],
      nro_doc_contacto: ['', [Validators.required]],
      correo: ['', Validators.pattern(this.isValidEmail)],
      representante_legal: ['', [Validators.required]],
      tipo_doc_propietario: ['', [Validators.required]],
      nro_doc_propietario: ['', [Validators.required]],
      cuenta: [''],
      rut: [''],
      departamento_id: ['', [Validators.required]],
      ciudad_id: ['', [Validators.required]],
      vereda_id: ['', [Validators.required]],
      observaciones: [''],
      via_acceso_id: ['', [Validators.required]],
    });

    // Obtener valor y cambios del departamento filtrado
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

    // Obtener valor y cambios de la ciudad filtrada
    this.filteredCities = this.predioForm.get('ciudad_id').valueChanges.pipe(
      startWith(''),
      map((cityValue) =>
        typeof cityValue === 'string' ? cityValue : cityValue.nombre_ciudad
      ),
      map((nombre_ciudad) =>
        nombre_ciudad ? this._filterCity(nombre_ciudad) : this.cities.slice()
      )
    );
    // Obtener valor y cambios de la vereda filtrada
    this.filteredSidewalks = this.predioForm.get('vereda_id').valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.nombre_vereda)),
      map((nombre_vereda) =>
        nombre_vereda
          ? this._filterSidewalk(nombre_vereda)
          : this.sidewalks.slice()
      )
    );

    // Deshabilitar solo dichos campos
    this.predioForm.controls['departamento_id'].disable();
    this.predioForm.controls['ciudad_id'].disable();
    this.predioForm.controls['vereda_id'].disable();
    this.predioForm.controls['tipo_doc_propietario'].disable();
    this.predioForm.controls['tipo_doc_contacto'].disable();
    this.onGetPredio();
    this.onGetDocumentsType();
    this.onGetAccessRoads();

    if (this.arrayEstate != null || this.arrayEstate != undefined) {
      // Asignar valores del objeto los inputs del formulario
      this.predioForm.controls['nombre_predio'].setValue(
        this.arrayEstate.nombre_predio
      );
      this.predioForm.controls['telefono1'].setValue(
        this.arrayEstate.telefono1
      );
      this.predioForm.controls['telefono2'].setValue(
        this.arrayEstate.telefono2
      );
      this.predioForm.controls['contacto'].setValue(this.arrayEstate.contacto);
      this.predioForm.controls['correo'].setValue(this.arrayEstate.correo);
      this.predioForm.controls['representante_legal'].setValue(
        this.arrayEstate.representante_legal
      );
      this.predioForm.controls['cuenta'].setValue(this.arrayEstate.cuenta);
      this.predioForm.controls['rut'].setValue(this.arrayEstate.rut);
      this.predioForm.controls['vereda_id'].setValue({
        nombre_vereda: this.arrayEstate.nombre_vereda,
      });
      this.predioForm.controls['observaciones'].setValue(
        this.arrayEstate.observaciones
      );
      this.predioForm.controls['tipo_doc_contacto'].setValue(
        this.arrayEstate.tipo_doc_contacto
      );
      this.predioForm.controls['nro_doc_contacto'].setValue(
        this.arrayEstate.nro_doc_contacto
      );
      this.predioForm.controls['tipo_doc_propietario'].setValue(
        this.arrayEstate.tipo_doc_propietario
      );
      this.predioForm.controls['nro_doc_propietario'].setValue(
        this.arrayEstate.nro_doc_propietario
      );
      this.predioForm.controls['via_acceso_id'].setValue(
        this.arrayEstate.via_acceso_id
      );
    }
  }

  // Filtrar departamentos
  private _filter(value: string): Department[] {
    const filterValue = value.toString().toLowerCase();

    // Obtener el primer valor del filtro y asignarlo al objeto.
    this.departmentSelect = this.departments.filter((option) =>
      option['nombre_departamento'].toLowerCase().includes(filterValue)
    )[0];

    // Obtener ciudades por departamento filtrado
    this.onGetCities(this.departmentSelect.departamento_id);

    return this.departments.filter(
      (option) =>
        option['nombre_departamento']
          .toString()
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }

  // Mostrar nombre del departamento seleccionado
  diplayDp(subjectDepartment) {
    return subjectDepartment
      ? subjectDepartment.nombre_departamento
      : undefined;
  }

  // Filtro de ciudades
  private _filterCity(city: string): City[] {
    const filterCity = city.toString().toLowerCase();

    // Obtener el primer valor del filtro y asignarlo al objeto.
    this.citySelect = this.cities.filter((optionCity) =>
      optionCity.nombre_ciudad.toLowerCase().includes(filterCity)
    )[0];

    // Obtener veredas por ciudad filtrada
    this.onGetSidewalks(this.citySelect.ciudad_id);

    // Retornar valor filtrado
    return this.cities.filter(
      (optionCity) =>
        optionCity.nombre_ciudad
          .toString()
          .toLowerCase()
          .indexOf(filterCity) === 0
    );
  }

  // Mostrar nombre de la ciudad seleccionada
  diplayCit(subjectCity) {
    return subjectCity ? subjectCity.nombre_ciudad : undefined;
  }

  // Filtro de veredas
  private _filterSidewalk(sidewalk: string): Sidewalk[] {
    const filterSidewalk = sidewalk.toString().toLowerCase();

    // Obtener el primer valor del filtro y asignarlo al objeto.
    this.sidewalkSelect = this.sidewalks.filter((option) =>
      option.nombre_vereda.toLowerCase().includes(filterSidewalk)
    )[0];

    // Retornar valor filtrado
    return this.sidewalks.filter(
      (option) =>
        option.nombre_vereda
          .toString()
          .toLowerCase()
          .indexOf(filterSidewalk) === 0
    );
  }

  // Mostrar nombre de la ciudad seleccionada
  diplaySid(subjectSidewalk) {
    return subjectSidewalk ? subjectSidewalk.nombre_vereda : undefined;
  }

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Obtener datos del predio por usuario
  onGetPredio(): void {
    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.predioService.getPredio().subscribe((res: PredioResponse) => {
        if (res) {
          if (res.status == 'success') {
            // this.objPredio = res.states[0];

            this.showProgressBar = false;
          } else {
            // Mostrar notificación
            this.toastr.warning(res.msg, res.title, {
              timeOut: 7000,
              progressBar: true,
            });

            this.isUpdatingData = true;
            // Deshabilitar todo el formulario
            this.predioForm.enable();
            this.showProgressBar = false;

            this.onGetDepartments();
          }
        }
      })
    );
  }

  onSavePredio(): void {
    // Activar spinner de carga.
    this.isLoading = true;
    // Asiganar el valor de la vereda seleccionada al valor del formulario.
    this.predioForm.get('vereda_id').setValue(this.sidewalkSelect.vereda_id);
    // Obtener valores del formulario
    let formValue = this.predioForm.value;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.predioService
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

              this.isUpdatingData = false;
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, '¡Error!', {
                timeOut: 7000,
                progressBar: true,
              });
              this.isLoading = false;
              // Deshabilitar todo el formulario
              this.predioForm.enable();
              this.showProgressBar = false;
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
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
            }
          }
        })
    );
  }

  // Obtener ciudades
  onGetCities(departmentId: number): void {
    this.showLoadingCity = true;
    this.predioForm.controls['ciudad_id'].patchValue('');

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.citytService
        .getCities(departmentId)
        .subscribe((res: CityResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.cities = res.cities;

              this.showLoadingCity = false;
              this.predioForm.controls['ciudad_id'].enable();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
            }
          }
        })
    );
  }

  // Obtener veredas
  onGetSidewalks(cityId: number): void {
    this.showLoadingSideWalk = true;
    this.predioForm.controls['vereda_id'].patchValue('');

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.sideWalkService
        .getSidewalk(cityId)
        .subscribe((res: SidewalkResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.sidewalks = res.sidewalks;

              this.showLoadingSideWalk = false;
              this.predioForm.controls['vereda_id'].enable();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.showLoadingSideWalk = false;
            }
          }
        })
    );
  }

  // Método para validar errores y retornar el mensaje con el mismo
  getErrorMessage(field: string): string {
    let message = '';
    // Campo requerido
    if (this.predioForm.get(field).errors?.required) {
      message = 'El campo es requerido.';
      // Correo inválido
    } else if (this.predioForm.get(field).errors?.hasError('pattern')) {
      message = 'Ingresar un correo válido.';
    }
    return message;
  }

  // Método validar acciones con el campo de texto
  isValidField(field: string): boolean {
    return (
      (this.predioForm.get(field).touched ||
        this.predioForm.get(field).dirty) &&
      !this.predioForm.get(field).valid
    );
  }

  // Permitir modificar predio
  updatingData(): void {
    this.isUpdatingData = !this.isUpdatingData;

    // Habilitar/Deshabilitar campos del formulario
    if (this.isUpdatingData == true) {
      this.onGetDepartments();
      this.predioForm.enable();
    } else {
      this.predioForm.disable();
    }
  }

  // Obtener tipos de documentos
  onGetDocumentsType(): void {
    this.showLoadingDocumentType = true;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.predioService
        .getDocumentType()
        .subscribe((res: DocumentTypeResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.documentsTypes = res.documentType;

              this.showLoadingDocumentType = false;
              // Habilitar inputs
              this.predioForm.controls['tipo_doc_propietario'].enable();
              this.predioForm.controls['tipo_doc_contacto'].enable();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.showLoadingDocumentType = false;
            }
          }
        })
    );
  }

  // Obtener estados vías de acceso
  onGetAccessRoads(): void {
    this.showLoadingAccessRoads = true;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.predioService
        .getAccessRoads()
        .subscribe((res: AccessRoadsResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.accessRoads = res.accessRoads;

              this.showLoadingAccessRoads = false;
              // Habilitar inputs
              // this.predioForm.controls['tipo_doc_propietario'].enable();
              // this.predioForm.controls['tipo_doc_contacto'].enable();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.showLoadingAccessRoads = false;
            }
          }
        })
    );
  }
}
