import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-ver-pedidos',
  templateUrl: './ver-pedidos.component.html',
  styleUrls: ['./ver-pedidos.component.scss'],
})
export class VerPedidosComponent  implements OnInit {

  pedidos: any;
  pedidosChef:any = {};
  pedidosBartender:any = {};

  constructor(private bd: BaseService, private bdFire : Firestore) { }

  ngOnInit() {
    this.pedidos = this.bd.getPedidos();
  }

  confirmarPedido(producto : any, uid : any, productoCompleto : any)
  {
    console.log(productoCompleto);
    let pdChef :any []=[];
    let pdBartender : any[]=[];

    producto.forEach((prod : any) => {
      if(prod.descripcion == "Trago")
      {
        pdBartender.push(prod);
        //Derivar a Bartender
      }
      else
      {
        pdChef.push(prod);
        //Derivar a Chef
      }
    });
    if(pdChef != null && pdChef.length > 0)
    {
      this.pedidosChef.pedido = pdChef;
      this.pedidosChef.uid_cliente = uid;
      this.bd.addPedidoChef(this.pedidosChef);
    }

    if(pdBartender != null && pdBartender.length > 0)
    {
      this.pedidosBartender.pedido = pdBartender;
      this.pedidosBartender.uid_cliente = uid;
      this.bd.addPedidoBartender(this.pedidosBartender);
    }

    const ref = doc(this.bdFire, 'pedidos', productoCompleto.id);
    setDoc(ref, {
      realizado: true
    }, {merge: true});

  }
}
