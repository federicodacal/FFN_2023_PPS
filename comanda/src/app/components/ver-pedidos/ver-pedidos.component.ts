import { Component, Input, OnInit } from '@angular/core';
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

  @Input() queMuestro!:string;

  constructor(private bd: BaseService, private bdFire : Firestore) { }

  ngOnInit() {
    
    this.pedidos = this.bd.getPedidos();
    setTimeout(() => {
      console.log('los pedidos',this.pedidos);
    }, 100);

  }

  confirmarPedido(producto : any, uid : any, productoCompleto : any)
  {
    console.log(productoCompleto);
    let pdChef :any []=[];
    let pdBartender : any[]=[];

    let flagBartender:boolean=false;
    let flagChef:boolean=false;

    producto.forEach((prod : any) => {
      if(prod.descripcion == "Trago")
      {
        pdBartender.push(prod);
        //Derivar a Bartender
        flagBartender=true;
      }
      else
      {
        pdChef.push(prod);
        //Derivar a Chef
        flagChef=true;
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

    let terminoBartender:boolean=true;
    let terminoChef:boolean=false;
    if(!flagBartender) {
      terminoBartender = true;
    }

    if(!flagChef) {
      terminoChef = true;
    }

    const ref = doc(this.bdFire, 'pedidos', productoCompleto.id);
    setDoc(ref, {
      // 'a confirmar' todavia no fue confirmado por mozo
      // 'en proceso' fue confirmado por mozo
      // 'terminado' chef y bartender avisan que terminaron
      estado: 'en proceso',
      terminoBartender,
      terminoChef
    }, {merge: true});

  }
}
