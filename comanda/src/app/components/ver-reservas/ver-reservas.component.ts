import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BaseService } from 'src/app/services/base.service';
import { MailService } from 'src/app/services/mail.service';

@Component({
  selector: 'app-ver-reservas',
  templateUrl: './ver-reservas.component.html',
  styleUrls: ['./ver-reservas.component.scss'],
})
export class VerReservasComponent  implements OnInit {

  reservas: any[] = [];
  usuarioReserva : any[] = [];
  mesas: any[] = []

  constructor(private bd: BaseService, private toastController: ToastController, private mailService: MailService) { }

  ngOnInit() {
    this.bd.getReservas().subscribe(reservas => {
      this.reservas = reservas;
    })
    this.bd.getMesas().subscribe(mesas => {
      mesas.forEach(m => {
        if(m.libre && !this.mesas.includes(m)){
          this.mesas.push(m);
        }
      });
    })
  }



  manejadorElegirMesa($event:any, reserva:any) {
    this.bd.getUsuario(reserva.uidCliente).then(usr => {
      let cliente = usr.data()!;
      let mesa = $event.target.value;
      console.log('cliente', cliente);
      console.log('mesa', mesa);
  
      if($event != null && cliente != null) {
        cliente.mesa = mesa.numero;
        cliente.estadoQrEspera = 'escaneado';
        this.bd.updateMesaUsuario(cliente);
        this.mailService.sendConfirmationEmailReserva(cliente);
        mesa.libre = false;
        this.bd.updateEstadoMesa(mesa);
        this.bd.updateReserva(reserva.id);
        this.presentToast('middle', `Mesa ${mesa.numero} asignada a cliente: ${cliente.nombre}`, 'success', 2000);
      }
    })
   
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
