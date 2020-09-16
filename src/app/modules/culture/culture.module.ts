import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CultureComponent } from './culture.component';
import { MatModule } from 'src/app/mat/mat.module';
import { RouterModule } from '@angular/router';
import { CreateCropDialogComponent } from '../../shared/components/create-crop-dialog/create-crop-dialog.component';

@NgModule({
  declarations: [CultureComponent, CreateCropDialogComponent],
  imports: [CommonModule, MatModule, RouterModule],
  exports: [CultureComponent, CreateCropDialogComponent],
})
export class CultureModule {}
