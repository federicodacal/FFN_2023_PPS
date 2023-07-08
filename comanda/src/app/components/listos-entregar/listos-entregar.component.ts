import { Component, OnInit } from '@angular/core';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import { BaseService } from 'src/app/services/base.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-listos-entregar',
  templateUrl: './listos-entregar.component.html',
  styleUrls: ['./listos-entregar.component.scss'],
})
export class ListosEntregarComponent  implements OnInit {

  pedidos: any[] = [];
  constructor(private bd: BaseService, private pn: PushNotificationService) { }

  ngOnInit() {
    this.bd.getPedidosTerminados().subscribe(pedidos => {
      this.pedidos = pedidos;
    })
  }


  entregarPedido(pedido: any){
    this.bd.updateEstadoPedido('entregado', pedido.id);
  }



  
  sendPush() {
    this.pn
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
        'cBSDGcohSXiAPoeeq1MpnI:APA91bHHcJUEO3vc09FmBfa3EHmsDn-i1MYIUBiQYESbcd9pJzk5KV3ZQH21xY4vqT-Fz-oxEdlWb6c8hXCrY8iICHrGKp5OUIEnJeI-ZEan4u5ak_KREW4XyvtFVA1uNyq6MWyCunRh'
        ],
        notification: {
          title: '¡Pedido confirmado!',
          body: 'El mozo confirmó un pedido',
        },
      })
      .subscribe((data: any) => {
        console.log(data);
      });
  }
}
