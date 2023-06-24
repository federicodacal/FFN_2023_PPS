import { Component, Input, OnInit } from '@angular/core';
import { ToastButton, ToastController } from '@ionic/angular';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-pedidos-pagos',
  templateUrl: './pedidos-pagos.component.html',
  styleUrls: ['./pedidos-pagos.component.scss'],
})
export class PedidosPagosComponent  implements OnInit {


  @Input() audio?:any | undefined;

  pagos: any;
  constructor(private bd: BaseService, private toastController: ToastController) { }

  ngOnInit() {
    this.pagos = this.bd.getPedidosPagados();
  }


  confirmaraPago(p: any){
    let mesas: any[] = [];
    let usuario: any = {};
    console.log('q paso');
    this.bd.getUsuario(p.uid)
    .then((usr)=>{
      usuario = usr.data()!;
      this.bd.getMesas().subscribe(m =>{
        mesas = m;
        });
      }) 
    setTimeout(()=>{
      console.log('q paso3');
      console.log(mesas);
      mesas.forEach(m => {
        

        console.log(m.numero +' - '+ usuario.mesa)
        if(m.numero == usuario.mesa){
          m.libre = true;
          this.bd.updateEstadoMesa(m);
          console.log('q paso4');
          console.log(p.uid);
          this.bd.updateEstadoPagado('confirmado', p.id)
          .then(a =>{
            if(this.audio){
              this.reproducirAudio();

            }
            usuario.mesa = -1;
            this.bd.updateSoloMesaUsuario(usuario);
            this.bd.deletePedido(p.id);
          })
          this.presentToast('middle', 'Se confirmó el pago.', 'success');
        }
      });
      
    },2000)
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


  reproducirAudio(){
    const audio = new Audio();
    audio.src = '../../../assets/confirmarPago.mp3';
    audio.load();
    audio.play();
  }
}
