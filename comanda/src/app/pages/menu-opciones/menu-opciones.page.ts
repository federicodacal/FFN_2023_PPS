import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-menu-opciones',
  templateUrl: './menu-opciones.page.html',
  styleUrls: ['./menu-opciones.page.scss'],
})
export class MenuOpcionesPage implements OnInit {


  usuarioActual: any = {};
  pedido: any = {};

  constructor(private bd: BaseService, private auth: AuthService) { 
    this.pedido.estado = '...';
  }

  ngOnInit() {
    
    setTimeout(()=>{
      let uid = this.auth.getUid()!;
      this.bd.getUsuario(uid)
      .then(usr => {
        this.usuarioActual = usr
        this.usuarioActual.uid = uid;

        this.bd.getPedidoByClienteUidOrden(uid).subscribe(pedidos =>{
          this.pedido = pedidos[0];

        })
      });

    },2000)
  }

}
