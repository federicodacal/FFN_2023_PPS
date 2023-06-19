import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, firstValueFrom, map, subscribeOn } from 'rxjs';
import { MailService } from 'src/app/services/mail.service';
import { Auth } from '@angular/fire/auth';
import { UserActivoService } from 'src/app/services/user-activo.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  pantalla = 'inicio';

  usuario: any = {};
  usuarios: any[] = [];
  mesas: any[] = [];
  pedidos: any;

  pedidoClienteLogeado:any = {};

  consultaSeleccionada: any = {};

  consultas: any;

  pedidosGeneral:any [] = [];

  constructor(private userActivo : UserActivoService, private bd: BaseService, private auth: AuthService, private mail:MailService, private authFire : Auth, private barcodeScanner: BarcodeScanner, private toastController:ToastController, private router:Router, private fs:Firestore) {}

  ngOnInit(){
    //No me funciona, tira undefined 
    // Promise.all([
    //   firstValueFrom( this.bd.getUsuariosGeneral())
    // ]).then((usrs) => {
    //   this.usuarios = usrs;
    // });

    //Con esta anduvo att:Nico
    this.consultas = this.bd.getDatosConsulta()/*.subscribe((data) =>{*/
      /*console.log(data);
      this.consultas = data; */
     
     /* console.log(data);
      data.forEach(d => {
        this.bd.getConsulta(d.id).subscribe((res)=>{
          if(res.length != 0){
            res[0].nombre = d.nombre;

            console.log(res[0])
            this.consultas.push(res[0]);
          }
          
        })
      });
     
    })*/


    this.bd.getUsuariosGeneral().subscribe((data) => {
      this.usuarios = data  
     
      
     
     
     
     /* data.forEach(usr => {
        this.bd.getConsulta(usr.uid).subscribe((res)=>{
          if(res.length != 0){
            this.consultas.push(res[0]);

          }
          
        })
        
      });*/
    });

    if(this.userActivo.uActivo == "")
    {
      console.log(this.auth.getUid()!);
      
      this.bd.getUsuario(this.auth.getUid()!)
        .then((response) => {
          this.usuario = response.data();
          this.usuario.uid = this.auth.getUid();

          // Si es metre cargo mesas
          if(this.usuario.perfil == 'metre') {
            this.bd.getMesas().subscribe((res) => {
              this.mesas = res;
            });
          }

          //cargo pedidos general 
          if(this.usuario.perfil == 'chef' || this.usuario.perfil == 'bartender') {
            this.bd.getPedidos().subscribe((res:any) => {
              this.pedidosGeneral = res;
              console.log('pedidos general', this.pedidosGeneral);
            });
          }

          //Si es chef cargo pedidos
          if(this.usuario.perfil == 'chef') {
            this.bd.getPedidosChef().subscribe((ped)=>{
              console.log(ped);
              this.pedidos = ped;
            })
          }

          if(this.usuario.perfil == 'bartender')
          {
            this.bd.getPedidosBartender().subscribe((ped)=>{
              console.log(ped);
              this.pedidos = ped;
            })
          }

          // Si es cliente y qrMesa es pedidoCargado me fijo el pedido
          if((this.usuario.perfil == 'cliente' || this.usuario.perfil == 'anonimo') && this.usuario.estadoQrMesa == 'pedidoCargado') {

            setTimeout(() => {
              this.bd.getPedidoByClienteUid(this.usuario.uid).subscribe((res:any) => {
                console.log('usuario', this.usuario);
                console.log('res', res);
                this.pedidoClienteLogeado = res[0];
                console.log('cliente tiene pedido', this.pedidoClienteLogeado);
              });
            }, 1000);
          } 
         
        })
        .catch(error => console.log(error));
      console.log(this.auth.getUid()!);
      console.log(this.authFire.currentUser);

      // Para Debug QR Mesa
      /*
      setTimeout(() => {
        this.presentToast("middle", `Usuario - ${this.usuario.correo} - UID: ${this.usuario.uid} - Espera mesa: ${this.usuario.esperaMesa}`, 'warning', 2000);
        console.log('usuario', this.usuario);
      }, 1000);
      */
 
    }
    else
    {
      this.authFire.signOut();
      this.usuario = this.userActivo.uActivo;
    }
  }


