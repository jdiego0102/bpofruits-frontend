import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatModule } from '../mat/mat.module';

import { RouterModule } from '@angular/router';
import { CreateCropDialogComponent } from './components/create-crop-dialog/create-crop-dialog.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SidebarComponent, CreateCropDialogComponent],
  imports: [CommonModule, RouterModule, MatModule],
  exports: [HeaderComponent, FooterComponent, SidebarComponent],
})
export class SharedModule {}
