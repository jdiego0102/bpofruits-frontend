import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CultureComponent } from './culture.component';
import { MatModule } from 'src/app/mat/mat.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CultureComponent],
  imports: [CommonModule, MatModule, RouterModule],
})
export class CultureModule {}
