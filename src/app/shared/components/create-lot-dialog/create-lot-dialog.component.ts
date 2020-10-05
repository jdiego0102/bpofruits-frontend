import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  OnDestroy,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CropResponse,
  CropType,
  CropTypeResponse,
  Culture,
  Harvest,
  ShowCrops,
} from '../../../models/culture.interface';
import { PredioService } from 'src/app/services/predio/predio.service';
import { ProductService } from '../../../services/product/product.service';
import { CropService } from '../../../services/culture/crop.service';
import { Subscription, Observable } from 'rxjs';
import { PredioResponse, States } from '../../../models/predio.interface';
import { ToastrService } from 'ngx-toastr';
import {
  ProducType,
  ProducTypeResponse,
  ProductResponse,
  Product,
  ProducQualityResponse,
  ProducQuality,
} from '../../../models/product.interface';
import { Lot, LotResponse } from '../../../models/lot.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
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
  selector: 'app-create-lot-dialog',
  templateUrl: './create-lot-dialog.component.html',
  styleUrls: ['./create-lot-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DatePipe },
  ],
})
export class CreateLotDialogComponent implements OnInit {
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Spinner de carga
  isLoading = false;
  // Cargando predios
  showLoadingStates = false;
  // Cargando tipos de productos
  showLoadingProductTypes = false;
  // Cargando calidad del producto
  showLoadingProductQuality = false;
  // Cargando tipos de cultivos
  showLoadingCropTypes = true;
  // Array predios
  states: States[] = [];

  // Productos a friltar
  filteredProducts = new Observable<Product[]>();
  // Array tipos de productos
  productTypes: ProducType[] = [];
  // Array calidad producto
  productQuality: ProducQuality[] = [];
  // Array productos
  products: Product[] = [];
  // Array tipos de cultivo
  cropTypes: CropType[] = [];
  // Edad del cultivo
  cropAge: number[] = [];
  // Producto seleccionado
  productSelected: Product;

  // Calidad producto a filtrar
  filteredProductQuality = new Observable<ProducQuality[]>();
  // Calidad producto seleccionado
  productQualitySelected: ProducQuality;

  // Formulario
  bacthForm: FormGroup;
  // Columnas datatable cosecha
  displayedColumns: string[] = ['index', 'date', 'quality', 'tons', 'actions'];
  // Array cosecha
  HARVEST_DATA: Harvest[] = [];
  dataSource = this.HARVEST_DATA;

  harvest: Harvest = null;
  // Array del cultivo que viene de la tabla
  arrayCrop: ShowCrops;

  @Input() templateRef: TemplateRef<any>;
  constructor(
    public dialogRef: MatDialogRef<CreateLotDialogComponent>,
    private predioService: PredioService,
    private productService: ProductService,
    private cropService: CropService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public crop: ShowCrops
  ) {
    this._adapter.setLocale('es');
    this.arrayCrop = this.crop;
  }

  ngOnInit(): void {
    this.onGetProductTypes();
    this.onGetProductQuality();
    this.onGetCropType();
    this.onGetCropAge();

    // Obtener valores del formulario del cultivo y validaciones
    this.bacthForm = this.fb.group({
      tipo_producto_id: [''],
      producto_id: [''],
      variedad: [''],
      calidad_producto_id: ['', [Validators.required]],
      area_produccion: ['', [Validators.required]],
      area_desarrollo: ['', [Validators.required]],
      tipo_cultivo_id: ['', [Validators.required]],
      edad_lote: ['', [Validators.required]],
      ton_hectarea: ['', [Validators.required]],
      venta_estimada: ['', [Validators.required]],
      predio_exportador: ['', [Validators.required]],
      peso_ultima_cosecha: ['', [Validators.required]],
      fecha_esperada_cosecha: ['', [Validators.required]],
      ton_producidas: ['', [Validators.required]],
      calidad_producto_id_2: ['', [Validators.required]],
    });
    // Deshabilitar calidad_proucto (Cambia el valor con el select calidad_producto_id)
    this.bacthForm.controls['calidad_producto_id_2'].disable();
    // Deshabilitar variedad (Cambia al seleccionar la variedad)
    this.bacthForm.controls['variedad'].disable();
    // Deshabilitar variedad (Se activa al contrar datos de productos)
    this.bacthForm.controls['producto_id'].disable();
    // Deshabilitar variedad (Se activa al contrar datos de productos)
    this.bacthForm.controls['tipo_producto_id'].disable();
    // Asignar valor del tipo del producto que viene de cultivo
    this.bacthForm.controls['tipo_producto_id'].setValue(
      this.arrayCrop['crop'].tipo_producto_id
    );
    // Asignar valor del nombre del producto que viene del cultivo.
    this.bacthForm.controls['producto_id'].setValue(
      this.arrayCrop['crop'].producto
    );
    // Asignar valor de variedad que viene del cultivo.
    this.bacthForm.controls['variedad'].setValue(
      this.arrayCrop['crop'].variedad
    );

    // Obtener valor y cambios de calidad producto filtrado
    this.bacthForm.controls[
      'calidad_producto_id'
    ].valueChanges.subscribe((productId) =>
      this._filterProductQuality(productId)
    );
  }

