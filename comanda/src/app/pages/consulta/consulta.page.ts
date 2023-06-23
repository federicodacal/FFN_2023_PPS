import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  @ViewChild('endOfChat') endOfChat: ElementRef | undefined;
 
  @Input() usuarioRecibido?:any | undefined;

  texto = "";
  uidUsr = "";

  consultas: any;
  usuario: any; 

  constructor(private bd: BaseService, private auth: AuthService) { }

  ngOnInit(){
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
    this.texto= ''
    this.scrollAbajo();
  }


  scrollAbajo(){
    setTimeout(()=>{
      let objDiv = document.getElementById("divScroll");
      objDiv!.scrollTop = objDiv!.scrollHeight;
    },200)
      
    }

}
