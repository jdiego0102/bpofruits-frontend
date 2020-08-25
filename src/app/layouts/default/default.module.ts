import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PredioComponent } from '../../modules/predio/predio.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [DefaultComponent, DashboardComponent, PredioComponent],
  imports: [CommonModule, RouterModule, SharedModule, MatSidenavModule],
})
export class DefaultModule {}
