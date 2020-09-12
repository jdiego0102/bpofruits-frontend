import {
  Component,
  OnInit,
  Inject,
  TemplateRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CropType,
  CropTypeResponse,
  HarvestData,
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
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { map, startWith, tap } from 'rxjs/operators';

const HARVEST_DATA_EXAMPLE: HarvestData[] = [
  { date: '2020-09-28', quality: 'Label 1', tons: 1.0079 },
  { date: '2020-09-28', quality: 'Label 2', tons: 4.0026 },
  { date: '2020-09-28', quality: 'Label 3', tons: 6.941 },
];
@Component({
  selector: 'app-create-crop-dialog',
  templateUrl: './create-crop-dialog.component.html',
  styleUrls: ['./create-crop-dialog.component.scss'],
})
export class CreateCropDialogComponent implements OnInit, OnDestroy {
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Cargando predios
  showLoadingStates = false;
  // Cargando tipos de productos
  showLoadingProductTypes = false;
  // Cargando productos
  showLoadingProducts = false;
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
  // Producto seleccionado
  productSelected: Product;

  // Formulario
  cultureForm: FormGroup;

  displayedColumns: string[] = ['date', 'quality', 'tons'];
  dataSource = HARVEST_DATA_EXAMPLE;

  @Input() templateRef: TemplateRef<any>;
  constructor(
    public dialogRef: MatDialogRef<CreateCropDialogComponent>,
    private predioService: PredioService,
    private productService: ProductService,
    private cropService: CropService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.onGetStates();
    this.onGetProductTypes();
    this.onGetProductQuality();
    this.onGetCropType();

    // Obtener valores del formulario del cultivo y validaciones
    this.cultureForm = this.fb.group({
      predio_id: ['', [Validators.required]],
      tipo_producto_id: ['', [Validators.required]],
      producto_id: ['', [Validators.required]],
      variedad: ['', [Validators.required]],
      calidad_producto_id: ['', [Validators.required]],
      area_produccion: ['', [Validators.required]],
      area_desarrollo: ['', [Validators.required]],
      tipo_cultivo_id: ['', [Validators.required]],
      edad_cultivo: ['', [Validators.required]],
      ton_hectarea: ['', [Validators.required]],
      venta_estimada: ['', [Validators.required]],
      predio_exportador: ['', [Validators.required]],
      peso_ultima_cosecha: ['', [Validators.required]],
      fecha_esperada_cosecha: ['', [Validators.required]],
      ton_producidas: ['', [Validators.required]],
      calidad_producto_id_2: ['', [Validators.required]],
    });
    // Deshabilitar calidad_proucto (Cambia el valor con el select calidad_producto_id)
    this.cultureForm.controls['calidad_producto_id_2'].disable();
    // Deshabilitar variedad (Cambia al seleccionar la variedad)
    this.cultureForm.controls['variedad'].disable();
    // Deshabilitar variedad (Se activa al contrar datos de productos)
    this.cultureForm.controls['producto_id'].disable();

    // Obtener valor y cambios del departamento filtrado
    this.cultureForm.controls[
      'tipo_producto_id'
    ].valueChanges.subscribe((productId) => this.onGetProduct(productId));

    // Obtener valor y cambios del departamento filtrado
    this.filteredProducts = this.cultureForm
      .get('producto_id')
      .valueChanges.pipe(
        startWith(''),
        tap(() => console.log('tap')),
        map((value) => (typeof value === 'string' ? value : value.nombre)),
        map((nombre) =>
          nombre ? this._filterProducts(nombre) : this.products.slice()
        )
      );
  }

  // Filtrar departamentos
  private _filterProducts(value: string): Product[] {
    const filterValue = value.toString().toLowerCase();

    // Obtener el primer valor del filtro y asignarlo al objeto.
    this.productSelected = this.products.filter((option) =>
      option['nombre'].toLowerCase().includes(filterValue)
    )[0];

    this.cultureForm.controls['variedad'].setValue(
      this.productSelected.variedad
    );

    // Obtener ciudades por departamento filtrado
    // this.onGetCities(this.departmentSelect.departamento_id);
    return this.products.filter(
      (option) =>
        option['nombre'].toString().toLowerCase().indexOf(filterValue) === 0
    );
  }

  // Mostrar nombre del departamento seleccionado
  diplayPd(subjectProduct) {
    return subjectProduct ? subjectProduct.nombre : undefined;
  }

  onTest(): void {
    console.log(this.cultureForm);
  }

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // Obtener predios del usuario
  onGetStates(): void {
    this.showLoadingStates = true;
    // this.predioForm.controls['ciudad_id'].patchValue('');

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.predioService.getStates().subscribe((res: PredioResponse) => {
        if (res) {
          if (res.status == 'success') {
            this.states = res.states;

            this.showLoadingStates = false;
            // this.predioForm.controls['ciudad_id'].enable();
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

  // Obtener productos por tipo producto
  onGetProduct(productTypeId): void {
    this.showLoadingProducts = true;
    // this.predioForm.controls['ciudad_id'].patchValue('');

    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.productService
        .getProduct(productTypeId)
        .subscribe((res: ProductResponse) => {
          if (res) {
            if (res.status == 'success') {
              this.products = res.products;
              this.showLoadingProducts = false;
              this.cultureForm.controls['producto_id'].enable();
            } else {
              // Mostrar notificación
              this.toastr.error(res.msg, res.title, {
                timeOut: 7000,
                progressBar: true,
              });
              this.showLoadingProducts = false;
            }
          }
        })
    );
  }

  // Obtener tipos de productos
  onGetProductTypes(): void {
    this.showLoadingProductTypes = true;
    // this.predioForm.controls['ciudad_id'].patchValue('');

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
    // this.predioForm.controls['ciudad_id'].patchValue('');

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

  // Método para validar errores y retornar el mensaje con el mismo
  getErrorMessage(field: string): string {
    let message = '';
    // Campo requerido
    if (this.cultureForm.get(field).errors?.required) {
      message = 'El campo es requerido.';
    }
    return message;
  }

  // Método validar acciones con el campo de texto
  isValidField(field: string): boolean {
    return (
      (this.cultureForm.get(field).touched ||
        this.cultureForm.get(field).dirty) &&
      !this.cultureForm.get(field).valid
    );
  }

  onSaveCrop(): void {}
}
