import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';


@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
})
export class ConsultaComponent  implements OnInit {

  @ViewChild('endOfChat') endOfChat: ElementRef | undefined;
 
  @Input() usuarioRecibido?:any | undefined;

  @Input() audio?:any | undefined;

  texto = "";
  uidUsr = "";

  consultas: any;
  usuario: any; 

  constructor(private bd: BaseService, private auth: AuthService, private pn: PushNotificationService) { }

  ngOnInit(){
    console.log('TEST CHAT')
    this.uidUsr = this.auth.getUid()!
    setTimeout(()=>{
      this.bd.getUsuario(this.uidUsr) 
      .then((usr)=>{
      console.log(usr);

        if(this.usuarioRecibido == undefined){
          this.bd.crearConsulta(this.uidUsr, usr.data()!);
          //console.log(this.bd.comprobarSiExisteConsulta(this.uidUsr));
          this.consultas = this.bd.getConsulta(this.uidUsr);
          
        }
        else{
          console.log(this.usuarioRecibido);
          
          this.consultas = this.bd.getConsulta(this.usuarioRecibido.id);
        }

        //UID DEL USUARIO QUE HIZO CONSULTA. NO UID PROPIO!!!!!
      })
      setTimeout(()=>{
        this.scrollAbajo();
      },1500)
    },2000);
  }


  enviar(){
    if(this.usuarioRecibido == undefined){
      this.bd.addConsulta(this.uidUsr ,this.texto);
    }
    else{
      this.bd.addConsulta(this.usuarioRecibido.id ,this.texto, this.uidUsr);
    }
    if(this.audio){
      this.reproducirAudio();
    }
    this.sendPush();
    this.texto= ''
    this.scrollAbajo();
  }


  scrollAbajo(){
    setTimeout(()=>{
      let objDiv = document.getElementById("divScroll");
      objDiv!.scrollTop = objDiv!.scrollHeight;
    },200)
      
    }


  sendPush() {
    this.pn
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
        'fm4xlg-sSq68XxRByM4_B5:APA91bG3Goa409xLoflRTRMQw9DZRfL8p_KfMSmsn00If23uaJAaDD6oq-4Gf17BpX8USwC11bT6bwidKtqKdaqbH_dpijGaWpG-RXOqDDeY1GrYMTR8oNcQvhLmwe_QR5hWuNdUiM4v'
        ],
        notification: {
          title: 'Nueva consulta:',
          body: this.texto,
        },
      })
      .subscribe((data: any) => {
        console.log(data);
      });
  }


  reproducirAudio(){
    const audio = new Audio();
    audio.src = '../../../assets/EnviarConsulta.mp3';
    audio.load();
    audio.play();
  }

}
