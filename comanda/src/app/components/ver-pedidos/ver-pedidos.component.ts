import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-ver-pedidos',
  templateUrl: './ver-pedidos.component.html',
  styleUrls: ['./ver-pedidos.component.scss'],
})
export class VerPedidosComponent  implements OnInit {

  pedidos: any;

  constructor(private bd: BaseService) { }

  ngOnInit() {
    this.pedidos = this.bd.getPedidos();
  }

}
