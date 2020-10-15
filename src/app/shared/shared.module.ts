import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatModule } from '../mat/mat.module';

import { RouterModule } from '@angular/router';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CreateInfoTecDialogComponent } from './components/create-info-tec-dialog/create-info-tec-dialog.component';
import { CreatePredioDialogComponent } from './components/create-predio-dialog/create-predio-dialog.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MenuListItemComponent,
    ConfirmDialogComponent,
    CreateInfoTecDialogComponent,
    CreatePredioDialogComponent,
  ],
  imports: [CommonModule, RouterModule, MatModule],
  exports: [HeaderComponent, FooterComponent, SidebarComponent],
})
export class SharedModule {}
