import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CultureComponent } from './culture.component';
import { MatModule } from 'src/app/mat/mat.module';
import { RouterModule } from '@angular/router';
import { CreateCropDialogComponent } from '../../shared/components/create-crop-dialog/create-crop-dialog.component';
import { CreateLotDialogComponent } from 'src/app/shared/components/create-lot-dialog/create-lot-dialog.component';

@NgModule({
  declarations: [
    CultureComponent,
    CreateCropDialogComponent,
    CreateLotDialogComponent,
  ],
  imports: [CommonModule, MatModule, RouterModule],
  exports: [
    CultureComponent,
    CreateCropDialogComponent,
    CreateLotDialogComponent,
  ],
})
export class CultureModule {}
