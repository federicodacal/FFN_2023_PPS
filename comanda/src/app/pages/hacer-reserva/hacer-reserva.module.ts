import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HacerReservaPageRoutingModule } from './hacer-reserva-routing.module';

import { HacerReservaPage } from './hacer-reserva.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HacerReservaPageRoutingModule,
   
    
  ],
  declarations: [HacerReservaPage]
})
export class HacerReservaPageModule {}
