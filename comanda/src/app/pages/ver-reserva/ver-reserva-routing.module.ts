import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerReservaPage } from './ver-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: VerReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerReservaPageRoutingModule {}
