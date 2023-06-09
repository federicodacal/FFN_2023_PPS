import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email!:any;
  pass!:any;
  show : boolean = false;

  constructor(private auth: AuthService, private router: Router, private bd : BaseService, private toastController : ToastController) { }

  ngOnInit() {
  }

  loginHarcodeado(){
    this.auth.logIn('treg@gmail.com', '123456')
    .then(response => this.router.navigateByUrl('/home'))
    .catch(error => console.log(error));
  }

  loguin()
  {
    this.auth.logIn(this.email, this.pass)
    .then((user)=>{
      this.bd.getUsuario(user.user.uid)
      .then((usr)=>{
        if(usr.data()?.estadoUsuario == 1)
        {
          if(usr.data()?.perfil == 'cliente' || usr.data()?.perfil == 'anonimo')
          {
            this.presentToast('bottom', 'Ingreso exitoso!', 'success');
            this.router.navigate(['/home']);
          }
          else if(usr.data()?.perfil == 'supervisor' || usr.data()?.perfil == 'duenio')
          {
            this.presentToast('bottom', 'Ingreso exitoso!', 'success');
            this.router.navigate(['/supervisar']);
          }
        }
        else if(usr.data()?.estadoUsuario == 0)
        {
          this.presentToast('middle', 'Tu cuenta aun no fue aceptada.', 'warning');
          this.auth.logOut();
        }
        else
        {
          this.presentToast('middle', 'Tu cuenta fue rechazada.', 'danger');
          this.auth.logOut();
        }
      })
    })
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msj:string, color: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 1000,
      position: position,
      color: color
    });

    await toast.present();
  }

}