/************************* SUPERVISOR RECHAZA/ACEPTA CLIENTE **********************************************/
  rechazarCliente(user:any) {
    console.log(user);
    if(user != null) {
      user.estadoUsuario = -1;
      this.bd.updateEstadoUsario(user);
      this.mail.sendConfirmationEmail(user);
    }
  }
  
  aceptarCliente(user:any) {
    console.log(user);
    if(user != null) {
      user.estadoUsuario = 1;
      this.bd.updateEstadoUsario(user);
      this.mail.sendConfirmationEmail(user);
    }
  }

  perfil()
  {
    console.log(this.usuario);
    console.log(this.authFire.currentUser);
  }

  /************************ QR MESA *************************/
  async scanQRMesa() {
    let data = "";
      this.barcodeScanner.scan().then(barcodeData => {
        data = barcodeData.text;

        console.log('usuario bd', this.usuario);
      
        if(data == 'listadoDeEsperaMesa') {
          this.usuario.mesa = 0;
          this.bd.updateMesaUsuario(this.usuario);
          this.presentToast("middle", 'Pronto se te asignará una mesa. Gracias!', 'success', 2000);
        }
        //asignar estadoQrMesa a ninguno


        //mesa asignada y qr de mesa
        if(this.usuario.mesa > 0 && data == 'listadoProductos' && this.usuario.estadoQrMesa == 'ninguno')
        {
          this.pantalla = 'hacerPedido';
        }

        /*
        this.bd.getPedidoByClienteUid(this.usuario.uid).then((res:any) => {
          this.pedidoClienteLogeado = res;
          console.log('cliente tiene pedido', this.pedidoClienteLogeado);
        });
        */

        if(data == 'listadoProductos' && this.usuario.estadoQrMesa == 'pedidoCargado')
        {
          
          // Para debug desde celu, despues sacar
          setTimeout(() => {
            this.presentToast("middle", `Usuario - ${this.usuario.correo} - Cliente: ${this.pedidoClienteLogeado.cliente} - Precio: $${this.pedidoClienteLogeado.total}`, 'warning', 5000)
          }, 200);

          this.pantalla = 'encuesta-y-estado';
          
        }
      });
  }

  /************************* METRE ASIGNA MESA *********************/
  rechazarPedidoMesa(cliente:any) {
    console.log(cliente);
    if(cliente != null) {
      cliente.mesa = -1;
      this.bd.updateMesaUsuario(cliente);
    } 
  }

  manejadorElegirMesa($event:any, cliente:any) {
    let mesa = $event.target.value;
    console.log('cliente', cliente);
    console.log('mesa', mesa);

    if($event != null && cliente != null) {
      cliente.mesa = mesa.numero;
      this.bd.updateMesaUsuario(cliente);

      mesa.libre = false;
      this.bd.updateEstadoMesa(mesa);

      this.presentToast('middle', `Mesa ${mesa.numero} asignada a cliente: ${cliente.correo}`, 'success', 2000);
    }
  }

  /***************************** CHEF/BARTENDER ****************************************************/
  confirmarPedidoTerminado(idPedEmp:any, uidCliente:any) {

    let pedido:any= {};

    console.log('id cliente : ' + uidCliente + ' idPed ' + idPedEmp);
    let idPedido:string='';

    this.bd.getPedidoByClienteUid(uidCliente).subscribe((res:any) => {
      //console.log(res);
      console.log(res[0]);
      pedido = res[0];
      idPedido = res[0].id;
    });

    setTimeout(async () => {
      console.log('idPedido', idPedido); 

    
    // confirma chef
    if(this.usuario.perfil == 'chef') {
      
      console.log('hola 2');
      const ref = doc(this.fs, 'pedidos', idPedido);
      await updateDoc(ref, {terminoChef: true});
      
      console.log('hola 3');
      this.bd.deletePedidoFromChef(idPedEmp);
    }
    
    // confirma bartender
    if(this.usuario.perfil == 'bartender') {

      const ref = doc(this.fs, 'pedidos', idPedido);
      await updateDoc(ref, {
        terminoBartender: true
      });

      this.bd.deletePedidoFromBartender(idPedEmp);
    }


    if(pedido.terminoBartender && pedido.terminoChef) {
      const ref = doc(this.fs, 'pedidos', idPedido);
        await updateDoc(ref, {
          estado: 'terminado'
      });
    }
      
    }, 1000);
    
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

  verListado(){

  }


  consultar(){
    this.pantalla = 'consulta';
    
  }

  redirigirAEncuesta() {
    this.router.navigateByUrl('/encuesta');
  }
  
}
