import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
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
  mostrarCuenta : boolean = false;
  propinas : number = 0;
  preguntarPorPropina : boolean = false;
  mostrarPropinas: boolean = false;
  encuesta = false;

  constructor(private bdFire : Firestore ,private bd: BaseService, private auth: AuthService, private barcodeScanner: BarcodeScanner) { 
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

    },1000)
  }

  productos(){
    console.log(this.pedido);
    this.pedido.productos.forEach((prod: any) => {
      console.log(prod);
    });
    this.preguntarPorPropina = true;
  }

  async scanQRMesa() {
      this.barcodeScanner.scan().then(data => {
        console.log(data);
        if(data.text == 'mostrarPropinas')
        {
          this.preguntarPorPropina = false;
          this.mostrarPropinas = true;
        }
        else
        {
          //hacerlo toast
          console.log("QR invalido");
        }
      });
  }

  pruebaQR(){
    let data ='mostrarPropinas';
    let prueba = 'mostrarPropinas';
    if(data == prueba)
    {
      this.preguntarPorPropina = false;
      this.mostrarPropinas = true;
    }
  }

  eleccionPropina(eleccion : string){
    switch(eleccion){
      case 'excelente':
        this.propinas = (this.pedido.total * 0.2)
      break;
      case 'muy-bueno':
        this.propinas = (this.pedido.total * 0.15)
      break;
      case 'bueno':
        this.propinas = (this.pedido.total * 0.1)
      break;
      case 'regular':
        this.propinas = (this.pedido.total * 0.05)
      break;
      case 'malo':
        this.propinas = 0;
      break;
    }

    let nuevoTotal = this.pedido.total + this.propinas;
    const pedidoRef = doc(this.bdFire, 'pedidos', this.pedido.id);
    setDoc(pedidoRef, {
      propina: this.propinas,
      total: nuevoTotal,
      estadoPago: 'pagado'
    }, {merge: true})

    this.mostrarPropinas = false;
    this.mostrarCuenta = true;
  }

}