  // Filtrar calidad de los productos
  private _filterProductQuality(value: number): ProducQuality[] {
    const filterValue = value.toString().toLowerCase();

    // Obtener el primer valor del filtro y asignarlo al objeto.
    this.productQualitySelected = this.productQuality.filter((option) =>
      option['calidad_producto_id'].toString().includes(filterValue)
    )[0];

    this.bacthForm.controls['calidad_producto_id_2'].patchValue(
      this.productQualitySelected.descripcion
    );

    // Obtener calidad del producto
    return this.productQuality.filter(
      (option) =>
        option['calidad_producto_id']
          .toString()
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }

  // Agregar cosechas a la tabla temporal
  onAddHarvest(): void {
    // Obtener valores de fecha
    let datePicker = this.bacthForm.get('fecha_esperada_cosecha').value._d;

    // Establecer valores para objeto de la cosecha.
    let harvestDate = this.datePipe.transform(datePicker, 'yyyy-MM-dd'); // Formatear valor de datepicker con datpipe
    let harvestQuality = this.productQualitySelected.descripcion;
    let tons = this.bacthForm.get('ton_producidas').value;

    // Armar objeto cosecha y añadir al array
    this.dataSource.push(
      (this.harvest = {
        date: harvestDate,
        quality: harvestQuality,
        tons: tons,
      })
    );
    // Refrescar datos de la tabla.
    this.dataSource = [...this.dataSource];
  }

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // Obtener tipos de productos
  onGetProductTypes(): void {
    this.showLoadingProductTypes = true;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.productService
        .getProductType()
        .subscribe((res: ProducTypeResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.productTypes = res.productType;

              this.showLoadingProductTypes = false;
              // this.predioForm.controls['ciudad_id'].enable();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.showLoadingProductTypes = false;
            }
          }
        })
    );
  }

  // Obtener calidad del producto
  onGetProductQuality(): void {
    this.showLoadingProductQuality = true;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.productService
        .getProductQuality()
        .subscribe((res: ProducQualityResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.productQuality = res.productQuality;

              this.showLoadingProductQuality = false;
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.showLoadingProductQuality = false;
            }
          }
        })
    );
  }

  // Obtener tipos cultivos
  onGetCropType(): void {
    this.showLoadingCropTypes = true;

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.cropService.getCropType().subscribe((res: CropTypeResponse) => {
        if (res) {
          if (res.status == 'success') {
            this.cropTypes = res.cropType;

            this.showLoadingCropTypes = false;
          } else {
            // Mostrar notificación
            this.toastr.error(res.msg, res.title, {
              timeOut: 7000,
              progressBar: true,
            });
            this.showLoadingCropTypes = false;
          }
        }
      })
    );
  }
  // Cargar edad del cultivo
  onGetCropAge(): void {
    for (let i = 1; i <= 50; i++) {
      this.cropAge.push(i);
    }
  }

  // Método para validar errores y retornar el mensaje con el mismo
  getErrorMessage(field: string): string {
    let message = '';
    // Campo requerido
    if (this.bacthForm.get(field).errors?.required) {
      message = 'El campo es requerido.';
    }
    return message;
  }

  // Método validar acciones con el campo de texto
  isValidField(field: string): boolean {
    return (
      (this.bacthForm.get(field).touched || this.bacthForm.get(field).dirty) &&
      !this.bacthForm.get(field).valid
    );
  }

  // Eliminar cosecha del array
  rmHarvest(index: number): void {
    // Remover del array
    this.dataSource.splice(index, 1);

    // Refrescar datos de la tabla.
    this.dataSource = [...this.dataSource];
  }

  // Guardar datos del cultivo
  onSaveCrop(): void {
    // Activar spinner de carga.
    this.isLoading = true;
    // Obtener valores del formulario
    this.bacthForm;
    let formValue: Lot = this.bacthForm.value;

    formValue = {
      cultivo_id: this.arrayCrop['crop'].cultivo_id,
      calidad_producto_id: formValue.calidad_producto_id,
      area_produccion: formValue.area_produccion,
      area_desarrollo: formValue.area_desarrollo,
      ton_hectarea: formValue.ton_hectarea,
      venta_estimada: formValue.venta_estimada,
      edad_lote: formValue.edad_lote,
      tipo_cultivo_id: formValue.tipo_cultivo_id,
      peso_ultima_cosecha: formValue.peso_ultima_cosecha,
      predio_exportador: formValue.predio_exportador,
      created_by: localStorage.getItem('username'),
      cosecha: this.dataSource,
    };

    this.subscription.add(
      // Enviar datos al servicio y obtener respuesta del servidor
      this.cropService.saveBatch(formValue).subscribe((res: LotResponse) => {
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
