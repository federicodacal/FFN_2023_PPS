import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-listos-entregar',
  templateUrl: './listos-entregar.component.html',
  styleUrls: ['./listos-entregar.component.scss'],
})
export class ListosEntregarComponent  implements OnInit {

  pedidos: any[] = [];
  constructor(private bd: BaseService) { }

  ngOnInit() {
    this.bd.getPedidosTerminados().subscribe(pedidos => {
      this.pedidos = pedidos;
    })
  }


  entregarPedido(pedido: any){
    this.bd.updateEstadoPedido('entregado', pedido.id);
  }

}
