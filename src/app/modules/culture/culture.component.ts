import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  displayedColumns: string[] = ['Predio', 'Producto', 'Acciones'];
  // Array cultivo
  CROP_DATA: ShowCrops[] = [];
  dataSource = this.CROP_DATA;
  // Controlar columna al abrir detalle del cultivo para ver lotes.
  expandedElement: ShowCrops | null;

  constructor(
    private dialog: MatDialog,
    private cropService: CropService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.onGetPredio();
  }

  // Destrucción de componente.
  // Terminar subcripción para evitar consumo de memoria.
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  // Abrir diálogo crear cultivo
  openDialogCreateCrop(): void {
    const dialog = this.dialog.open(CreateCropDialogComponent);
    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((cropDialog) => {
      if (cropDialog == true || cropDialog == undefined) {
        this.onGetPredio();
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
        this.onGetPredio();
      }
    });
  }

  // Obtener datos del predio por usuario
  onGetPredio(): void {
    this.showProgressBar = true;
    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.cropService.getPredio().subscribe((res: CropResponse) => {
        if (res) {
          if (res.status == 'success') {
            this.dataSource = res.crops;
            // Refrescar datos de la tabla.
            this.dataSource = [...this.dataSource];
            console.log(res);
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
                this.onGetPredio();
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
}
