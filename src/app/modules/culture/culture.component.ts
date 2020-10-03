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

  openDialogCreateCrop(): void {
    const dialog = this.dialog.open(CreateCropDialogComponent);

    dialog.afterClosed().subscribe((cropDialog) => {
      if (cropDialog == true || cropDialog == undefined) {
        this.onGetPredio();
      }
    });
  }

  openDialogCreateLot(cropItem: ShowCrops): void {
    const dialog = this.dialog.open(CreateLotDialogComponent, {
      data: {
        crop: cropItem,
      },
    });

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
}
