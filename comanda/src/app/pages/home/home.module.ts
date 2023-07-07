import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ConsultaComponent } from 'src/app/components/consulta/consulta.component';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { VerPedidosComponent } from 'src/app/components/ver-pedidos/ver-pedidos.component';
import { PedidosPagosComponent } from 'src/app/components/pedidos-pagos/pedidos-pagos.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ListosEntregarComponent } from 'src/app/components/listos-entregar/listos-entregar.component';
import { AltaMesaComponent } from 'src/app/components/alta-mesa/alta-mesa.component';
import { QRCodeModule } from 'angularx-qrcode';
import { VerReservasComponent } from 'src/app/components/ver-reservas/ver-reservas.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,    
    QRCodeModule 

  ],
  declarations: [HomePage, ConsultaComponent, MenuComponent, VerPedidosComponent, PedidosPagosComponent, 
    ListosEntregarComponent, AltaMesaComponent, VerReservasComponent]
})
export class HomePageModule {}
