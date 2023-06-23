
import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { settings } from 'cluster';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pantalla = 'menu';
  pedido: any = {};
  precioTotal = 0;

  usuarioActual: any = {};

  productos: any[] = [];


  tiempoAprox = 0;

  uid: string = '';
  constructor(private bdFire : Firestore ,private bd: BaseService, private toastController: ToastController, private auth: AuthService) { 
    this.pedido.productos = [];
  }

  ngOnInit() {
  this.uid = this.auth.getUid()!;
  setTimeout(()=>{
    this.bd.getUsuario(this.uid)
    .then((usr) => {
      this.usuarioActual = usr.data()!;
      console.log(this.usuarioActual);
    });

    
  },2000)

  this.bd.getProductos().subscribe((prods)=>{
    prods.forEach(p => {
      p.cantidad = 0;
    });
    this.productos = prods;
  })
  }


  agregarPedido(p: any){
    p.precioSuma = p.precio * p.cantidad; 
    this.pedido.productos.push(p);
    this.precioTotal += p.precio * p.cantidad;
    this.presentToast('bottom', 'Se agregó al pedido', 'success');
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msj:string, color: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 1000,
      position: position,
      color: color
    });

    await toast.present();
  }


  hacerPedido(){
    this.pedido.cliente = this.usuarioActual.nombre
    this.pedido.hora = Date.now();
    this.pedido.estado = 'a confirmar';
    this.pedido.total = this.precioTotal;
    this.pedido.uid =  this.uid;
    console.log(this.pedido);
    this.bd.addPedido(this.pedido);

    //cambio el estado de la mesa. NO ES ASYNC, hay que salir y volver a entrar
    const usrRef = doc(this.bdFire, 'usuarios', this.uid)
    setDoc(usrRef, {
      estadoQrMesa: 'pedidoCargado'
    }, {merge: true});

    this.presentToast('middle', '¡Se cargó el pedido!', 'success');
    setTimeout(()=>{
      this.pantalla = 'menu';

    },1000)
  }


  irA(path: string){
    let tiempos: number[] = [];
    this.pedido.productos.forEach((p: any) => {
      tiempos.push(p.tiempo)
    });
    this.tiempoAprox = Math.max(...tiempos);
    this.pantalla = 'pedido';
  }

}
