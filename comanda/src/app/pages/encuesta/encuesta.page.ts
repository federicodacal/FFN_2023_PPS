import { Component, OnInit } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  usuarioActual: any = {};

  resRadioBtn!:string;

  cbChat!:string;
  cbEstadoPedido!:string;
  cbJuegos!:string;
  cbDni!:string;

  calificacion:number=5;
  resSelect!:string;
  comentario!:string;

  constructor(private toast:ToastController, private bd:BaseService, private auth:AuthService, private fs:Firestore) { }

  ngOnInit() {

    setTimeout(()=>{
      let uid = this.auth.getUid()!;

      this.bd.getUser(uid).subscribe((res:any) => {
        this.usuarioActual = res;
        console.log(this.usuarioActual);
      });
    },1000)
  }

  enviarEncuesta() {
    /*
    console.log('rb', this.resRadioBtn);
    console.log('cb chat', this.cbChat);
    console.log('cb pedido', this.cbEstadoPedido);
    console.log('cb juegos', this.cbJuegos);
    console.log('cb dni', this.cbDni);
    console.log('calificacion', this.calificacion);
    console.log('select', this.resSelect);
    console.log('comentario', this.comentario);
    */

    if(this.checkControles()) {

      const encuesta:any = {
        calificacion: this.calificacion,
        itemMasImporante: this.resRadioBtn,
        itemsUtilizados: {
          chat: this.cbChat != undefined ? true : false,
          estadoPedido: this.cbEstadoPedido != undefined ? true : false,
          juegos: this.cbJuegos != undefined ? true : false,
          dni: this.cbDni != undefined ? true : false,
        },
        interaccionQrs: this.resSelect,
        comentario: this.comentario != undefined ? this.comentario : ''
      };

      console.info(encuesta);

      this.bd.addEncuesta(encuesta);

      this.cambiarEstadoEncuesta();
    }

  }

  checkControles() {
    if(this.resRadioBtn != undefined && this.calificacion != undefined && this.resSelect != undefined) {
      this.presentToast('bottom', 'Gracias por responder nuestra encuesta!', 'success');
      return true;
    }
    else {
      this.presentToast('bottom', 'Quedaron campos sin completar', 'warning');
      return false;
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msj:string, color: string, duration:number=1000) {
    const toast = await this.toast.create({
      message: msj,
      duration: duration,
      position: position,
      color: color
    });

    await toast.present();
  }

  private async cambiarEstadoEncuesta() {
    const ref = doc(this.fs, 'usuarios', this.usuarioActual.uid);
    await updateDoc(ref, {completoEncuesta: true});
  }

  async mostrarGraficos() {
    setTimeout(() => {

    }, 1000);
  }

  

}
