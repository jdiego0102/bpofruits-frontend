import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import {
  CultivationData,
  CultivationDataResponse,
  ShowCrops,
} from 'src/app/models/culture.interface';
import { PredioResponse, States } from 'src/app/models/predio.interface';
import { PredioService } from 'src/app/services/predio/predio.service';
import {
  Pesticide,
  PesticideResponse,
  PesticideType,
  PesticideTypeResponse,
} from '../../../models/pesticide.interface';

/* Format datePicker  */
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';
import { defaultFormat as _rollupMoment } from 'moment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { map, startWith } from 'rxjs/operators';
import { CropService } from 'src/app/services/culture/crop.service';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: ['LL', 'YYYY-MM-DD'],
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-create-info-tec-dialog',
  templateUrl: './create-info-tec-dialog.component.html',
  styleUrls: ['./create-info-tec-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DatePipe },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'warn' } },
  ],
})
export class CreateInfoTecDialogComponent implements OnInit {
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Formulario
  infoTecForm: FormGroup;

  /* Propiedades de carga y otros */
  // Cargando predios
  showLoadingStates = false;
  // Materia Seca/Color
  m_c: string = '';
  showLoadingPesticideTypes = false;
  showLoadingPesticide = false;
  isLoading = false;

  /* Objestos */
  // Tipo de plaguicida seleccionado
  pesticideTypetSelect: PesticideType;
  // Plaguicida seleccionado
  pesticideSelected: Pesticide;
  pesticide: Pesticide = null;

  /* Arreglos */
  // Array del cultivo que viene de la tabla
  arrayCrop: ShowCrops;
  // Array predios
  states: States[] = [];
  // Array tipos de plaguicidas
  pesticidesTypes: PesticideType[] = [];
  // Array de plaguicidas
  pesticides: Pesticide[] = [];
  // Columnas datatable plaguicida
  displayedColumns: string[] = [
    'index',
    'nombre_tipo_plaguicida',
    'descripcion',
    'fecha_aplicacion',
    'actions',
  ];
  // Array plaguicida
  PESTICIDE_DATA: Pesticide[] = [];
  dataSource = this.PESTICIDE_DATA;

  /* Observables */
  // Tipos de plaguicidas a friltar
  filteredPesticideType = new Observable<PesticideType[]>();

  constructor(
    private fb: FormBuilder,
    private predioService: PredioService,
    private cropService: CropService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<CreateInfoTecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public crop: ShowCrops
  ) {
    this.arrayCrop = this.crop;
  }

