import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/models/confirmDialog.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  Predio,
  PredioResponse,
  States,
} from 'src/app/models/predio.interface';
import { PredioService } from 'src/app/services/predio/predio.service';
import { CreatePredioDialogComponent } from 'src/app/shared/components/create-predio-dialog/create-predio-dialog.component';

@Component({
  selector: 'app-predio',
  templateUrl: './predio.component.html',
  styleUrls: ['./predio.component.scss'],
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
export class PredioComponent implements OnInit, OnDestroy {
  // Controlar subscripciones y se debe inicializar
  private subscription: Subscription = new Subscription();

  // Barra progresiva cargando.
  showProgressBar = false;

  // Columnas datatable predio
  displayedColumns: string[] = [];
  // Array predio
  PREDIO_DATA: States[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<States>;

  isAdmin = null;

  constructor(
    private dialog: MatDialog,
    private predioService: PredioService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.authService.isAdmin$.subscribe((res) => (this.isAdmin = res));

    this.dataSource = new MatTableDataSource(this.PREDIO_DATA);
    this.ngAfterViewInit();
  }

  ngOnInit(): void {
    this.onGetPredios();

    if (this.isAdmin == 1) {
      this.displayedColumns = [
        'Nombre Predio',
        'Propietario',
        'N° Documento',
        'Departamento',
        'Ciudad',
        'Vereda',
        'Acciones',
      ];
    } else {
      this.displayedColumns = [
        'Nombre Predio',
        'Propietario',
        'Departamento',
        'Ciudad',
        'Vereda',
        'Acciones',
      ];
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

  // Filtrar predios en el buscador
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remover espacios
    filterValue = filterValue.toLowerCase(); // La fuente de datos tiene como valor predeterminado coincidencias en minúsculas
    this.dataSource.filter = filterValue;
  }

  // Abrir diálogo crear predio
  openDialogCreatePredio(): void {
    const dialog = this.dialog.open(CreatePredioDialogComponent);
    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((cropDialog) => {
      if (cropDialog == true || cropDialog == undefined) {
        // this.onGetCrop();
      }
    });
  }

  // Obtener predios por usuario
  onGetPredios(): void {
    this.showProgressBar = true;
    this.subscription.add(
      // Obtener petición realizada por el servicio
      this.predioService.getPredio().subscribe((res: PredioResponse) => {
        if (res) {
          if (res.status == 'success') {
            this.dataSource = new MatTableDataSource(res.states);
            this.ngAfterViewInit();

            this.showProgressBar = false;
          } else {
            // Mostrar notificación
            this.toastr.warning(res.msg, res.title, {
              timeOut: 7000,
              progressBar: true,
            });
            this.showProgressBar = false;

            // this.onGetDepartments();
          }
        }
      })
    );
  }

  // Eliminar predio por Id
  removePredio(predioItem: States): void {
    const message = `¿Estás seguro? Esta acción eliminará todo lo relacionado al predio...`;
    // Crear objeto para enviar al diálogo
    const dialogData = new ConfirmDialogModel(`Eliminar Predio`, message);

    const dialog = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        // Obtener petición realizada por el servicio
        this.predioService
          .deletePredio(predioItem.predio_id)
          .subscribe((res: PredioResponse) => {
            if (res) {
              if (res.status == 'success') {
                // Mostrar notificación
                this.toastr.success(res.msg, res.title, {
                  timeOut: 7000,
                  progressBar: true,
                });
                // Refrescar datos de la tabla.
                this.onGetPredios();
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

  // Abrir diálogo para ver/actualizar información del cultivo
  openDialogShowPredio(predioItem: States): void {
    const dialog = this.dialog.open(CreatePredioDialogComponent, {
      data: {
        predio: predioItem,
      },
    });

    // Recibir respuesta al evento de cerrar diálogo
    dialog.afterClosed().subscribe((infoTecpDialog) => {
      if (infoTecpDialog == true || infoTecpDialog == undefined) {
        this.onGetPredios();
      }
    });
  }
}
