import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Cliente } from 'src/app/clases/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { UserActivoService } from 'src/app/services/user-activo.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email!:any;
  pass!:any;
  loginAnonimo : boolean = false;
  nombreAnonimo!:any;
  arrayUsuarios: Cliente [] = [];

  show : boolean = false;

  constructor(private userActual : UserActivoService, private authFire : Auth, private auth: AuthService, private router: Router, private bd : BaseService, private toastController : ToastController) { }

  ngOnInit() {
    //Si recargo o vuelvo hacia atras la sesion se mantiene.
    // this.authFire.signOut();
    this.bd.getUsuariosGeneral().subscribe(data => this.arrayUsuarios = data);
  }

  // loginHarcodeado(){
  //   this.auth.logIn('treg@gmail.com', '123456')
  //   .then(response => this.router.navigateByUrl('/home'))
  //   .catch(error => console.log(error));
  // }

  login()
  {
    this.show = true;
    setTimeout(()=>{
      this.show = false;
      this.auth.logIn(this.email, this.pass)
      .then((user)=>{
        this.bd.getUsuario(user.user.uid)
        .then((usr)=>{
          if(usr.data()?.estadoUsuario == 1)
          {

              this.presentToast('bottom', 'Ingreso exitoso!', 'success');
              this.router.navigate(['/home']);
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
    }, 1000);
  }

  loginAnon()
  {
    this.show=true;

    setTimeout(()=>{
      this.show = false;
      let ok = -1;
      this.arrayUsuarios.forEach((u : any) => {
        if(u.nombre == this.nombreAnonimo){
          console.log(u);
          ok = 0;
          if(u.perfil == 'anonimo') 
          {
            ok = 1;
            this.userActual.uActivo = u;
            this.router.navigate(['/home']); 
          }
        }
      });
      switch(ok)
      {
        case -1:
          this.presentToast('top', "Usuario erroneo.", "danger");
        break;
        case 0:
          this.presentToast('top', "El perfil del usuario no es anonimo.", "warning");
        break;
        case 1:
          this.presentToast('top', "Usuario ingresado con exito.", "success");
        break;
      }
    }, 1000)
  }

  accesoRapido(opcion : string)
  {
    switch(opcion)
    {
      case 'cliente':
        this.email = 'f@gmail.com'
        this.pass = '123456'
      break;
      case 'metre':
        this.email = 'testfoto@gmail.com'
        this.pass = '123456'
      break;
      case 'supervisor':
        this.email = 'supervisor1@gmail.com'
        this.pass = '123456'
      break;
      case 'mozo':
        //
        break;
      case 'anonimo':
        this.nombreAnonimo = 'testAnonimo'
      break;
    }
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

