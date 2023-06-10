import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { MailService } from 'src/app/services/mail.service';
import { Auth } from '@angular/fire/auth';
import { UserActivoService } from 'src/app/services/user-activo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usuario: any = {};
  usuarios: any[] = [];

  constructor(private userActivo : UserActivoService, private bd: BaseService, private auth: AuthService, private mail:MailService, private authFire : Auth) {}

  ngOnInit(){
    
    //No me funciona, tira undefined 
    // Promise.all([
    //   firstValueFrom( this.bd.getUsuariosGeneral())
    // ]).then((usrs) => {
    //   this.usuarios = usrs;
    // });

    //Con esta anduvo att:Nico
    this.bd.getUsuariosGeneral().subscribe(data => this.usuarios = data);

    if(this.userActivo.uActivo == "")
    {
      console.log(this.auth.getUid()!);
      this.bd.getUsuario(this.auth.getUid()!)
      .then(response => this.usuario =  response.data())
      .catch(error => console.log(error));
      console.log(this.auth.getUid()!);
      console.log(this.authFire.currentUser);
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
}
