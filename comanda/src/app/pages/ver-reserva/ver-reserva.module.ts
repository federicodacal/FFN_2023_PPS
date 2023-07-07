import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerReservaPageRoutingModule } from './ver-reserva-routing.module';

import { VerReservaPage } from './ver-reserva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerReservaPageRoutingModule
  ],
  declarations: [VerReservaPage]
})
export class VerReservaPageModule {}
