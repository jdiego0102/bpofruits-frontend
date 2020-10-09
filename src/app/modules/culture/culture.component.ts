import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CropService } from 'src/app/services/culture/crop.service';
import { CreateCropDialogComponent } from 'src/app/shared/components/create-crop-dialog/create-crop-dialog.component';
import { CropResponse, ShowCrops } from '../../models/culture.interface';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CreateLotDialogComponent } from 'src/app/shared/components/create-lot-dialog/create-lot-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirmDialog.interface';
import { CreateInfoTecDialogComponent } from 'src/app/shared/components/create-info-tec-dialog/create-info-tec-dialog.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CultureComponent implements OnInit, OnDestroy {
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Barra progresiva cargando.
  showProgressBar = false;

  // Columnas datatable cultivo
  displayedColumns: string[] = [];
  // Array cultivo
  CROP_DATA: ShowCrops[] = [];
  // dataSource = new MatTableDataSource<ShowCrops>(this.CROP_DATA);
  // Controlar columna al abrir detalle del cultivo para ver lotes.
  expandedElement: ShowCrops | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<ShowCrops>;

  isAdmin = null;

  constructor(
    private dialog: MatDialog,
    private cropService: CropService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.authService.isAdmin$.subscribe((res) => (this.isAdmin = res));

    this.onGetCrop();

    this.dataSource = new MatTableDataSource(this.CROP_DATA);
    this.ngAfterViewInit();
  }

  ngOnInit(): void {
    if (this.isAdmin == 1) {
      this.displayedColumns = [
        'Predio',
        'Producto',
        'Lotes',
        'Información Técnica',
        'Acciones',
      ];
    } else {
      this.displayedColumns = ['Predio', 'Producto', 'Lotes', 'Acciones'];
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Filtrar cultivos en el buscador
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remover espacios
    filterValue = filterValue.toLowerCase(); // La fuente de datos tiene como valor predeterminado coincidencias en minúsculas
    this.dataSource.filter = filterValue;
  }

  // Abrir diálogo crear cultivo
  openDialogCreateCrop(): void {
    const dialog = this.dialog.open(CreateCropDialogComponent);
    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((cropDialog) => {
      if (cropDialog == true || cropDialog == undefined) {
        this.onGetCrop();
      }
    });
  }

  // Abrir diálogo para crear lote y pasar parámetros del cultivo
  openDialogCreateLot(cropItem: ShowCrops): void {
    const dialog = this.dialog.open(CreateLotDialogComponent, {
      data: {
        crop: cropItem,
      },
    });
    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((cropDialog) => {
      if (cropDialog == true || cropDialog == undefined) {
        this.onGetCrop();
      }
    });
  }

  // Obtener datos del predio por usuario
  onGetCrop(): void {
    this.showProgressBar = true;
    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.cropService.getPredio().subscribe((res: CropResponse) => {
        if (res) {
          if (res.status == 'success') {
            this.dataSource = new MatTableDataSource(res.crops);
            this.ngAfterViewInit();
            // Refrescar datos de la tabla.
            // this.dataSource = [...this.dataSource];
            this.showProgressBar = false;
          } else {
            // Mostrar notificación
            this.toastr.warning(res.msg, res.title, {
              timeOut: 7000,
              progressBar: true,
            });
            this.showProgressBar = false;
          }
        }
      })
    );
  }

  // Eliminar cultivo por Id
  removeCrop(cropItem: ShowCrops): void {
    const message = `¿Estás seguro? Esta acción eliminará todo lo relacionado al cultivo...`;
    // Crear objeto para enviar al diálogo
    const dialogData = new ConfirmDialogModel(
      `Eliminar Cultivo de ${cropItem.producto}`,
      message
    );

    const dialog = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        // Obtener petición realizada por el servicio
        this.cropService
          .deleteCrop(cropItem.cultivo_id)
          .subscribe((res: CropResponse) => {
            if (res) {
              if (res.status == 'success') {
                // Mostrar notificación
                this.toastr.success(res.msg, res.title, {
                  timeOut: 7000,
                  progressBar: true,
                });
                // Refrescar datos de la tabla.
                this.onGetCrop();
              } else {
                // Mostrar notificación
                this.toastr.error(res.msg, res.title, {
                  timeOut: 7000,
                  progressBar: true,
                });
                this.showProgressBar = false;
              }
            }
          });
      }
    });
  }

  // Abrir diálogo para crear información del cultivo
  openDialogInfoTec(cropItem: ShowCrops): void {
    const dialog = this.dialog.open(CreateInfoTecDialogComponent, {
      data: {
        crop: cropItem,
      },
    });
    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((cropDialog) => {
      if (cropDialog == true || cropDialog == undefined) {
        this.onGetCrop();
      }
    });
  }

  // Abrir diálogo para ver/actualizar información del cultivo
  openDialogInfoTecEdit(cropItem: ShowCrops): void {
    const dialog = this.dialog.open(CreateInfoTecDialogComponent, {
      data: {
        crop: cropItem,
        cultivation_data: cropItem['datos_cultivo'],
      },
    });

    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((infoTecpDialog) => {
      if (infoTecpDialog == true || infoTecpDialog == undefined) {
        this.onGetCrop();
      }
    });
  }
}
