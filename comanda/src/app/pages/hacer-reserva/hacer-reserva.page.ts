import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PickerInteractionMode } from 'igniteui-angular';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
@Component({
  selector: 'app-hacer-reserva',
  templateUrl: './hacer-reserva.page.html',
  styleUrls: ['./hacer-reserva.page.scss']
})
export class HacerReservaPage implements OnInit {
  time: string = '';
  usuario: any = {};

  minimo: string;
  maximo: string;

  constructor(private bd: BaseService, private auth: AuthService, private toastController: ToastController, private router: Router,
    private pn: PushNotificationService) { 
    let fecha = new Date(Date.now());
    
    this.minimo = fecha.getFullYear().toString().padStart(2, '0') + '-' + fecha.getMonth().toString().padStart(2, '0') + '-' + 
    fecha.getDay().toString().padStart(2, '0') + 'T' + fecha.getHours().toString().padStart(2, '0') + 
    ':' + fecha.getMinutes().toString().padStart(2, '0');
    this.maximo = fecha.getFullYear().toString().padStart(2, '0') + '-' + fecha.getMonth().toString().padStart(2, '0') + '-' + fecha.getDay().toString().padStart(2, '0') + 'T23:59';
  }

  ngOnInit() {
    setTimeout(()=>{
  
      this.bd.getUsuario(this.auth.getUid()!)
      .then(usr => {
        this.usuario = usr.data()!;
      })
    },1000)


    setTimeout(()=>{
      console.log(this.usuario);
    },2000)
  }

  hacerReserva(){
    let tiempo = new Date(this.time);
    this.bd.addReserva({
      hora: tiempo.getHours()+ ':' + tiempo.getMinutes(),
      dia: (new Date(Date.now()).getMonth() + 1) + '/' + new Date(Date.now()).getDate() + '/' +  new Date(Date.now()).getFullYear(),
      cliente: this.usuario.nombre + ' ' + this.usuario.apellido,
      confirmada: false,
      uidCliente: this.auth.getUid()!
    }).then(() => {
      this.sendPush('Un cliente realizó una reserva.', 'Nueva reserva')
      this.presentToast('bottom', 'La solicitud de reserva se realizó con éxito', 'success')
      setTimeout(()=>{
        this.router.navigateByUrl('/home');
      },1500)
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


  sendPush(msj: string, tlt: string) {
    this.pn
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
          'cDpi2f59SvyRng9UzR9zaD:APA91bE2NGs1ThHvoYHKinSansPJ1_NIWkIipj8gBiGZdLpYiw0Sqstx-QTuilSvO3u3YfJ1_vC7BuOZQYO1u4YhwbIPbitvwdDFuH3j-x-X0uJGeB_H77rxp5mr4ohwHa5RM7GAe4gE'
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
}
