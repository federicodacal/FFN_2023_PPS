import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HacerReservaPage } from './hacer-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: HacerReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HacerReservaPageRoutingModule {}
