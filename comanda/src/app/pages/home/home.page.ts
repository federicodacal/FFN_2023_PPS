import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { MailService } from 'src/app/services/mail.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usuario: any = {};
  usuarios: any[] = [];

  constructor(private bd: BaseService, private auth: AuthService, private mail:MailService) {}

  ngOnInit(){
    console.log(this.auth.getUid()!);
    this.bd.getUsuario(this.auth.getUid()!)
    .then(response => this.usuario =  response.data())
    .catch(error => console.log(error));
    console.log(this.auth.getUid()!);
    
    Promise.all([
      firstValueFrom( this.bd.getUsuariosGeneral())
    ]).then(([usrs]) => {
      this.usuarios = usrs;
    });
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
}
