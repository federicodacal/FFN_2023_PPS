import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPedidosPage } from './ver-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: VerPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPedidosPageRoutingModule {}
