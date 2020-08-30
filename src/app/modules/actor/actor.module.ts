import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActorComponent } from '../actor/actor.component';
import { MatModule } from '../../mat/mat.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ActorComponent],
  imports: [CommonModule, MatModule, RouterModule],
})
export class ActorModule {}
