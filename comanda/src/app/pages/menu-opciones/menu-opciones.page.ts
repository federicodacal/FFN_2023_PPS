import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
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

  constructor(private toastController : ToastController ,private bdFire : Firestore ,private bd: BaseService, private auth: AuthService, private barcodeScanner: BarcodeScanner) { 
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
    this.preguntarPorPropina = false;
    this.mostrarCuenta = true;
  }

  async scanQRMesa() {
      this.barcodeScanner.scan().then(data => {
        switch(data.text)
        {
          case 'excelente':
            this.propinas = (this.pedido.total * 0.2)
            this.subirPropinas();
          break;
          case 'muy-bueno':
            this.propinas = (this.pedido.total * 0.15)
            this.subirPropinas();
          break;
          case 'bueno':
            this.propinas = (this.pedido.total * 0.1)
            this.subirPropinas();
          break;
          case 'regular':
            this.propinas = (this.pedido.total * 0.05)
            this.subirPropinas();
          break;
          case 'malo':
            this.propinas = 0;
            this.subirPropinas();
          break;
          default:
            this.presentToast('bottom', 'QR invalido.', 'danger');
          break;
        }
      });
  }

  // eleccionPropina(eleccion : string){
  //   switch(eleccion){
  //     case 'excelente':
  //       this.propinas = (this.pedido.total * 0.2)
  //     break;
  //     case 'muy-bueno':
  //       this.propinas = (this.pedido.total * 0.15)
  //     break;
  //     case 'bueno':
  //       this.propinas = (this.pedido.total * 0.1)
  //     break;
  //     case 'regular':
  //       this.propinas = (this.pedido.total * 0.05)
  //     break;
  //     case 'malo':
  //       this.propinas = 0;
  //     break;
  //   }

  //   let nuevoTotal = this.pedido.total + this.propinas;
  //   const pedidoRef = doc(this.bdFire, 'pedidos', this.pedido.id);
  //   setDoc(pedidoRef, {
  //     propina: this.propinas,
  //     total: nuevoTotal,
  //     estadoPago: 'pagado'
  //   }, {merge: true})

  //   this.mostrarPropinas = false;
  //   this.mostrarCuenta = true;
  // }

  subirPropinas(){
    let nuevoTotal = this.pedido.total + this.propinas;
    const pedidoRef = doc(this.bdFire, 'pedidos', this.pedido.id);
    setDoc(pedidoRef, {
      propina: this.propinas,
      total: nuevoTotal,
      estadoPago: 'pagado'
    }, {merge: true});
    this.mostrarPropinas = true;
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msj:string, color: string, duration:number=1000) {
    const toast = await this.toastController.create({
      message: msj,
      duration: duration,
      position: position,
      color: color
    });

    await toast.present();
  }
}
