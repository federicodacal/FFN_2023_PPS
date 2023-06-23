import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPedidosPageRoutingModule } from './ver-pedidos-routing.module';

import { VerPedidosPage } from './ver-pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPedidosPageRoutingModule
  ],
  declarations: [VerPedidosPage]
})
export class VerPedidosPageModule {}
