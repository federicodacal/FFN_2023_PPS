import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuOpcionesPageRoutingModule } from './menu-opciones-routing.module';

import { MenuOpcionesPage } from './menu-opciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuOpcionesPageRoutingModule
  ],
  declarations: [MenuOpcionesPage]
})
export class MenuOpcionesPageModule {}