  ngOnInit(): void {
    this.onGetPesticideTypes();
    // Obtener valores del formulario del cultivo y validaciones
    this.infoTecForm = this.fb.group({
      predio_id: [''],
      producto_id: [''],
      fecha: ['', [Validators.required]],
      asesoria_agronomo: [''],
      centro_acopio: [''],
      senhaletica: [''],
      agua: [''],
      status: [''],
      materia_seca: [''],
      color: [''],
      fecha_podas: [''],
      empresa_abonos: [''],
      observacion_emp_abono: [''],
      agricultor_organico: [''],
      razon_agricultor_org: [''],
      produce_insumos: [''],
      insumos_cuales: [''],
      tipo_plaguicida_id: [''],
      plaguicida_id: [''],
      fecha_aplicacion: [''],
    });

    // Deshabilitar predio.
    this.infoTecForm.controls['predio_id'].disable();
    // Deshabilitar producto.
    this.infoTecForm.controls['producto_id'].disable();

    // Asignar valor del predio que viene del cultivo.
    this.infoTecForm.controls['predio_id'].setValue(
      this.arrayCrop['crop'].predio
    );

    // Asignar valor del nombre del producto que viene del cultivo.
    this.infoTecForm.controls['producto_id'].setValue(
      `${this.arrayCrop['crop'].producto} (${this.arrayCrop['crop'].variedad})`
    );

    // Obtener valor de los botones de radio
    this.infoTecForm.controls['status'].valueChanges.subscribe(
      (status) => (this.m_c = status)
    );

    // Obtener valor del tipo de plaguicida filtrado.
    this.filteredPesticideType = this.infoTecForm
      .get('tipo_plaguicida_id')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.descripcion)),
        map((descripcion) =>
          descripcion
            ? this._pesticideTypeFilter(descripcion)
            : this.pesticidesTypes.slice()
        )
      );
  }

  // Filtrar tipos de plaguicidas
  private _pesticideTypeFilter(value: string): PesticideType[] {
    const filterValue = value.toString().toLowerCase();

    // Obtener el primer valor del filtro y asignarlo al objeto.
    this.pesticideTypetSelect = this.pesticidesTypes.filter((option) =>
      option['descripcion'].toLowerCase().includes(filterValue)
    )[0];

    if (this.pesticideTypetSelect != undefined) {
      this.onGetPesticides(this.pesticideTypetSelect.tipo_plaguicida_id);
    }

    // Obtener plaguicidas por tipo de plaguicida filtrado

    return this.pesticidesTypes.filter(
      (option) =>
        option['descripcion'].toString().toLowerCase().indexOf(filterValue) ===
        0
    );
  }

  // Mostrar nombre del tipo de plaguicida seleccionado
  diplayPgT(subjectPlaguicideType) {
    return subjectPlaguicideType
      ? subjectPlaguicideType.descripcion
      : undefined;
  }

  // Mostrar nombre del plaguicida seleccionado
  diplayPg(subjectPlaguicide) {
    return subjectPlaguicide ? subjectPlaguicide.descripcion : undefined;
  }

  // Método para validar errores y retornar el mensaje con el mismo
  getErrorMessage(field: string): string {
    let message = '';
    // Campo requerido
    if (this.infoTecForm.get(field).errors?.required) {
      message = 'El campo es requerido.';
    }
    return message;
  }

  // Método validar acciones con el campo de texto
  isValidField(field: string): boolean {
    return (
      (this.infoTecForm.get(field).touched ||
        this.infoTecForm.get(field).dirty) &&
      !this.infoTecForm.get(field).valid
    );
  }

  // Obtener tipos de plaguicidas
  onGetPesticideTypes(): void {
    this.showLoadingPesticideTypes = true;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.cropService
        .getPesticideType()
        .subscribe((res: PesticideTypeResponse) => {
          if (res) {
            if (res.status == 'success') {
              console.log(res);
              this.pesticidesTypes = res.pesticideType;

              this.showLoadingPesticideTypes = false;
              this.infoTecForm.controls['plaguicida_id'].enable();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.showLoadingPesticideTypes = false;
            }
          }
        })
    );
  }

  // Obtener plaguicidas
  onGetPesticides(pesticideTypeId: number): void {
    this.showLoadingPesticide = true;
    this.infoTecForm.controls['plaguicida_id'].patchValue('');

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.cropService
        .getPesticides(pesticideTypeId)
        .subscribe((res: PesticideResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.pesticides = res.pesticide;

              this.showLoadingPesticide = false;
              this.infoTecForm.controls['plaguicida_id'].enable();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.showLoadingPesticide = false;
            }
          }
        })
    );
  }

  onAddPesticide(): void {
    // Obtener valores de fecha
    let datePicker = this.infoTecForm.get('fecha_aplicacion').value._d;

    // Establecer valores para objeto del plaguicida
    let pesticideType = this.pesticideTypetSelect.descripcion;
    let pesticideName = this.infoTecForm.get('plaguicida_id').value;
    let pesticideDate = this.datePipe.transform(datePicker, 'yyyy-MM-dd'); // Formatear valor de datepicker con datepipe

    // Armar objeto plaguicida y añadir al array
    this.dataSource.push(
      (this.pesticide = {
        nombre_tipo_plaguicida: pesticideType,
        plaguicida_id: pesticideName.plaguicida_id,
        descripcion: pesticideName.descripcion,
        fecha_aplicacion: pesticideDate,
        cultivo_id: this.arrayCrop['crop'].cultivo_id,
      })
    );
    // Refrescar datos de la tabla.
    this.dataSource = [...this.dataSource];
  }

  // Eliminar plaguicida de la tabla temporal
  rmPesticide(index: number): void {
    // Remover del array
    this.dataSource.splice(index, 1);

    // Refrescar datos de la tabla.
    this.dataSource = [...this.dataSource];
  }

  onSaveInfoTec(): void {
    // Activar spinner de carga.
    this.isLoading = true;
    // Obtener valores del formulario
    let formValue: CultivationData = this.infoTecForm.value;

    // Obtener valores de fecha
    let date = this.infoTecForm.get('fecha').value._d;
    let pruningDate = this.infoTecForm.get('fecha_podas').value._d;

    formValue = {
      fecha: this.datePipe.transform(date, 'yyyy-MM-dd'), // Formatear valor de datepicker con datepipe,
      cultivo_id: this.arrayCrop['crop'].cultivo_id,
      materia_seca: formValue.materia_seca,
      asesoria_agronomo: formValue.asesoria_agronomo,
      empresa_abonos: formValue.empresa_abonos,
      observacion_emp_abono: formValue.observacion_emp_abono,
      agricultor_organico: formValue.agricultor_organico,
      razon_agricultor_org: formValue.razon_agricultor_org,
      fecha_podas: this.datePipe.transform(pruningDate, 'yyyy-MM-dd'),
      centro_acopio: formValue.centro_acopio,
      senhaletica: formValue.senhaletica,
      produce_insumos: formValue.produce_insumos,
      insumos_cuales: formValue.insumos_cuales,
      agua: formValue.agua,
      created_by: localStorage.getItem('username'),
      color: formValue.color,
      pesticide: this.dataSource,
    };

    this.subscription.add(
      // Enviar datos al servicio y obtener respuesta del servidor
      this.cropService
        .saveInfoTec(formValue)
        .subscribe((res: CultivationDataResponse) => {
          if (res) {
            if (res.status == 'success') {
              // Mostrar notificación
              this.toastr.success(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.isLoading = false;
              // Cerrar diálogo
              this.dialogRef.close();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.isLoading = false;
            }
          }
        })
    );
  }
}
