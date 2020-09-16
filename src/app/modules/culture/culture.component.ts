import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CropService } from 'src/app/services/culture/crop.service';
import { CreateCropDialogComponent } from 'src/app/shared/components/create-crop-dialog/create-crop-dialog.component';
import {
  CropResponse,
  CropType,
  CropTypeResponse,
  Culture,
  Harvest,
  ShowCrops,
} from '../../models/culture.interface';

@Component({
  selector: 'app-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss'],
})
export class CultureComponent implements OnInit, OnDestroy {
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();
  // Barra progresiva cargando.
  showProgressBar = false;
  // Columnas datatable cultivo
  displayedColumns: string[] = [
    'index',
    'predio',
    'productQuality',
    'product',
    'cropType',
    'cropAge',
    'actions',
  ];
  // Array cultivo
  CROP_DATA: ShowCrops[] = [];
  dataSource = this.CROP_DATA;

  constructor(
    private dialogCreateCrop: MatDialog,
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
    const dialog = this.dialogCreateCrop.open(CreateCropDialogComponent);

    dialog.afterClosed().subscribe((crop) => {});
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
