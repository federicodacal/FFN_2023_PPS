import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosCargadosPageRoutingModule } from './pedidos-cargados-routing.module';

import { PedidosCargadosPage } from './pedidos-cargados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosCargadosPageRoutingModule
  ],
  declarations: [PedidosCargadosPage]
})
export class PedidosCargadosPageModule {}
