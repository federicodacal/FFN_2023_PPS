import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, firstValueFrom, subscribeOn } from 'rxjs';
import { MailService } from 'src/app/services/mail.service';
import { Auth } from '@angular/fire/auth';
import { UserActivoService } from 'src/app/services/user-activo.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

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

  consultaSeleccionada: any = {};

  consultas: any;

  constructor(private userActivo : UserActivoService, private bd: BaseService, private auth: AuthService, private mail:MailService, private authFire : Auth, private barcodeScanner: BarcodeScanner, private toastController:ToastController) {}

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

          /*
          setTimeout(() => {
            this.presentToast("middle", `Usuario - ${this.usuario.correo} - Espera mesa: ${this.usuario.esperaMesa}`, 'warning', 2000)
          }, 3000);
          */

        //mesa asignada y qr de mesa
        if(this.usuario.mesa > 0 && data == 'listadoProductos' && this.usuario.estadoQrMesa == 'ninguno')
        {
          this.pantalla = 'hacerPedido';
        }

        if(data == 'listadoProductos' && this.usuario.estadoQrMesa == 'pedidoCargado')
        {
          //falta general el qr con un text 'listadoProductos' y el nuevo componente con lo de encuestas y estado pedido
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

      this.presentToast('middle', `Mesa ${mesa.numero} asignada a cliente: ${cliente.correo}`, 'success');
    }
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
  
}
