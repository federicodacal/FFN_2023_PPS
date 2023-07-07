import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, firstValueFrom, map, subscribeOn } from 'rxjs';
import { MailService } from 'src/app/services/mail.service';
import { Auth } from '@angular/fire/auth';
import { UserActivoService } from 'src/app/services/user-activo.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { Console } from 'console';

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

  audio = true;


  reservas: any[] = [];

  constructor(private userActivo : UserActivoService, private bd: BaseService, private auth: AuthService, private mail:MailService, 
    private authFire : Auth, private barcodeScanner: BarcodeScanner, private toastController:ToastController, private router:Router, 
    private fs:Firestore, private pn: PushNotificationService) {}

  ngOnInit(){
    this.pn.getUser();
    this.pantalla = 'inicio';
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


    this.bd.getReservas().subscribe(reservas => {
      reservas.forEach(r => {
        this.bd.getUsuario(r.uidCliente).then(usr => {
          console.log('Rompe?')
          let fecha = new Date(r.dia +',' + r.hora)
          console.log(fecha)
          console.log(this.calcularDiferenciaReservaParametro(fecha))
          if(this.calcularDiferenciaReservaParametro(fecha) > 2){
            this.bd.caducarTiempoReserva(r.id, usr);
          }
          console.log('NO')

        })
      });
    })


    if(this.userActivo.uActivo == "")
    {

      this.bd.getReservasUid(this.auth.getUid()!).subscribe(reservas => {
        this.reservas = reservas;

        if(reservas.length != 0){
          let testHora = new Date('2023/5/4, 8:30')
          console.log(testHora);


          //ARREGLAR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          /*let horaActual = new Date('7/7/2023, ' + new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes())
          let horaReserva = new Date(this.reservas[0].dia +',' +this.reservas[0].hora)
          console.log(horaActual);
          console.log(horaReserva);
          let diferencia = (horaActual.getTime() - horaReserva.getTime()) / 1000;
          diferencia /= 60;
          let dif = Math.abs(Math.round(diferencia));*/
          //console.log(dif)

          if((this.calcularDiferenciaReserva() > 2 && this.reservas[0].confirmada)){
            this.bd.caducarTiempoReserva(this.reservas[0].id, this.usuario);
          }
        }
        
      })

      console.log(this.auth.getUid()!);
      
      this.bd.getUsuarioCollection(this.auth.getUid()!).subscribe((response) => {
          this.usuario = response[0];
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
        //.catch(error => console.log(error));
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



  calcularDiferenciaReserva(){
    //let horaActual = new Date('7/7/2023, ' + new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes())
    let horaActual = new Date(Date.now())
    let horaReserva = new Date(this.reservas[0].dia +',' +this.reservas[0].hora)

    console.log(horaActual);
    console.log(horaReserva);
    let diferencia = (horaActual.getTime() - horaReserva.getTime()) / 1000;
    diferencia /= 60;
    return diferencia;
  }


  irA(path: string){
    console.log(path);
    this.pantalla = path;
  }


  redirect(path: string){
    this.router.navigate([path], {replaceUrl: true});
  }

  //TEST PUSH NOTIF
  sendPush(msj: string, tlt: string) {
    this.pn
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
          'cBSDGcohSXiAPoeeq1MpnI:APA91bHHcJUEO3vc09FmBfa3EHmsDn-i1MYIUBiQYESbcd9pJzk5KV3ZQH21xY4vqT-Fz-oxEdlWb6c8hXCrY8iICHrGKp5OUIEnJeI-ZEan4u5ak_KREW4XyvtFVA1uNyq6MWyCunRh'
        ],
        notification: {
          title: tlt,
          body: msj,
        },
      })
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  ///////////////////////













  calcularDiferenciaReservaParametro(horaReserva: Date){
    //let horaActual = new Date('7/7/2023, ' + new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes())
    let horaActual = new Date(Date.now())

    console.log(horaActual);
    console.log(horaReserva);
    let diferencia = (horaActual.getTime() - horaReserva.getTime()) / 1000;
    diferencia /= 60;
    console.log(diferencia)
    return diferencia;
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
        //data = 'listadoDeEsperaMesa'

        
          if(data == 'listadoDeEsperaMesa') {
            if(this.reservas.length == 0){
              if(this.usuario.estadoQrEspera == 'escaneado') {
                if(this.usuario.completoEncuesta == false){
                  this.presentToast('bottom', 'Todavía no completó la encuesta', 'warning')
                }
                else{
                  this.sendPush('¡Estoy esperando!', this.usuario.nombre);
                  this.router.navigateByUrl('/encuesta');
                }
              }
              if(this.usuario.estadoQrEspera == undefined) {
                this.usuario.mesa = 0;
                this.usuario.estadoQrEspera = 'escaneado'
                this.bd.updateMesaUsuario(this.usuario);
                this.presentToast("middle", 'Pronto se te asignará una mesa. Gracias!', 'success', 2000);
              }
       
           }
           else{
            this.presentToast("middle", 'Ya hizo una reserva.', 'warning', 2000);
           }
      
          

        }
        //asignar estadoQrMesa a ninguno

        //data = 'listadoProductos';
        //mesa asignada y qr de mesa
        /*let horaActual = new Date(new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes())
        let horaReserva = new Date(new Date(this.reservas[0].hora))
        let diferencia = (horaActual.getTime() - horaReserva.getTime()) / 1000;
        diferencia /= 60;
        let dif = Math.abs(Math.round(diferencia));*/

        let horaActual = new Date(Date.now())
        let horaReserva = new Date(this.reservas[0].dia +',' +this.reservas[0].hora)

        //A PROBAR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          if(this.usuario.mesa > 0 && ''+this.usuario.mesa == data && /*data == 'listadoProductos' &&*/ this.usuario.estadoQrMesa == 'ninguno')
          {
            if(this.reservas.length == 0){
              this.pantalla = 'hacerPedido';
            }
            else if(this.calcularDiferenciaReserva() > 2 && this.reservas[0].confirmada){
              this.presentToast('bottom', 'Se pasó el tiempo de espera tolerado.', 'danger');
              this.bd.caducarTiempoReserva(this.reservas[0].id, this.usuario);
            }
            else if(horaActual >= horaReserva && !this.reservas[0].confirmada){
              this.presentToast('bottom', 'La reserva no se confirmó.', 'danger');
              this.bd.caducarTiempoReserva(this.reservas[0].id, this.usuario);
            }
            else if(horaActual <= horaReserva){
              this.presentToast('bottom', 'Todavía no es la hora.', 'warning');
            }
            else{
              this.pantalla = 'hacerPedido';

            }
          }
        
        if(this.usuario.mesa == -1 && ''+this.usuario.mesa == data){
          this.presentToast('bottom', 'No tiene una mesa asignada', 'warning');
        }


        if(this.usuario.mesa > 0 && ''+this.usuario.mesa != data){
          this.presentToast('bottom', 'Este QR no pertence a tu mesa.', 'danger');

        }
        /*
        this.bd.getPedidoByClienteUid(this.usuario.uid).then((res:any) => {
          this.pedidoClienteLogeado = res;
          console.log('cliente tiene pedido', this.pedidoClienteLogeado);
        });
        */

        if(''+this.usuario.mesa == data && this.usuario.estadoQrMesa == 'pedidoCargado')
        {
          
          // Para debug desde celu, despues sacar
          /*setTimeout(() => {
            this.presentToast("middle", `Usuario - ${this.usuario.correo} - Cliente: ${this.pedidoClienteLogeado.cliente} - Precio: $${this.pedidoClienteLogeado.total}`, 'warning', 5000)
          }, 200);*/
          this.router.navigateByUrl('menu-opciones')
          //this.pantalla = 'encuesta-y-estado';
          
        }
      });
  }

  testScanQRMesa(test: string){
    let data = test;

      console.log('usuario bd', this.usuario);
      //data = 'listadoDeEsperaMesa'
      if(data == 'listadoDeEsperaMesa') {
        if(this.usuario.estadoQrEspera == 'escaneado') {
          if(this.usuario.completoEncuesta == false){
            this.presentToast('bottom', 'Todavía no completó la encuesta', 'warning')
          }
          else{
            this.sendPush('¡Estoy esperando!', this.usuario.nombre);
            this.router.navigateByUrl('/encuesta');
          }
        }
        if(this.usuario.estadoQrEspera == undefined) {
          this.usuario.mesa = 0;
          this.usuario.estadoQrEspera = 'escaneado'
          this.bd.updateMesaUsuario(this.usuario);
          this.presentToast("middle", 'Pronto se te asignará una mesa. Gracias!', 'success', 2000);
        }
        

      }
      //asignar estadoQrMesa a ninguno

      //data = 'listadoProductos';
      //mesa asignada y qr de mesa
      /*if(this.usuario.mesa > 0 && ''+this.usuario.mesa == data && this.usuario.estadoQrMesa == 'ninguno')
      {
        this.pantalla = 'hacerPedido';
        //this.router.navigateByUrl('/menu')
      }*/

      let horaActual = new Date(Date.now())
      console.log(new Date(this.reservas[0].dia))
      let horaReserva = new Date(this.reservas[0].dia +',' +this.reservas[0].hora)
      console.log(horaActual)
      console.log(horaReserva)
        //A PROBAR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          if(this.usuario.mesa > 0 && ''+this.usuario.mesa == data && /*data == 'listadoProductos' &&*/ this.usuario.estadoQrMesa == 'ninguno')
          {
            if(this.reservas.length == 0){
              this.pantalla = 'hacerPedido';
            }
            else if(this.calcularDiferenciaReserva() > 2 && this.reservas[0].confirmada){
              this.presentToast('bottom', 'Se pasó el tiempo de espera tolerado.', 'danger');
              this.bd.caducarTiempoReserva(this.reservas[0].id, this.usuario);
            }
            
            console.log(horaActual >= horaReserva)
           
            if(horaActual <= horaReserva){
              this.presentToast('bottom', 'Todavía no es la hora.', 'warning');
            }
            if(horaActual >= horaReserva && this.calcularDiferenciaReserva() <= 2){
              this.pantalla = 'hacerPedido';

            }
          }

          if(horaActual <= horaReserva){
            this.presentToast('bottom', 'Todavía no es la hora.', 'warning');
          }

          if(horaActual >= horaReserva && this.usuario.mesa == -1){
            this.presentToast('bottom', 'La reserva no se confirmó.', 'danger');
            this.bd.caducarTiempoReserva(this.reservas[0].id, this.usuario);
          }





      if(this.usuario.mesa == -1 && ''+this.usuario.mesa == data){
        this.presentToast('bottom', 'La mesa se encuentra libre', 'warning');
      }

      if(this.usuario.mesa > 0 && ''+this.usuario.mesa != data){
        this.presentToast('middle', 'Este QR no pertence a tu mesa.', 'danger');

      }

      /*
      this.bd.getPedidoByClienteUid(this.usuario.uid).then((res:any) => {
        this.pedidoClienteLogeado = res;
        console.log('cliente tiene pedido', this.pedidoClienteLogeado);
      });
      */

      if(''+this.usuario.mesa == data && this.usuario.estadoQrMesa == 'pedidoCargado')
      {
        
        // Para debug desde celu, despues sacar
        /*setTimeout(() => {
          this.presentToast("middle", `Usuario - ${this.usuario.correo} - Cliente: ${this.pedidoClienteLogeado.cliente} - Precio: $${this.pedidoClienteLogeado.total}`, 'warning', 5000)
        }, 200);*/
        this.router.navigateByUrl('menu-opciones')
        //this.pantalla = 'encuesta-y-estado';
        
      }
    
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

      this.presentToast('middle', `Mesa ${mesa.numero} asignada a cliente: ${cliente.nombre}`, 'success', 2000);
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

      this.sendPush('Pedido confirmado', 'Chef')
    }
    
    // confirma bartender
    if(this.usuario.perfil == 'bartender') {
      this.sendPush('Pedido confirmado', 'Bartender')
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

  altaPlato(){
    this.router.navigate(['/alta-plato']);
  }

  altaBebida() {
    this.router.navigate(['/alta-bebida'])
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


  irAltaMesa(){
    this.router.navigateByUrl('/alta-mesa');

  }



  confirmarPedido(){
    let pedido: any;
    this.bd.getPedidoByClienteUidOrden(this.usuario.uid).subscribe((pedidos) =>{
      pedido = pedidos[0]
      console.log('TEST SUSCRIBE')

    })
    setTimeout(()=>{
      console.log('TEST TIMEOUT')
      this.bd.updateEstadoPedido('confirmado', pedido.id)
      .then(res => this.presentToast('middle', 'Se confirmó la recepción del pedido', 'success'));
    },2000)
  }
  
}
