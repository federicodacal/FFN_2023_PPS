import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaPlatoPageRoutingModule } from './alta-plato-routing.module';

import { AltaPlatoPage } from './alta-plato.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaPlatoPageRoutingModule
  ],
  declarations: [AltaPlatoPage]
})
export class AltaPlatoPageModule {}
