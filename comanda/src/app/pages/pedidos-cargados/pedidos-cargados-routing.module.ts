import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosCargadosPage } from './pedidos-cargados.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosCargadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosCargadosPageRoutingModule {}
